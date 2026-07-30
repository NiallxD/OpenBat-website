---
title: Image Examples
description: Reference examples for the floated image and gallery patterns.
permalink: /image-examples/
publish: true
noindex: true
---

## Floated Image (right)

<figure class="image-float-right">
<img src="/static/images/logo.png" alt="Describe the image for accessibility"><figcaption>Caption text goes here, describing the image.</figcaption>
</figure>

Paragraph text sits next to the image and wraps below it once it runs past the image's height. Use `image-float-right` to put the image on the right of the text, or `image-float-left` to put it on the left. Swap the `src` and `alt`, and edit or remove the `figcaption`.

```html
<figure class="image-float-right">
<img src="/static/images/your-image.webp" alt="Describe the image for accessibility"><figcaption>Caption text goes here.</figcaption>
</figure>

Paragraph text goes here.
```

## Floated Image (left)

<figure class="image-float-left">
<img src="/static/images/logo.png" alt="Describe the image for accessibility"><figcaption>Caption text goes here, describing the image.</figcaption>
</figure>

Same as above but floated to the left instead, so the text flows down the right-hand side of the image.

```html
<figure class="image-float-left">
<img src="/static/images/your-image.webp" alt="Describe the image for accessibility"><figcaption>Caption text goes here.</figcaption>
</figure>

Paragraph text goes here.
```

## Floated Image (custom width)

<figure class="image-float-right" style="width:75%">
<img src="/static/images/logo.png" alt="Describe the image for accessibility"><figcaption>Caption text goes here, describing the image.</figcaption>
</figure>

Add an inline `style="width:75%"` to override the default 45% split — the text fills whatever's left. Works with `image-float-left` too.

```html
<figure class="image-float-right" style="width:75%">
<img src="/static/images/your-image.webp" alt="Describe the image for accessibility"><figcaption>Caption text goes here.</figcaption>
</figure>

Paragraph text goes here.
```

## Block Image (own line, no wrap)

<figure>
<img src="/static/images/logo.png" alt="Describe the image for accessibility"><figcaption>Caption text goes here, describing the image.</figcaption>
</figure>

Full-width image on its own line, with text starting below it rather than wrapping alongside. Just leave off the `image-float-*` class. Drop the `<figcaption>` (and the `<figure>` wrapper entirely) if you don't need a caption — a plain `![alt](/path.webp)` works too.

```html
<figure>
<img src="/static/images/your-image.webp" alt="Describe the image for accessibility"><figcaption>Caption text goes here.</figcaption>
</figure>

Paragraph text goes here.
```

## Block Image (custom width, centered)

<figure>
<img src="/static/images/logo.png" alt="Describe the image for accessibility" style="width:60%;margin:0 auto;"><figcaption>Caption text goes here, describing the image.</figcaption>
</figure>

Add an inline `style="width:60%;margin:0 auto;"` to the `<img>` to narrow it and center it within the block. Drop the `margin:0 auto` to left-align instead.

```html
<figure>
<img src="/static/images/your-image.webp" alt="Describe the image for accessibility" style="width:60%;margin:0 auto;"><figcaption>Caption text goes here.</figcaption>
</figure>

Paragraph text goes here.
```

## Image Pair

<div class="image-pair">
<figure class="image-float-right">
<img src="/static/images/logo.png" alt="First image description"><figcaption>Caption for the first image.</figcaption>
</figure>
<figure class="image-float-right">
<img src="/static/images/logo.png" alt="Second image description"><figcaption>Caption for the second image.</figcaption>
</figure>
</div>

Two images placed side by side, each at half width, useful for before/after or paired shots.

```html
<div class="image-pair">
<figure class="image-float-right">
<img src="/static/images/your-image-1.webp" alt="First image description"><figcaption>Caption for the first image.</figcaption>
</figure>
<figure class="image-float-right">
<img src="/static/images/your-image-2.webp" alt="Second image description"><figcaption>Caption for the second image.</figcaption>
</figure>
</div>
```

## Gallery (Swiper carousel)

## gallery-start

## First Slide
Caption for the first slide goes here.
/static/images/logo.png

## Second Slide
Caption for the second slide goes here.
/static/images/logo.png

## gallery-end

A swipeable carousel at any screen size. Each `## Title` inside the block becomes one slide — put the image URL on its own line directly under the title, and any text above the image URL becomes that slide's caption (only the first slide's caption is shown by default as you swipe between slides). Add `[AR]` to a title (e.g. `## My Title [AR]`) to show that slide at its native aspect ratio instead of the default crop.

```markdown
## gallery-start

## First Slide
Caption for the first slide goes here.
/static/images/your-image-1.webp

## Second Slide
Caption for the second slide goes here.
/static/images/your-image-2.webp

## gallery-end
```

## Gallery (native aspect ratio, no crop)

## gallery-start

## First Slide [AR]
Caption for the first slide goes here.
/static/images/logo.png

## Second Slide [AR]
Caption for the second slide goes here.
/static/images/logo.png

## gallery-end

Add `[AR]` to a slide's title (e.g. `## My Title [AR]`) to show that image uncropped at its own aspect ratio, instead of the default landscape/portrait crop. **If every slide in the gallery has `[AR]`**, the carousel also drops its fixed 3:2 box and sizes itself to the image automatically (capped at 80vh) — this avoids large empty margins around tall/narrow images like phone screenshots. Mixing some `[AR]` slides with some non-`[AR]` slides in the same gallery keeps the fixed box for all of them, so it's best to tag either all slides or none.

```markdown
## gallery-start

## First Slide [AR]
Caption for the first slide goes here.
/static/images/your-image-1.webp

## Second Slide [AR]
Caption for the second slide goes here.
/static/images/your-image-2.webp

## gallery-end
```

## Gallery (floated and scaled)

<div class="gallery-float-right" style="width:50%">

## gallery-start

## First Slide
Caption for the first slide goes here.
/static/images/logo.png

## Second Slide
Caption for the second slide goes here.
/static/images/logo.png

## gallery-end

</div>

Wrap the whole `gallery-start`/`gallery-end` block in a `<div class="gallery-float-right" style="width:50%">…</div>` (or `gallery-float-left`) to float and scale the carousel next to text, exactly like the single-image float pattern. **Important:** leave a blank line right after the opening `<div>` and right before the closing `</div>` — without them the `## gallery-start`/`## gallery-end` headings won't be parsed as markdown. On narrow screens it drops the float and goes full width automatically. If text follows after the gallery, add `<div style="clear:both"></div>` (with blank lines around it) once the float's wrapped content ends, so later content isn't squeezed into the leftover space.

```html
<div class="gallery-float-right" style="width:50%">

## gallery-start

## First Slide
Caption for the first slide goes here.
/static/images/your-image-1.webp

## Second Slide
Caption for the second slide goes here.
/static/images/your-image-2.webp

## gallery-end

</div>

Paragraph text goes here, wrapping beside the floated gallery.
```

## Quick Reference

- **`image-float-right` / `image-float-left`** — class on a `<figure>`, floats a single image beside text (default 45% width).
- **`style="width:NN%"`** — on the `<figure>` (float images) or `<div class="gallery-float-*">` (galleries), overrides the default width.
- **`style="width:NN%;margin:0 auto;"`** — on an `<img>` inside a plain (non-floated) `<figure>`, narrows and centers a block image.
- **No `image-float-*` class** — a plain `<figure>` (or bare `![alt](/path)`) renders as a full-width block image on its own line.
- **`<div class="image-pair">…</div>`** — wraps two `image-float-right` figures to sit side by side at half width each.
- **`## gallery-start` … `## gallery-end`** — H2 markers that turn everything between them into a Swiper carousel; each `## Title` inside is one slide, with the image path on its own line and any preceding text as the caption.
- **`[AR]` on a slide title** — shows that slide uncropped at native aspect ratio; if *all* slides in a gallery use it, the carousel also auto-sizes its height to the image instead of a fixed 3:2 box.
- **`<div class="gallery-float-right">…</div>` / `gallery-float-left`** — wraps a whole `gallery-start`/`gallery-end` block to float and scale the carousel like a single image. Needs blank lines directly inside the opening/closing `<div>` tags so the `##` headings still parse as markdown.
- **`<div style="clear:both"></div>`** — drop this (with blank lines around it) after any floated image/gallery once you want later content to stop wrapping around it and resume full width.
