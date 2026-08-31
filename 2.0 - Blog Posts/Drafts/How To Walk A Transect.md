---
title: How to Walk a Transect
description: Wandering about produces stories. Walking the same route the same way produces data you can compare — and comparison is where the value is.
excerpt: Wandering about produces stories. Walking the same route, the same way, every time produces something you can actually compare — which is where the value lives.
date: 2027-01-09
author: Niall Bell
tags:
  - how-to
  - community-science
featured: false
publish: false
---

There's a moment in this hobby where "I went and listened to some bats" stops
being enough and you start wanting to know whether tonight was better than last
week.

The answer is a transect: the same route, walked the same way, recorded the same
way, repeatedly. It's the simplest piece of real methodology available to an
amateur, and it turns a pile of evenings into something you can reason about.

## Why consistency beats effort

Imagine two summers of recording.

**Summer A**: you go out whenever you fancy it, to wherever seems promising, for
however long feels right. Three hundred recordings. Lots of lovely passes.

**Summer B**: you walk the same 2 km route, at the same pace, starting fifteen
minutes after sunset, once a fortnight. Twelve sessions. Far fewer recordings.

Summer A is more fun and produces better anecdotes. Summer B can answer
questions. Did activity peak in July? Is the pond section always busier than the
field section? Did the new streetlight change anything?

The difference isn't effort — Summer B is *less* work. It's that every session
in Summer B is comparable to every other one.

{% chart {
  type: "scatter",
  key: "THROUGH THE SEASON →",
  yKey: "BATS HEARD",
  xTicks: false,
  yTicks: true,
  series: [
    { name: "random outings", data: [{x: 1, y: 4}, {x: 1.6, y: 14}, {x: 2.4, y: 2}, {x: 3.1, y: 17}, {x: 4, y: 6}, {x: 4.8, y: 13}, {x: 5.6, y: 3}, {x: 6.3, y: 11}, {x: 7, y: 5}], style: "secondary" },
    { name: "the same route, every time", data: [{x: 1, y: 3}, {x: 2, y: 5}, {x: 3, y: 9}, {x: 4, y: 14}, {x: 5, y: 18}, {x: 6, y: 15}, {x: 7, y: 8}], style: "accent", line: true }
  ],
  caption: "Same person, same microphone, same number of evenings. Only the method changed — and only one of these two can be read as a season."
} %}

## Designing a route

**Length**: 1 to 3 km is plenty. You want to finish inside the busy window after
sunset, not still be walking at midnight.

**Variety**: try to include two or three different habitat types — a bit of
water, a bit of woodland edge, a bit of open or built-up. That way the route
answers "where" as well as "when".

**Practicality**: it has to be somewhere you're happy to walk in the dark,
repeatedly, alone or with company. A route you dread is a route you won't repeat.

**Safety**: tell someone where you're going, take a torch you're not using, and
don't pick anywhere with traffic you have to think about.

## The rules you keep the same

Write these down on the first night and don't change them:

1. **Start time relative to sunset**, not clock time. Sunset moves; your method
   shouldn't.
2. **The route and the direction.** Always the same way round.
3. **Walking pace.** Steady, and slower than feels natural. Don't stop to admire
   a good pass — note it and keep going.
4. **Where the microphone points**, and how you hold it.
5. **The detector settings.** Especially your loudness threshold. Changing it
   mid-season quietly invalidates your comparisons.

If you must change something, note the date and treat it as a new series.

## What to record alongside the audio

The app handles time, place and detections. You supply the context:

- **Temperature** at the start.
- **Wind**, roughly — still, breezy, windy.
- **Cloud and rain.**
- **Anything unusual** — a mown field, a new light, a party, roadworks.

Weather explains more variation than anything else. Without it you'll spend next
winter wondering why one August evening was dead.

## Reading the results

Once you've got a few sessions, the interesting comparisons are:

- **Section against section.** Which part of the route consistently produces
  most? That's a habitat result, and it's the most robust thing a transect gives
  you.
- **Date against date**, weather permitting. The seasonal curve is real and
  you'll see it emerge.
- **Time within the session.** If you always start at the same point relative to
  sunset, the first ten minutes and the last ten minutes are comparable across
  every visit.

Resist counting individuals. [[Detections Are Not Bats|Detections aren't bats]],
and a transect doesn't fix that — what it fixes is the comparability of the
detections themselves.

## Sharing it

Two audiences, both worth it.

**iNaturalist**, for your best individual recordings, so the records reach the
global pool.

**Your local bat group or monitoring programme**, for the transect as a whole.
This is the bit people underestimate: a consistent, documented route walked over
a season is exactly the kind of dataset regional programmes struggle to
resource. Ask them first, actually — many run standardised transect schemes with
an existing protocol, and slotting into theirs is more useful than inventing
your own.

> [!note] The unglamorous truth
> The most valuable thing an amateur can produce is not a rare species. It's a
> boring, consistent, repeated record of an ordinary place, kept for years.
> Nobody gives you a prize for it, and it's what actual monitoring is made of.

Niall & the OpenBat Team 🙂
