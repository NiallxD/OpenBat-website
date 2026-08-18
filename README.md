
# OpenBat

This repo is one of three related to this project:

[OpenBat-App](https://github.com/NiallxD/OpenBat-App)
[OpenBat-FieldGuide](https://github.com/NiallxD/OpenBat-FieldGuide/tree/main)
[OpenBat-Website](https://github.com/NiallxD/OpenBat-website)

# OpenBat website

Static site for [openbat.app](https://openbat.app), built with [Eleventy](https://www.11ty.dev/)
and deployed to GitHub Pages on every push to `main`.

Claude Code was used to copy my existing website, strip it out of existing content, and produce a template to build on. I could have done this manually but that would have taken an age!

## Local development

```sh
npm install
npm run dev      # http://localhost:8080
npm run build    # writes to _site/
```

## Editing content

Each page is a single markdown file in `1.0 - Main Pages/`:

| File | URL |
|---|---|
| `Home.md` | `/` |
| `OpenBat.md` | `/openbat/` |
| `Help.md` | `/help/` |
| `Privacy.md` | `/privacy/` |
| `Contact.md` | `/contact/` |

Frontmatter needs `publish: true` and a `permalink` for a page to build.

Site-wide settings — name, domain, contact email, and the nav order — live in
`_data/site.js`.

## Adding a page

1. Create `1.0 - Main Pages/Your Page.md` with:
   ```yaml
   ---
   title: Your Page
   description: One line summary.
   permalink: /your-page/
   publish: true
   ---
   ```
2. Add `{ label: "Your Page", url: "/your-page/" }` to `nav` in `_data/site.js`.

## Notes

- No bundler and no external requests — the Content Security Policy in
  `templates/base.njk` allows same-origin resources only. Adding a webfont, CDN
  script, remote image or embed means adding its origin to the CSP, or it will
  fail silently in production.
- The vault is an Obsidian vault; `[[wikilinks]]` and Obsidian callouts render
  correctly on the site.
