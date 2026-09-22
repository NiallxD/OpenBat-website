// The app feed: /app/blog.json.
//
// The website already renders every post to HTML for its own pages. The app
// takes the same body, minus everything that only makes sense in a browser on
// openbat.app — the canvas charts it can't run, the site classes it doesn't
// know, the root-relative URLs it has no base for. See BlogFeedSpec.md in the
// app repo for the contract this file implements; anything changed here is a
// change to that contract.

import { createHash } from "crypto";
import { readFileSync, writeFileSync } from "fs";
import { transformCallouts, appCallout } from "./callouts.js";
import { imageSize } from "./image-size.js";

export const SCHEMA_VERSION = 1;

// Where the running count of content changes is kept. Committed, because
// `dataVersion` has to keep going up across builds and machines — see
// stampVersion below.
const STAMP_FILE = "app-feed-version.json";

// The only classes the app styles. Everything else is stripped rather than
// shipped: an unknown class renders as plain prose in the app, so the choice
// is between prose and a lie about what the app will do with it.
const KEEP_CLASS = /^(callout|callout-[\w-]+|chart|chart-table)$/;

// The site's own figures set their colours from CSS variables that only exist
// on openbat.app. The app's stylesheet doesn't define them, and an undefined
// var() in a `fill` is an invalid property, so every hand-drawn SVG would fall
// back to black — invisible in the app's dark mode. Giving each var a fallback
// keeps the site's own value where it exists and hands the app something that
// follows its text colour where it doesn't.
const VAR_FALLBACK = {
  "--color-text": "currentColor",
  "--color-secondary": "color-mix(in srgb, currentColor 72%, transparent)",
  "--color-muted": "color-mix(in srgb, currentColor 55%, transparent)",
  "--color-border": "color-mix(in srgb, currentColor 25%, transparent)",
  "--color-surface": "color-mix(in srgb, currentColor 8%, transparent)",
  // The brand orange rather than the darkened text orange: these are fills in
  // a diagram, and the app may well be drawing them on a near-black page.
  "--color-accent": "#FF860D",
};

// What .chart-label and friends do in style.css, inlined — the classes
// themselves don't survive KEEP_CLASS, and an SVG label at the default 16px
// overruns the box it was drawn to sit in.
const LABEL_STYLE = {
  "chart-label": "font-size:13px",
  "chart-label--small": "font-size:11px",
  "chart-key": "font-size:13px;letter-spacing:0.06em",
};

const ENTITIES = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ",
  hellip: "…", mdash: "—", ndash: "–", rsquo: "’",
  lsquo: "‘", ldquo: "“", rdquo: "”", times: "×",
  deg: "°", middot: "·", minus: "−",
};

const decodeEntities = (s) =>
  String(s)
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    // &amp; last would double-decode &amp;lt; — the map is applied in one pass.
    .replace(/&(\w+);/g, (m, name) => ENTITIES[name] ?? m);

const plainText = (html) =>
  decodeEntities(String(html).replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();

const slugFromUrl = (url) => String(url || "").replace(/^\/blog\//, "").replace(/\/$/, "");

const isoDate = (d) =>
  d instanceof Date ? d.toISOString().slice(0, 10) : String(d || "").slice(0, 10);


// ── Charts ──────────────────────────────────────────────────────
// The canvas carries its whole spec in a data-chart attribute, which is what
// makes a static figure possible at all: the app gets the numbers, not a
// picture of them.
const escapeHtml = (s) =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const formatValue = (n) =>
  Number.isFinite(n) ? new Intl.NumberFormat("en-GB").format(n) : String(n);

const row = (head, cell) =>
  `<tr><th scope="row">${escapeHtml(head)}</th><td>${escapeHtml(cell)}</td></tr>`;

const table = (key, body) =>
  `<table class="chart-table">${key ? `<caption>${escapeHtml(key)}</caption>` : ""}${body}</table>`;

function chartFigure(canvasAttrs) {
  const raw = canvasAttrs.match(/\bdata-chart="([^"]*)"/)?.[1];
  const label = decodeEntities(canvasAttrs.match(/\baria-label="([^"]*)"/)?.[1] || "");
  let spec = null;
  try {
    spec = JSON.parse(decodeEntities(raw));
  } catch {
    spec = null;
  }
  if (!spec) return label ? `<p>${escapeHtml(label)}</p>` : "";

  if (spec.type === "bar") {
    const body = (spec.bars || [])
      .map((b) =>
        row(
          b.label,
          b.note ||
            (b.from !== undefined ? `${formatValue(b.from)} to ${formatValue(b.to)}` : formatValue(b.value))
        )
      )
      .join("");
    return table(spec.key, `<tbody>${body}</tbody>`);
  }

  // A line or scatter with no numbers on its axis is a shape rather than a
  // measurement — a season, a night, a trade-off — and tabling it would print
  // values the post never claimed. Those become the description instead, which
  // is the claim in words. The ones with a real axis get their real numbers.
  if (!spec.yTicks) return label ? `<p>${escapeHtml(label)}</p>` : "";

  const labels = (spec.labels || []).map(String);
  const series = spec.series || [];
  if (spec.type === "scatter") {
    const body = series
      .map((s) =>
        row(
          s.name || "series",
          (s.data || []).map((d) => `(${formatValue(d.x)}, ${formatValue(d.y)})`).join("; ")
        )
      )
      .join("");
    return table(spec.key, `<tbody>${body}</tbody>`);
  }

  const head = labels.length
    ? `<thead><tr><th></th>${labels.map((l) => `<th scope="col">${escapeHtml(l)}</th>`).join("")}</tr></thead>`
    : "";
  const body = series
    .map(
      (s) =>
        `<tr><th scope="row">${escapeHtml(s.name || "series")}</th>` +
        (s.data || []).map((v) => `<td>${escapeHtml(formatValue(Number(v)))}</td>`).join("") +
        `</tr>`
    )
    .join("");
  return table(spec.key, `${head}<tbody>${body}</tbody>`);
}

// ── The body ────────────────────────────────────────────────────
// Turns a rendered post body into the fragment the app renders. Order matters:
// the chart canvases go before the script strip (the canvas carries its spec
// in an attribute, not a script), and the label classes are inlined before
// KEEP_CLASS throws the classes away.
export function appFragment(html, { siteUrl, inAppSlugs = new Set() } = {}) {
  let out = String(html || "");

  // Obsidian leftovers, exactly as the website's own transform drops them.
  out = out.replace(/<p>(\s*#[\w-]+)+\s*<\/p>/g, "");
  out = out.replace(/<p[^>]*id="reading-time"[^>]*>[\s\S]*?<\/p>/g, "");

  out = transformCallouts(out, appCallout);

  // Charts: the canvas goes and the figure is redrawn from the spec the canvas
  // was carrying. Same numbers, no charting library in the app, works offline.
  // The site's own <noscript> table goes with it — it is a summary written for
  // a browser that will almost always draw the real chart, and here it would
  // be the whole figure.
  out = out.replace(
    /<div class="chart-canvas"[^>]*>\s*<canvas([^>]*)>\s*<\/canvas>\s*<\/div>\s*(?:<noscript>[\s\S]*?<\/noscript>)?/g,
    (m, attrs) => chartFigure(attrs)
  );
  out = out.replace(/<noscript>[\s\S]*?<\/noscript>/g, "");

  // Nothing executable, and no stylesheet to fight the app's own.
  out = out.replace(/<script\b[\s\S]*?<\/script>/gi, "");
  out = out.replace(/<style\b[\s\S]*?<\/style>/gi, "");
  out = out.replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "");

  // Hand-drawn SVG figures.
  out = out.replace(/var\(\s*(--color-[\w-]+)\s*\)/g, (m, name) =>
    VAR_FALLBACK[name] ? `var(${name}, ${VAR_FALLBACK[name]})` : m
  );
  out = out.replace(/<(text|tspan)\b([^>]*?)class="([^"]*)"([^>]*)>/g, (m, tag, pre, cls, post) => {
    const styles = cls.split(/\s+/).map((c) => LABEL_STYLE[c]).filter(Boolean).join(";");
    if (!styles) return m;
    const attrs = `${pre}${post}`;
    return /style="/.test(attrs)
      ? `<${tag}${attrs.replace(/style="([^"]*)"/, (_, s) => `style="${s};${styles}"`)}>`
      : `<${tag}${pre}style="${styles}"${post}>`;
  });

  // Links. Three kinds, and the app tells them apart from the href alone:
  // another in-app post is a push, anything else on the site or off it is
  // Safari. Only the build knows which posts are in the feed.
  out = out.replace(/(<a\b[^>]*?\bhref=")([^"]*)(")/gi, (m, pre, href, post) => {
    if (/^(https?:|mailto:|openbat:|#)/i.test(href)) return m;
    if (!href.startsWith("/")) return m;
    const slug = slugFromUrl(href.split(/[?#]/)[0]);
    if (slug && inAppSlugs.has(slug)) return `${pre}openbat://post/${slug}${post}`;
    return `${pre}${siteUrl}${href}${post}`;
  });

  // Images: absolute, and sized so the layout doesn't jump.
  out = out.replace(/<img\b([^>]*)>/gi, (m, attrs) => {
    const src = attrs.match(/\bsrc="([^"]*)"/i)?.[1];
    if (!src) return m;
    let next = attrs;
    if (src.startsWith("/")) {
      const size = imageSize(src.replace(/^\//, "").split(/[?#]/)[0]);
      if (size && !/\bwidth=/i.test(attrs)) {
        next += ` width="${size.width}" height="${size.height}"`;
      }
      next = next.replace(/\bsrc="[^"]*"/i, `src="${siteUrl}${src}"`);
    }
    return `<img${next}>`;
  });

  // Classes the app doesn't style say nothing to it.
  out = out.replace(/\sclass="([^"]*)"/g, (m, cls) => {
    const kept = cls.split(/\s+/).filter((c) => KEEP_CLASS.test(c));
    return kept.length ? ` class="${kept.join(" ")}"` : "";
  });

  return out.replace(/\n{3,}/g, "\n\n").trim();
}

// ── Place and kind ──────────────────────────────────────────────
// `latitude`/`longitude` in a post's frontmatter pin it to the app's world
// map. The names match the ones the field guide's regions already use in
// SpeciesGuideData.json, so a contributor writes the same two keys wherever
// they are. Both are required together and both have to be real coordinates —
// a half-written pair is dropped rather than guessed at, because a pin in the
// wrong hemisphere is worse than no pin.
function location(d, title) {
  // An empty key in the template is YAML null, not a missing key, and Number(null)
  // is 0 — which would pin a post to the Gulf of Guinea rather than nowhere.
  const given = (v) => v !== undefined && v !== null && String(v).trim() !== "";
  if (!given(d.latitude) && !given(d.longitude)) return null;
  const lat = Number(d.latitude);
  const lon = Number(d.longitude);
  const ok =
    given(d.latitude) && given(d.longitude) &&
    Number.isFinite(lat) && Number.isFinite(lon) &&
    Math.abs(lat) <= 90 && Math.abs(lon) <= 180;
  if (!ok) {
    console.warn(`[app feed] "${title}": latitude/longitude ignored — both are required, and within \u00b190 / \u00b1180.`);
    return null;
  }
  const out = { latitude: lat, longitude: lon };
  // What the pin is called when it is tapped. The title is the fallback, so
  // this is only worth setting when the place has a name of its own.
  if (given(d.locationName)) out.name = String(d.locationName).trim();
  return out;
}

// `type` is the app's filter — one kind per post, lowercase, and "post" when a
// post doesn't say. Deliberately not validated against a list here: the app
// decides what it offers as a filter, and a build that rejected an unknown
// kind would stop the two from ever being changed in either order.
const postType = (d) =>
  String(d.type || "post").toLowerCase().trim().replace(/\s+/g, "-") || "post";

// ── The record ──────────────────────────────────────────────────
function appPost(item, ctx) {
  const d = item.data || {};
  const html = appFragment(item.templateContent, ctx);
  // The sources block is citations: a post shouldn't match a search because of
  // a URL in its footnotes.
  const body = plainText(html.replace(/<details\b[\s\S]*?<\/details>/gi, " "));
  const excerpt = d.excerpt || d.description || "";
  const words = body.split(/\s+/).filter(Boolean).length;

  const place = location(d, d.title || "");
  const cover = d.coverImage
    ? (String(d.coverImage).startsWith("/") ? `${ctx.siteUrl}${d.coverImage}` : String(d.coverImage))
    : null;

  // Field order follows BlogFeedSpec, and an absent optional field is left out
  // rather than sent as null — the app's decoder treats missing and null the
  // same, and a feed full of nulls is harder to read.
  const post = {
    id: slugFromUrl(item.url),
    title: d.title || "",
    excerpt: String(excerpt).trim(),
    date: isoDate(item.date),
    ...(d.updated ? { updated: isoDate(d.updated) } : {}),
    ...(d.author ? { author: String(d.author) } : {}),
    type: postType(d),
    tags: (d.tags || []).map((t) => String(t).toLowerCase().trim()),
    ...(place ? { location: place } : {}),
    ...(cover ? { coverImage: cover } : {}),
    url: `${ctx.siteUrl}${item.url}`,
    searchText: plainText([d.title, excerpt].filter(Boolean).join(". ")) + " " + body,
    readingMinutes: Math.max(1, Math.round(words / 200)),
    html,
  };

  return post;
}

// `appPriority` orders the feed the way `priority` orders the ticker: 1 first,
// then 2, and a post without one follows every post that has one, newest
// first. Same rule, so an author only has to learn it once.
const byAppOrder = (a, b) => {
  const pa = Number(a.data.appPriority);
  const pb = Number(b.data.appPriority);
  const ha = Number.isFinite(pa);
  const hb = Number.isFinite(pb);
  if (ha && hb && pa !== pb) return pa - pb;
  if (ha !== hb) return ha ? -1 : 1;
  return (b.date || 0) - (a.date || 0);
};

// `dataVersion` has to increase whenever the content does, and a build has no
// memory — so the count is kept in a committed file next to the source. The
// build hashes the posts, and when the hash differs from the stamp it bumps
// the number and writes the stamp back. Commit it with the change that caused
// it; an uncommitted stamp means the next content change reuses the same
// number, and the app keeps a stale copy.
//
// **The number is also floored by the clock**, and that is not decoration. The
// app takes a feed only when its `dataVersion` is strictly greater than the one
// it has cached, so a version that goes *backwards* — a lost stamp file, a
// fresh clone, a reverted commit — is invisible to every device that already
// fetched: it keeps the older feed and nothing you publish reaches it. Minutes
// since 2026 can't go backwards, so the worst a lost stamp can now do is skip
// some numbers, which costs nothing.
//
// `npm run dev` deliberately doesn't stamp: a watched build runs on every
// keystroke-ish save, and each one would burn a version number that no device
// ever sees. It serves whatever the stamp already says instead.
const VERSION_EPOCH = Date.UTC(2026, 0, 1);

function stampVersion(posts, write) {

  const hash = createHash("sha256").update(JSON.stringify(posts)).digest("hex").slice(0, 16);
  let stamp = { dataVersion: 0, hash: "", updatedAt: "" };
  try {
    stamp = { ...stamp, ...JSON.parse(readFileSync(STAMP_FILE, "utf8")) };
  } catch {
    // No stamp yet: this is version 1.
  }
  if (!write || (stamp.hash === hash && stamp.updatedAt)) return stamp;

  const next = {
    dataVersion: Math.max(
      Number(stamp.dataVersion || 0) + 1,
      Math.floor((Date.now() - VERSION_EPOCH) / 60000)
    ),
    hash,
    // Not "now" on every build: a rebuild that changed nothing has to produce
    // a byte-identical file, or the ETag moves and every app refetches.
    updatedAt: new Date().toISOString().replace(/\.\d+Z$/, "Z"),
  };
  try {
    writeFileSync(STAMP_FILE, JSON.stringify(next, null, 2) + "\n");
  } catch {
    // A read-only checkout still builds; it just repeats the last version.
  }
  return next;
}

export function buildFeed(collection, siteUrl, { stamp = true } = {}) {
  const included = (collection || [])
    .filter((i) => i.data?.inApp === true && String(i.data.publish).trim().toLowerCase() === "true")
    .sort(byAppOrder);

  const inAppSlugs = new Set(included.map((i) => slugFromUrl(i.url)));
  const ctx = { siteUrl, inAppSlugs };
  const posts = included.map((i) => appPost(i, ctx));
  const version = stampVersion(posts, stamp);

  return {
    schemaVersion: SCHEMA_VERSION,
    dataVersion: version.dataVersion,
    updatedAt: version.updatedAt,
    posts,
  };
}
