---
title: The Gaps in Bat Data
description: Bat records are thin, and they are thin unevenly. What is missing from the datasets, why an empty space is so easy to misread, and what one ordinary observation is worth.
excerpt: Bat records are thin, and they are thin unevenly. What is missing from the datasets, why an empty space is so easy to misread, and what one ordinary observation is actually worth.
date: 2026-08-27
author: Niall Bell
tags:
  - bats
  - data
heroImage: /static/images/records-hero.webp
coverImage: /static/images/records-cover.webp
featured: false
publish: true
---

Every distribution map, every conservation assessment and every model of where
a bat might live rests on a pile of individual records. It is worth looking at
what that pile is actually made of.

{% chart {
  yKey: "GBIF RECORDS HELD, LOG SCALE",
  vertical: true,
  scale: "log",
  min: 80,
  max: 8000000,
  yTicks: true,
  xTicks: false,
  notes: false,
  height: 420,
  caption: "The 48 species OpenBat can name, by how many records exist for them. The scale multiplies by ten each step — the common pipistrelle is not ten times better recorded than the little brown bat, it is nearly a thousand times better recorded.",
  alt: "A bar chart of 48 bat species sorted by how many GBIF records exist for each, on a log scale from 184 to over three million, rising smoothly across four orders of magnitude.",
  bars: [
    { label: "Idionycteris phyllotis", value: 184 },
    { label: "Spotted Bat", value: 186 },
    { label: "Myotis sodalis", value: 271 },
    { label: "Myotis grisescens", value: 283 },
    { label: "Myotis leibii", value: 341 },
    { label: "Northern Myotis", value: 357 },
    { label: "Eumops perotis", value: 387 },
    { label: "Lasiurus seminolus", value: 481 },
    { label: "Nyctinomops macrotis", value: 482 },
    { label: "Myotis austroriparius", value: 736 },
    { label: "Fringed Myotis", value: 1055 },
    { label: "Lasiurus intermedius", value: 1153 },
    { label: "Lasiurus blossevillii", value: 1179 },
    { label: "Long-eared Myotis", value: 1216 },
    { label: "Nycticeius humeralis", value: 1425 },
    { label: "Western Small-footed Myotis", value: 1465 },
    { label: "Long-legged Myotis", value: 1481 },
    { label: "Yuma Myotis", value: 2264 },
    { label: "Canyon Bat", value: 2326 },
    { label: "Myotis velifer", value: 2757 },
    { label: "Townsend's Big-eared Bat", value: 2842 },
    { label: "Pallid Bat", value: 2862 },
    { label: "California Myotis", value: 2953 },
    { label: "Myotis alcathoe", value: 3042 },
    { label: "Silver-haired Bat", value: 3170 },
    { label: "Perimyotis subflavus", value: 3211 },
    { label: "Little Brown Bat", value: 3720 },
    { label: "Eastern Red Bat", value: 5299 },
    { label: "Myotis brandtii", value: 5875 },
    { label: "Hoary Bat", value: 5893 },
    { label: "Mexican Free-tailed Bat", value: 7740 },
    { label: "Myotis bechsteinii", value: 10841 },
    { label: "Big Brown Bat", value: 11731 },
    { label: "Plecotus austriacus", value: 12718 },
    { label: "Barbastella barbastellus", value: 22465 },
    { label: "Myotis mystacinus", value: 24373 },
    { label: "Rhinolophus hipposideros", value: 29410 },
    { label: "Myotis nattereri", value: 33764 },
    { label: "Rhinolophus ferrumequinum", value: 34923 },
    { label: "Pipistrellus nathusii", value: 43968 },
    { label: "Cnephaeus serotinus", value: 49587 },
    { label: "Grey-headed Flying-fox", value: 53087 },
    { label: "Plecotus auritus", value: 55013 },
    { label: "Myotis daubentonii", value: 269678 },
    { label: "Nyctalus leisleri", value: 308473 },
    { label: "Nyctalus noctula", value: 318300 },
    { label: "Pipistrellus pygmaeus", value: 427061 },
    { label: "Common Pipistrelle", value: 3229956 }
  ],
  callouts: [
    { x: "Northern Myotis", y: 2600, text: "Spotted bat, 186 records", style: "muted", arrowTo: { x: "Spotted Bat", y: 215 } },
    { x: "Little Brown Bat", y: 62000, text: "Little brown bat, 3,720 records", style: "muted", arrowTo: { x: "Little Brown Bat", y: 4200 } },
    { x: "Grey-headed Flying-fox", y: 5200000, text: "Common pipistrelle, 3,229,956 records", arrowTo: { x: "Common Pipistrelle", y: 3400000 } }
  ]
} %}

The little brown bat was once among the most abundant mammals in North America.
It has about 3,700 records. The common pipistrelle has 3.2 million. Nothing
about that ratio is a fact about bats.

Sort those 48 species by how well recorded they are and the European ones drift
to one end almost without exception — a typical European species in that list
has around 35,000 records behind it, a typical North American one around 1,400.
Britain and much of Europe have decades of organised volunteer bat recording
behind them. That is the whole difference. It is a map of where the recorders
are.

## Three different kinds of gap

**Nobody looked.** Records cluster around wealthy countries, near roads, towns,
universities and reserves. The most bat-diverse places on earth are among the
least recorded, so the map is brightest exactly where the fewest species live.

**Someone looked and couldn't hear it.** As
[[Why Bats Are Hard to Watch|detection distance]] varies enormously between
species, a night of listening over-collects the loud, low-frequency bats and
misses the quiet ones standing metres away. That bias is baked into decades of
accumulated recordings.

**Someone looked, recorded it, and it never got out.** A great deal of bat data
exists in consultancy reports, student projects, spreadsheets and filing
cabinets. It was collected properly and it is unreachable, which for practical
purposes is the same as not existing.

## Why an empty space is dangerous

An absence of records is not an absence of bats — but it is constantly, and
consequentially, read as one.

**You cannot see a decline without a baseline.** A population that has crashed
and a population nobody ever surveyed produce the same thing on a map: nothing.
The gap is only interpretable if you know something was there before.

**Unassessed usually means unprotected.** Well over a hundred bat species are
listed as Data Deficient — not judged safe, simply not judged. Conservation
listings, funding and legal protection all follow evidence, so the species we
know least about are the ones least likely to be defended.

**"No records" becomes "no bats" in decisions.** Land-use and planning
decisions get made against whatever the local record centre holds. A site with
no records is not a site with no bats; it is very often a site nobody has
visited after dark.

**And the gaps reinforce themselves.** Maps and models built from biased
records reproduce the bias, and a species that a map says is absent stops being
looked for. That is not hypothetical: it's the exact failure that
[[How OpenBat Draws a Range Map|forced a rethink of our own range maps]], where
thin recording at a range edge was being read as the edge itself.

## What actually fills them

Less than people assume, and nothing heroic.

**Ordinary records from ordinary places.** A date, a location and an honest
confidence level. The rare-species hunt is not where the value is — the value
is in the unremarkable patch near you that nobody has ever listened to.

**Records at whatever taxonomic depth is honest.** "A *Myotis*, here, on this
night" is a usable record. A confident species name that turns out to be wrong
is worse than a cautious genus, and the platforms that consume this data are
built to accept both.

**Effort, alongside the detections.** An hour of listening that produced
nothing means something, but only if the hour is recorded too. Absence is a
claim, and it needs its working shown.

**Data that leaves your device.** The single largest improvement available to
most people is not collecting more, it's publishing what they already have to a
shared platform where someone else can find it.

## The upside of a thin dataset

There is one genuine advantage to a field this under-recorded: the marginal
value of a single record is enormous compared with better-studied groups. One
more record of a common garden bird changes essentially nothing. One record of
a bat in an unsurveyed valley can be the first anyone has.

That is the whole argument for
[[Adding a Bat to the Field Guide|contributing at all]] — not that amateurs can
match professional survey work, but that in a field this empty, a modest,
honest, well-documented observation is worth more than it would be almost
anywhere else in ecology.
