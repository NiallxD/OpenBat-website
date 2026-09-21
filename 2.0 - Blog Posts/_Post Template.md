---
title: The post title, as it should read on the card and at the top of the page
description: One line. Used for the meta description, the social preview, and the card if no excerpt is set.
excerpt: Optional. Two sentences at most — this is the card text on /blog/.
date: 2026-01-01
author: Niall Bell
tags:
  - hardware
  - field-guide
coverImage: /static/images/some-image.webp
featured: false
priority:            # optional, featured posts only — 1 runs first in the ticker
inApp: false         # true also sends the post to the app, via /app/blog.json
appPriority:         # optional, in-app posts only — 1 runs first in the app
type: post           # the app's filter: post, field-note, guide, release…
latitude:            # optional — both of these together pin the post on the
longitude:           #   app's world map. Decimal degrees, e.g. 51.4545, -2.5879
locationName:        # optional — what the pin is called; the title if unset
publish: false
---

Write the post here in normal markdown. Headings, lists, images, callouts and
`[[Wikilinks]]` all work exactly as they do on the rest of the site.

This file has `publish: false`, so it never builds — it is here to be copied.

Anything with a number behind it wants a source. Keep the block below at the
foot of the post and delete it if the post genuinely cites nothing — the bare
URL is the link text, with a short note after the dash saying what the source
actually supports.

<details>
<summary>Sources</summary>

- [https://example.org/page](https://example.org/page) — what this one supports.
- [https://example.org/other](https://example.org/other) — what this one supports.

</details>
