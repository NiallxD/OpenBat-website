---
title: Detections Are Not Bats
description: Your session says 340 detections. That is not 340 bats, and understanding the difference is the difference between a nice number and a real observation.
excerpt: Your session says 340 detections. That is not 340 bats — and the gap between those two things is where most misreadings of bat data begin.
date: 2026-10-20
author: Niall Bell
tags:
  - how-to
  - community-science
featured: false
publish: false
---

You get home, open the session, and there it is: 340 detections, eleven species,
a satisfying bar chart. It's a great feeling and I don't want to take it away
from you.

But that number is not 340 bats. It might be four bats, having a very good
evening, circling a pond for an hour.

## What a detection actually is

A detection is one call that passed the detector's tests and got logged. That's
it. A bat calls several times a second while it's flying, so a single bat
crossing your microphone's range produces a handful. A bat that hunts back and
forth over the same pond produces a handful every time it comes past, for as
long as it stays.

There is no counting of individuals anywhere in this. There *can't* be, from
sound alone — bats don't have name badges, and two individuals of the same
species produce nearly identical calls.

<figure class="chart">
  <svg viewBox="0 0 640 250" role="img" aria-label="One bat circling a pond passes the microphone five times, producing five separate clusters of detections that look like five bats.">
    <ellipse cx="320" cy="120" rx="160" ry="70" style="fill: none; stroke: var(--color-secondary)" stroke-width="2" stroke-dasharray="6 6"></ellipse>
    <text x="320" y="124" text-anchor="middle" class="chart-label" style="fill: var(--color-muted)">one bat, one circuit, over and over</text>
    <g style="fill: var(--color-accent)">
      <circle cx="160" cy="120" r="7"/><circle cx="240" cy="55" r="7"/><circle cx="400" cy="55" r="7"/><circle cx="480" cy="120" r="7"/><circle cx="320" cy="190" r="7"/>
    </g>
    <rect x="250" y="205" width="140" height="34" rx="8" style="fill: var(--color-accent); opacity: 0.85"></rect>
    <text x="320" y="228" text-anchor="middle" class="chart-label" style="fill: #111; font-weight: 700">your microphone</text>
    <text x="320" y="24" text-anchor="middle" class="chart-label" style="fill: var(--color-secondary)">five passes → five clusters of detections → one bat</text>
  </svg>
  <figcaption>This is the single most common misreading of acoustic data, and every bat worker has done it at some point.</figcaption>
</figure>

## The two charts, and what each one is for

Open a session and you get a map, then two charts, then the recordings.

**Species detected** is a bar per species, as long as the number of detections
logged for it. It answers *"what was around?"* — and it's good at that. It is
not a census. A species that calls loudly and often will out-bar a quieter
species that was equally present, every single time.

**Detections over time** puts the same detections on the clock. This is the more
interesting chart and it gets less attention than it deserves, because it
answers a different question: *"what kind of night was it?"*

A hundred detections spread evenly across four hours and a hundred detections
crammed into one busy twenty minutes look identical on the first chart. They are
completely different nights. The first suggests steady traffic through the area.
The second suggests something happened — an emergence, a hatch of insects, a
roost nearby waking up.

> [!tip] Read them together
> The species chart tells you *who*. The time chart tells you *when*, and
> "when" is usually where the story is.

## Loudness bias, and why it's worth knowing about

Not all bats are equally detectable. Some species call loudly and can be picked
up from a long way off. Others call quietly, at higher frequencies that fade
faster in air, and you'll only catch them if they come close.

So an evening's bar chart is not a picture of what was there. It's a picture of
what was there *and audible from where you stood*, weighted heavily towards the
loud ones. A quiet, close-range species could be all over your site and barely
register.

This isn't a flaw in the app; it's a property of acoustic surveying that
professionals correct for with careful methodology. For the rest of us, it's
enough to know it exists and to resist the urge to say "there were more of
species A than species B tonight".

## What you can honestly say

Things a session genuinely supports:

- "These species were present at this location on this date." — Solid, assuming
  the identifications hold up.
- "Activity was concentrated in the first hour after sunset." — Yes, that's what
  the time chart is for.
- "This site was busier than that site on comparable nights." — Cautiously yes,
  if you kept the equipment and position consistent.

Things it doesn't support:

- "There were 340 bats." — No.
- "Species A is more common here than species B." — Not from detection counts.
- "Numbers are down this year." — Not from casual recording. That's a question
  requiring standardised methods, and it's exactly what formal monitoring
  programmes exist to answer.

## Why this matters beyond your own curiosity

If you contribute records to iNaturalist and they flow onward, the way you
describe them travels with them. A record that says "bat present, this location,
this time" is durable and correct forever. A record implying an abundance count
that wasn't measured can quietly mislead someone years later.

The app tries to help here — tap the **i** next to either chart title and it
tells you what that chart does and doesn't show. It's the kind of thing that's
easy to skip and worth thirty seconds.

Counting is hard. Presence is easy and genuinely valuable. Stick to the easy
thing and you'll never have to walk anything back.

Niall & the OpenBat Team 🙂
