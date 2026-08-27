# openbat-guide-submit

A Cloudflare Worker that opens a field guide pull request on a contributor's
behalf, so contributing to the guide doesn't require a GitHub account.

The editor at [openbat.app/guide-editor/](https://openbat.app/guide-editor/)
reads the guide straight from GitHub, but a static page can't hold a token, so
it can't write. This worker holds the token instead.

## What it does, and what it deliberately can't

On `POST` it takes **one species entry**, fetches the current guide itself,
splices that entry in, commits to a new branch and opens a pull request.

- **It only ever opens a pull request.** It never pushes to `main`, never
  merges, and never touches a file other than `SpeciesGuideData.json`. That is
  what makes an open endpoint acceptable — the worst case for abuse is pull
  requests you close, and your review stays the gate.
- **It re-validates everything.** The browser runs the same checks, but those
  are a convenience; these are the real ones. Required fields, id format,
  region ids that actually exist, `imageCredit` whenever `imageURL` is set,
  `https://` image URLs only, and field length caps.
- **It protects attribution.** An existing species' `contributors` list may only
  be appended to. Anything that rewrites, reorders or removes an existing credit
  is rejected — those entries record other people's work.
- **It takes one species, not the whole file.** Two people editing different
  species hours apart can't clobber each other, and a submission built against a
  guide that has since moved still applies cleanly.
- **It doesn't touch the version fields.** See below — that job belongs to the
  field guide repo, on `main`, after a merge.

## Why consecutive pull requests used to conflict

The worker used to stamp `dataVersion` and `updatedAt` into every branch. Two
submissions off the same base bump `dataVersion` to the same number, and git
reads an identical change on both sides as agreement — but each wrote its own
`updatedAt`, so as soon as one pull request merged, every other open one
differed from `main` on that single line and had to be resolved by hand. The
species involved were irrelevant; a spelling fix to a bat in Australia
conflicted with a new photo credit on one in Yorkshire.

Three things fix it. The first two have to be deployed together:

1. **This worker writes neither field.** A branch carries `main`'s values
   through untouched, so there is nothing on those lines to disagree about.
2. **The `stamp` job in `.github/workflows/stamp-guide-version.yml` in
   [OpenBat-FieldGuide](https://github.com/NiallxD/OpenBat-FieldGuide)** bumps
   `dataVersion` and sets `updatedAt` on `main` after each merge. Without it
   the version never moves and no change reaches a device.

3. **The `reapply` job in that same workflow** handles what those two don't.
   After main moves, each open `guide/*` pull request is rebuilt: the entries it
   changed against its merge base are spliced into main's current guide, so
   where they sit in the file stops mattering. It merges by species, which is
   what the file actually is, rather than by lines, which is all git can see.
   It's a merge into the branch rather than a rebase of it, so pushes stay
   fast-forward and no contributor's branch is rewritten under them.

The worker also inserts a new species where its `id` sorts rather than at the
end of the array. That keeps the file in a predictable order, but be clear about
what it does **not** do: it doesn't stop two additions colliding. The insert
lands before the first entry with a greater id, so two bats in the same genus
resolve to the same anchor and conflict exactly as an append would. Only step 3
covers that.

What still conflicts, correctly, is two open pull requests editing **the same
species**. `reapply` deliberately leaves those alone — resolving one in main's
favour would silently discard a contribution. That is a genuine disagreement
about the same text and wants a human.

## Setup

1. **Create a fine-grained personal access token.**
   GitHub → Settings → Developer settings → Personal access tokens → Fine-grained.
   - Repository access: **only** `NiallxD/OpenBat-FieldGuide`
   - Repository permissions: **Contents: Read and write**, **Pull requests: Read and write**
   - Nothing else. This token can't reach any other repo, and can't merge.

2. **Create the rate-limit KV namespace** and put the id in `wrangler.toml`:

   ```sh
   npx wrangler kv namespace create RATE
   ```

3. **Set the token as a secret** (never in `wrangler.toml`, which is committed):

   ```sh
   npx wrangler secret put GITHUB_TOKEN
   ```

4. **Deploy:**

   ```sh
   npx wrangler deploy
   ```

5. **Point the site at it.** The worker's URL has to be in two places or the
   browser will block the request:
   - `connect-src` in `templates/base.njk`
   - `SUBMIT_URL` in `static/js/guide-editor.js`

   Using a custom domain (`api.openbat.app`) keeps both of those naming
   openbat.app rather than a third party — uncomment the `routes` block in
   `wrangler.toml` if the domain is on Cloudflare DNS.

## Limits

Per IP: **5 submissions an hour, 20 a day**, and a 64 KB body cap. KV is
eventually consistent, so the limit is a deterrent rather than a hard
guarantee — appropriate for something whose worst case is a pull request that
needs closing.

## Local development

```sh
npx wrangler dev
```

`http://localhost:8080` is already an allowed origin, so the site's `npm run dev`
can talk to it. With no `RATE` binding bound locally the limiter fails open.

## Watching it

```sh
npx wrangler tail
```

Failures log the full GitHub error server-side; the submitter only ever sees a
short message, since the detail says more about the repo than they need.
