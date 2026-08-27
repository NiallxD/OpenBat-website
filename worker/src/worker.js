/*
 * openbat-guide-submit — opens a field guide pull request on a contributor's
 * behalf, so contributing doesn't require a GitHub account.
 *
 * The guide editor at openbat.app/guide-editor/ can read the guide directly
 * from GitHub, but it can't write: that needs a token, and a static page can't
 * hold one. This worker holds it instead. It is the only piece of the system
 * with write access, so the rules it enforces are the real ones — the browser's
 * identical checks are a convenience, not a control.
 *
 * ## What it will and won't do
 *
 * It ONLY ever opens a pull request on a fresh branch. It never pushes to the
 * default branch, never merges, never touches any file but the guide. That is
 * what makes an open, unauthenticated endpoint acceptable: the worst outcome of
 * abuse is pull requests someone has to close, and human review stays the gate
 * on everything that actually ships.
 *
 * ## Why it takes one species and not the whole file
 *
 * The browser sends only the entry that was edited. This worker fetches the
 * current guide itself and splices that entry in. So two contributors working
 * hours apart on different species can't clobber one another, a submission
 * built against a guide that has since moved on still applies cleanly, and the
 * file's formatting is decided here, where it can't be got wrong, rather than
 * in a browser.
 *
 * ## Why it doesn't set the version
 *
 * It writes no `dataVersion` and no `updatedAt` — the branch inherits main's.
 * Stamping them per-submission made every pair of open pull requests conflict
 * on the `updatedAt` line regardless of which species they touched. The
 * stamp-guide-version workflow in the field guide repo bumps both on main
 * after a merge, which is the only place that can count what actually landed.
 * If that workflow is ever removed, this becomes a change that reaches nobody's
 * device: the two go together.
 *
 * ## Setup
 *
 * See README.md — a fine-grained token limited to the one repo, a KV namespace
 * for rate limiting, and two secrets.
 */

const REPO_OWNER = 'NiallxD';
const REPO_NAME  = 'OpenBat-FieldGuide';
const FILE_PATH  = 'SpeciesGuideData.json';
const BASE_BRANCH = 'main';

const ALLOWED_ORIGINS = ['https://openbat.app', 'http://localhost:8080'];

// Generous for a real contributor, tight enough that a script is a nuisance
// rather than a flood. Both windows apply.
const MAX_PER_HOUR = 5;
const MAX_PER_DAY  = 20;

// The guide's own entries run to a couple of KB; this is far above any honest
// submission and well below anything that would strain the worker.
const MAX_BODY_BYTES = 64 * 1024;

/* ------------------------------------------------------------------ helpers */

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin'
  };
}

function json(status, body, origin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) }
  });
}

// btoa/atob are byte-oriented, and the guide is full of en-dashes, accented
// contributor names and species text. Going through TextEncoder/TextDecoder is
// what keeps those intact — a naive btoa(string) mangles anything non-ASCII.
function b64encode(text) {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function b64decode(b64) {
  const binary = atob(b64.replace(/\s/g, ''));
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder('utf-8').decode(bytes);
}

// Matches the editor's own pruning: the schema asks for absent fields rather
// than empty ones, because the app renders a section whenever it is present.
function prune(value) {
  if (Array.isArray(value)) {
    const arr = value.map(prune).filter((v) => v !== undefined);
    return arr.length ? arr : undefined;
  }
  if (value && typeof value === 'object') {
    const out = {};
    for (const k of Object.keys(value)) {
      const v = prune(value[k]);
      if (v !== undefined) out[k] = v;
    }
    return Object.keys(out).length ? out : undefined;
  }
  if (typeof value === 'string') {
    const t = value.trim();
    return t.length ? t : undefined;
  }
  if (value === null || value === undefined) return undefined;
  if (typeof value === 'number' && !isFinite(value)) return undefined;
  return value;
}

function slugOK(id) { return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(id); }

/* ---------------------------------------------------------------- GitHub API */

async function gh(env, path, init = {}) {
  const res = await fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      'Authorization': `Bearer ${env.GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      // GitHub rejects API requests without one.
      'User-Agent': 'openbat-guide-submit',
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      ...(init.headers || {})
    }
  });
  if (!res.ok) {
    const detail = await res.text();
    const err = new Error(`GitHub ${path} -> ${res.status}: ${detail.slice(0, 300)}`);
    // 401/403 from GitHub is the token being wrong or under-scoped, not a blip.
    // Worth separating: telling someone to "try again" when the service is
    // misconfigured wastes their time and hides the real problem. This happened
    // for real on first deploy — the token had Contents:read but not write, so
    // reads and validation succeeded and branch creation failed.
    err.isConfig = res.status === 401 || res.status === 403;
    throw err;
  }
  return res.json();
}

/* ----------------------------------------------------------- rate limiting */

// KV is eventually consistent, so this is a deterrent rather than a hard
// guarantee — which is the right level for something whose worst case is a
// pull request that needs closing.
//
// Checking and counting are deliberately SEPARATE, and only a submission that
// actually opened a pull request is counted. The first version counted every
// attempt, and the effect was that a contributor whose submissions were being
// rejected — by a validation error they were busy fixing, or by our own
// misconfigured token — got locked out for an hour by the failures. The thing
// worth limiting is pull requests created, and that is the only thing that now
// increments.
function rateKeys(ip) {
  const now = new Date();
  return {
    hour: `rl:h:${ip}:${now.toISOString().slice(0, 13)}`,
    day:  `rl:d:${ip}:${now.toISOString().slice(0, 10)}`
  };
}

async function rateLimited(env, ip) {
  if (!env.RATE) return false;             // unset in local dev; fail open
  const k = rateKeys(ip);
  const [h, d] = await Promise.all([env.RATE.get(k.hour), env.RATE.get(k.day)]);
  return parseInt(h || '0', 10) >= MAX_PER_HOUR || parseInt(d || '0', 10) >= MAX_PER_DAY;
}

async function recordSubmission(env, ip) {
  if (!env.RATE) return;
  const k = rateKeys(ip);
  const [h, d] = await Promise.all([env.RATE.get(k.hour), env.RATE.get(k.day)]);
  await Promise.all([
    env.RATE.put(k.hour, String(parseInt(h || '0', 10) + 1), { expirationTtl: 7200 }),
    env.RATE.put(k.day,  String(parseInt(d || '0', 10) + 1), { expirationTtl: 172800 })
  ]);
}

/* ----------------------------------------------------------------- validate */

// Deliberately a full re-check rather than trusting the page that called us.
// Everything here mirrors the contributor guide's schema rules.
function validate(species, guide) {
  const problems = [];
  if (!species || typeof species !== 'object' || Array.isArray(species)) {
    return ['The submission didn’t include a species entry.'];
  }

  if (!species.id) problems.push('An ID is required.');
  else if (!slugOK(species.id)) problems.push('The ID must be lowercase words separated by hyphens.');
  if (!species.commonName) problems.push('A common name is required.');
  if (!species.scientificName) problems.push('A scientific name is required.');
  if (!Array.isArray(species.regions) || !species.regions.length) {
    problems.push('At least one region is required.');
  }

  if (species.imageURL && !species.imageCredit) {
    problems.push('An image credit is required whenever an image URL is set.');
  }
  // Only ordinary web images, and only over TLS — this URL ends up being
  // fetched by every copy of the app.
  if (species.imageURL && !/^https:\/\//i.test(species.imageURL)) {
    problems.push('An image URL must start with https://.');
  }

  const knownRegions = new Set((guide.regions || []).map((r) => r.id));
  for (const r of species.regions || []) {
    if (!knownRegions.has(r)) problems.push(`Unknown region "${r}".`);
  }

  for (const [key, val] of Object.entries(species)) {
    if (typeof val === 'string' && val.length > 8000) {
      problems.push(`The "${key}" field is unreasonably long.`);
    }
  }

  // The attribution rule, enforced where it actually counts. An existing
  // species' contributor list may only be appended to: those entries record
  // other people's work, and nothing submitted from a browser may rewrite or
  // remove them.
  const current = (guide.species || []).find((s) => s.id === species.id);
  if (current) {
    const locked = current.contributors || [];
    const submitted = species.contributors || [];
    const kept = submitted.slice(0, locked.length);
    if (JSON.stringify(kept) !== JSON.stringify(locked)) {
      problems.push('Existing contributor credits can’t be changed or removed.');
    }
  }

  return problems;
}

/* --------------------------------------------------------------- the handler */

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }
    if (request.method !== 'POST') {
      return json(405, { error: 'Send a POST.' }, origin);
    }
    if (origin && !ALLOWED_ORIGINS.includes(origin)) {
      return json(403, { error: 'Not an allowed origin.' }, origin);
    }
    if (!env.GITHUB_TOKEN) {
      return json(500, { error: 'The submission service isn’t configured.' }, origin);
    }

    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    if (await rateLimited(env, ip)) {
      return json(429, {
        error: 'That’s a lot of submissions in a short time. Try again later, or open a pull request directly on GitHub.'
      }, origin);
    }

    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) {
      return json(413, { error: 'That submission is too large.' }, origin);
    }

    let payload;
    try { payload = JSON.parse(raw); }
    catch { return json(400, { error: 'The submission wasn’t valid JSON.' }, origin); }

    const species = prune(payload.species);
    const note = typeof payload.note === 'string' ? payload.note.slice(0, 500) : '';

    try {
      // 1. The guide as it is RIGHT NOW — not whatever the browser loaded.
      const fileMeta = await gh(env, `/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}?ref=${BASE_BRANCH}`);
      const guide = JSON.parse(b64decode(fileMeta.content));

      const problems = validate(species, guide);
      if (problems.length) return json(400, { error: problems.join(' '), problems }, origin);

      // 2. Splice the one entry in, a new species going where its id sorts to
      //    rather than onto the end of the array.
      //
      //    Be clear about what that does and doesn't buy. It keeps the file in
      //    a predictable order, and it separates two additions when an existing
      //    entry sorts between them. It does NOT stop two new species
      //    colliding in general: the insert lands before the first entry with a
      //    greater id, so two bats in the same genus — myotis-evotis and
      //    myotis-volans — resolve to the same anchor and conflict just as an
      //    append would. That case is handled after the fact, by the reapply
      //    job in stamp-guide-version.yml, which merges by species rather than
      //    by lines.
      const index = guide.species.findIndex((s) => s.id === species.id);
      const isNew = index < 0;
      if (isNew) {
        const before = guide.species.findIndex((s) => s.id > species.id);
        guide.species.splice(before < 0 ? guide.species.length : before, 0, species);
      } else {
        guide.species[index] = species;
      }

      // 3. `dataVersion` and `updatedAt` are deliberately left ALONE — the
      //    branch carries main's values through untouched.
      //
      //    Stamping them here was the single largest source of merge
      //    conflicts. `dataVersion` was survivable, since two submissions off
      //    the same base both bump it to the same number and git reads an
      //    identical change on both sides as agreement. `updatedAt` was not:
      //    every submission wrote its own timestamp, so the moment one pull
      //    request merged, every other open one differed from main on that one
      //    line and needed resolving by hand — even when the two touched
      //    entirely unrelated species.
      //
      //    The stamp-guide-version workflow in the field guide repo does the
      //    bump on main after a merge instead. That is the only place that can
      //    see how many submissions actually landed, which is what the number
      //    is supposed to count.

      // 4. Canonical formatting, so the pull request diff is only the entry
      //    that changed. The committed guide is kept in this exact shape.
      const updated = JSON.stringify(guide, null, 2) + '\n';

      // 5. Branch off the current head.
      const baseRef = await gh(env, `/repos/${REPO_OWNER}/${REPO_NAME}/git/ref/heads/${BASE_BRANCH}`);
      const branch = `guide/${species.id}-${Date.now().toString(36)}`;
      await gh(env, `/repos/${REPO_OWNER}/${REPO_NAME}/git/refs`, {
        method: 'POST',
        body: JSON.stringify({ ref: `refs/heads/${branch}`, sha: baseRef.object.sha })
      });

      // 6. Commit onto it. `sha` is the file's blob sha, which is how GitHub
      //    rejects the write if the file moved under us.
      const who = (species.contributors || []).slice(-1)[0]?.name || 'an anonymous contributor';
      await gh(env, `/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
        method: 'PUT',
        body: JSON.stringify({
          message: `${isNew ? 'Add' : 'Update'} ${species.commonName} in the field guide`,
          content: b64encode(updated),
          sha: fileMeta.sha,
          branch
        })
      });

      // 7. Open the pull request.
      const pr = await gh(env, `/repos/${REPO_OWNER}/${REPO_NAME}/pulls`, {
        method: 'POST',
        body: JSON.stringify({
          title: `${isNew ? 'Add' : 'Update'} ${species.commonName} (${species.scientificName})`,
          head: branch,
          base: BASE_BRANCH,
          body: [
            `Submitted through the [field guide editor](https://openbat.app/guide-editor/) by **${who}**.`,
            '',
            isNew ? `Adds a new species entry, \`${species.id}\`.`
                  : `Updates the existing entry \`${species.id}\`.`,
            note ? `\n**Note from the contributor:**\n\n> ${note.replace(/\n/g, '\n> ')}` : '',
            '',
            '---',
            '*This came from a web form, so it has had no human review yet — ' +
            'please check the wording is the contributor\'s own and that any ' +
            'image is correctly licensed and credited before merging.*'
          ].filter(Boolean).join('\n')
        })
      });

      // Counted here and nowhere else — a pull request exists now, which is the
      // only thing the limit is protecting against.
      await recordSubmission(env, ip);

      return json(200, { ok: true, url: pr.html_url, number: pr.number }, origin);

    } catch (err) {
      // The detail is useful in `wrangler tail` but says more about the repo
      // than a submitter needs to see.
      console.error(err.stack || String(err));
      if (err.isConfig) {
        return json(503, {
          error: 'The submission service isn’t set up correctly at our end, so this can’t be ' +
                 'sent right now — retrying won’t help. Nothing was lost: download your edit ' +
                 'below and open a pull request yourself, or try again later once it’s fixed.',
          configError: true
        }, origin);
      }
      return json(502, {
        error: 'Couldn’t open the pull request. Nothing was saved — please try again, ' +
               'or download the file and open a pull request yourself.'
      }, origin);
    }
  }
};
