---
title: A Blank Space on a Map does not mean Absence
description: Observation maps show where people have looked as much as where bats live. Learning to read the difference changes what the maps are good for.
excerpt: Observation maps show where people have looked at least as much as where bats live. Reading the difference changes what you can honestly use them for.
date: 2026-08-29
author: Niall Bell
tags:
  - data
  - field-guide
coverImage: /static/images/map_generation_example.webp
heroImage: /static/images/map_generation_example.webp
featured: false
publish: true
---

Open a species in the field guide and you get a distribution map built from real records. It's one of my favourite things in the app, and it's also the thing most likely to be misread.

Here's the trap, in one sentence: **the map shows where records exist, not where bats exist.**

## Records cluster around people

Every dot on a biodiversity map required somebody to be standing there with
equipment, and people are not evenly distributed. They cluster around roads,
towns, universities, nature reserves, and the places where a monitoring
programme happened to get funded.

So a map of records is, unavoidably, partly a map of effort.

<figure>
  <a href="/static/images/map_generation_example.webp"><img src="/static/images/map_generation_example.webp" alt="Two panels of the same imaginary forest. On the left, green circles for trees fill the whole square, and orange dots — each an observed bat — sit only along the one road curving through it. On the right, the same forest with the observations bucketed into orange grid squares, which follow the road and leave the rest of the forest blank." loading="lazy"></a>
  <figcaption>Same forest, both panels. The right-hand map is accurate about where a surveyor walked, and where bats were recorded, but ignores ares where the surveyor didn't go.</figcaption>
</figure>

This is not a flaw in the data or in the people who collected it. It's an inherent property of any dataset built from observations, and every serious biodiversity database carries the same caveat.

We learned this one the hard way, in our own app. OpenBat used to decide which species were plausible near you by asking how many records each had within 100 km. It seemed obviously sensible, and it was wrong in two separate ways at once.

**Record counts measure surveyors, not bats.** Museum specimens, century-old taxonomy and university field courses all count towards that total.

**And names moved underneath us.** Ask for a bat by one accepted scientific name and you get nothing; ask by the name the records were actually filed under and you get ninety. In one case a species was switched off near London, where it has well over a thousand records, because the newer name the model used matched only its genus, and returned nothing anywhere on Earth. None of that was a bug in GBIF. Every one of those numbers was a true statement about *records*, read as if it were a statement about *bats*. The fix was to stop counting records and start using mapped ranges.

## Why bats have it worse than most

Three reasons stack up.

**They're nocturnal.** Casual daytime observation, which produces enormous quantities of bird and plant records, contributes almost nothing for bats.

**They need equipment.** Even a keen naturalist can't add a bat record without a detector, so the pool of possible recorders is tiny by comparison.

**They're hard to identify.** Some records honestly can't be resolved past genus, so distribution data for individual species is thinner still.

Put those together and bat distribution data is sparse almost everywhere, patchy in a way that tracks funding and roads, and unevenly resolved between species.

> You can see this patchiness by going to the field guide and toggling the map to 'Records'. This shows the density of records without the distribution modelling laid over the top.

## So what are the maps good for?

Quite a lot, as long as you read them as *evidence of presence* rather than *proof of absence*.

**Good uses:**

- "This species has definitely been recorded in this region."
- "This species is well recorded across a wide area."
- Sanity-checking an identification. If nothing like it has ever been recorded within a thousand miles, be suspicious.

**Bad uses:**

- "There are no bats in this valley."
- "This species is declining here."
- "This species is more common than that one."

That third one is worth dwelling on: [species differ enormously in how detectable they are](/blog/why-bats-are-hard-to-watch/). A loud, low-frequency, easily identified bat generates records at a rate a quiet, high-frequency, ambiguous one never will, even if both are equally abundant.

## Which is why your recordings matter

Here's the encouraging flip side of all this.

If the maps are thin because not enough people have looked, then more people looking genuinely improves them. That's not true of every conservation problem, you can't personally fix habitat loss on a Tuesday evening, but it is true of this one.

A record from an unsurveyed valley is worth many records from a well-studied reserve. The empty parts of the map are exactly where an ordinary person with a thirty-dollar microphone can add something a professional survey hasn't.

This is community science!

> [!note] How the app uses these records 
> The range maps in the field guide are built from GBIF, the same open database that iNaturalist records flow into. So a record you contribute can end up drawing the map somebody else reads next year — including, eventually, filling in one of those blank spaces you're looking at now.

Niall 🙂
