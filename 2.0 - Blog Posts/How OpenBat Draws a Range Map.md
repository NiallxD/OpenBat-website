---
title: How OpenBat Draws a Range Map
description: Where the distribution maps come from, what has to be assumed to draw one, and why the rules are careful not to delete real range at the edges.
excerpt: Where the distribution maps come from, what has to be assumed to draw one, and why the rules are careful not to delete real range at the edges.
date: 2026-08-27
author: Niall Bell
tags:
  - field-guide
  - range-maps
  - gbif
heroImage: /static/images/range-hero.webp
coverImage: /static/images/range-cover.webp
featured: false
publish: true
---

Open a species in OpenBat and you get a map of where it lives. That map does
two jobs, and the second one matters more than it looks: it also decides which
species the app's on-device identification is willing to consider where you are
standing. A range map that is wrong in the wrong direction doesn't just look
odd — it switches a resident bat off.

Here is what those maps are made of, and what has to be assumed to draw one.

## The raw material

Every range comes from [GBIF](https://www.gbif.org/), the global pool of
biodiversity occurrence records — museum specimens, survey data, ringing
records, verified citizen-science sightings. For each species the app can name,
we ask GBIF for every record it holds and bin them into a grid of **1° cells**,
about 111 km across.

Coarse, deliberately. The question is "does this bat live around here", not
"was one caught in this field". A finer grid mostly encodes where recorders
happened to walk.

Two details that took more work than expected:

**Names are unreliable in both directions.** Querying GBIF by scientific name
fails silently when the app's name and GBIF's disagree. The western red bat
returns zero records near San Francisco under *Lasiurus blossevillii*, because
those records now sit under *Lasiurus frantzii*. The serotine returns zero near
London under *Cnephaeus serotinus*, because GBIF matches that name only to a
genus. Either mistake switches a common bat off in a place it is common, so
every name is matched to its record set once, in advance, and checked by a
person rather than looked up on the fly.

**We ask for a summary of every record, not a sample of them.** Records come
back in no particular order, so taking the first few thousand of a species can
hand you one large national dataset and leave real parts of a range looking
empty. GBIF will instead count *every* record it holds into a grid — all 3.2
million common pipistrelles — which is both a truer picture and a smaller
answer.

## The assumption everything hinges on

**A record is evidence a person was there and filed something, not evidence a
bat was there and no bat was anywhere else.** Absence of records is not absence
of bats.

That sounds obvious. Building on it is where it gets awkward, because you still
have to draw a line somewhere: a single record 4,000 km from a species' range
is almost always a misidentification, an escapee, or a specimen catalogued at
the museum that holds it rather than where it was collected. Keep everything
and every map grows a rash of dots. Filter too hard and you delete real range.

The obvious way to draw the line is to judge each cell on how many records it
holds: throw out the thin ones, then tidy up what survives. It reads well until
you notice that recording effort is thinnest exactly where a range ends, so
judging cells on record counts reads survey intensity as absence:

- The **spotted bat's** run north into British Columbia is four cells holding
  1, 1, 2 and 3 records, one empty row away from the main range. Judge those
  cells on their own and every one of them fails: the range stops dead on the
  49th parallel and the bat reads as absent from the whole province.
- The **Hawaiian hoary bat** is seven cells holding 18 records. Set the bar for
  an isolated cluster at 20 and an entire island population disappears, two
  records short.

## Buffer, bridge, then judge

Same ingredients, different order.

1. **Buffer** — every cell holding a record grows by one cell in each
   direction (~111 km).
2. **Bridge** — gaps of up to about 440 km between neighbouring blobs are
   closed, so a strait or a stretch of unsurveyed ground doesn't split one
   range into two.
3. **Group** — what remains is flood-filled into connected groups, and *then*
   each group is judged.

The order is what matters. Judging after bridging lets a thin edge inherit the
credibility of the range it attaches to, instead of being asked to justify
itself cell by cell — which is exactly what a sparsely surveyed real edge
cannot do.

<figure>
  <a href="/static/images/range-stages.webp"><img src="/static/images/range-stages.webp" alt="Three maps of the spotted bat showing the algorithm running: the cells holding records, the same cells grown by one in every direction, and short gaps between them closed." loading="lazy"></a>
  <figcaption>The first two steps, on the spotted bat. <strong>1:</strong> the 72 cells that hold records. <strong>2:</strong> buffering grows each by one cell, adding 210. <strong>3:</strong> bridging closes the short gaps between them, adding 70 more. Green rings what each step added: buffering thickens every blob's outline, bridging only fills between things — including the empty row that had been cutting the run north into British Columbia off from the main range.</figcaption>
</figure>

A group survives if it has **either** at least 3 cells holding records **or**
at least 20 records in total. Either is sufficient, and both have to fail
before anything is dropped.

Two tests rather than one, because they catch two different kinds of evidence.
Cell count alone separates the real disjunct populations (Hawaii's 7 cells,
BC's 4) from the known artefacts (a single cell in Bogotá, a single cell in
Alaska) — but it also deleted every island endemic, because the Canary Islands
cannot fill three 1° cells no matter how many barbastelles are on them. A
record count alone can't separate the artefacts from BC at all. Together:
*spread out but thinly recorded*, or *concentrated but well recorded*. Only a
group that is both tiny and thin gets dropped, which is the exact profile of a
stray record.

<figure>
  <a href="/static/images/range-hoary-bat.webp"><img src="/static/images/range-hoary-bat.webp" alt="Three maps of the hoary bat across the Americas: raw records, five single-cell outliers ringed in red, and the final range with Hawaii kept as its own group." loading="lazy"></a>
  <figcaption>The hoary bat, where the middle step has something to do: five clusters ringed in red, each a single cell holding a handful of records. Hawaii is not among them: seven cells and 18 records clears the spread test comfortably, and an island population is exactly the kind of thing a blunter rule loses.</figcaption>
</figure>

One more rule: a species' **largest group always survives**, however thin.
Dropping it would turn "we know very little about this bat" into "this bat is
not here", and those are not the same statement. The app has an honest way to
say the first and should never be handed the second by accident.

<figure>
  <a href="/static/images/range-common-pipistrelle.webp"><img src="/static/images/range-common-pipistrelle.webp" alt="Three maps of the common pipistrelle: raw records across Europe and Asia, seven outliers ringed in red in the Americas, India and east Africa, and the final range." loading="lazy"></a>
  <figcaption>The common pipistrelle, 3.2 million records — and seven single cells scattered across the Americas, India and east Africa, each holding one to four of them. Those are the middle step's whole job: eight groups in, one group out.</figcaption>
</figure>

## What that adds up to

Across the 48 species the app can name, these rules add **15,483 cells** of
range compared with judging cells one at a time. What they take away is small
and deliberate: the largest group dropped anywhere holds 2 cells and 15
records, and 87 of the 133 dropped are a single cell holding a single record.

## How it reaches the app

The range data ships **inside** the app and is refreshed from the
[field guide repository](https://github.com/NiallxD/OpenBat-FieldGuide) at
launch, so a corrected range reaches every install without an app update — and a
phone that has never had a signal still has a full set. Everything happens on device;
nothing about your location is sent anywhere.

On a species page you can toggle between **Records** and **Range**. Records is
the raw evidence — the cells that genuinely hold observations, shaded by how
many. Range is the modelled version, the one described above. We show both
because they answer different questions, and because the modelled map is an
inference and shouldn't pretend otherwise.

The identification engine reads the same grid, and distinguishes three answers
rather than two: present, absent, and *unknown*. A species with no data is not
a species that isn't there, and the app says so.

## What it still can't tell you

- **There is no seasonality.** GBIF's density summaries carry no dates, so the
  app has no per-cell month information. It treats that as "no opinion" rather
  than hiding a resident bat whose records lacked dates.
- **Cells are 111 km.** A cell being in range means the species lives in that
  region, not on that hillside.
- **It is still built from records.** Better-surveyed places look better
  populated. Buffering and bridging soften that; nothing removes it.

The range data and its licence terms are public, in the
[field guide repository](https://github.com/NiallxD/OpenBat-FieldGuide), along
with the guide itself. If you spot a range that looks wrong for a bat you know
well, that is exactly the kind of report we want.
