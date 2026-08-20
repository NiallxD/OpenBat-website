# openbat-guide-submit

A Cloudflare Worker that opens a field guide pull request on a contributor's
behalf, so contributing to the guide doesn't require a GitHub account.

The editor at [openbat.app/guide-editor/](https://openbat.app/guide-editor/)
reads the guide straight from GitHub, but a static page can't hold a token, so
it can't write. This worker holds the token instead.

## What it does, and what it deliberately can't

On `POST` it takes **one species entry**, fetches the current guide itself,
splices that entry in, bumps `dataVersion`, commits to a new branch and opens a
pull request.

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
- **It decides the version fields**, never the client. Forgetting the
  `dataVersion` bump is the mistake that silently stops a change reaching
  anyone's device, so it isn't left to a browser.
- **It takes one species, not the whole file.** Two people editing different
  species hours apart can't clobber each other, and a submission built against a
  guide that has since moved still applies cleanly.

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
