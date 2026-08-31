---
title: Why "There Were Bats Here" Is Worth Recording
description: Species identification is hard and often uncertain. That turns out not to matter as much as you would think, because the useful part of a bat record is the easy part.
excerpt: Species ID from sound is hard and often uncertain. That matters less than you would think — because the genuinely useful part of a bat record is the easy part.
date: 2026-09-04
author: Niall Bell
tags:
  - community-science
  - data
coverImage: /static/images/records-cover.webp
featured: false
publish: false
---

Whenever I explain OpenBat to someone who knows bats professionally, there's a moment where they narrow their eyes slightly, and I know exactly which question is coming.

*"Acoustic species ID is really hard. Isn't a phone app full of confident wrong answers going to pollute the dataset?"*

It's a fair question and I want to answer it properly, because the answer is also the reason the project makes sense at all.

## The useful bit isn't the species name

A bat record has layers. From easiest to hardest:

1. **Something echolocated here, at this time, on this date.**
2. It was probably in this group of species.
3. It was probably this species.
4. It was definitely this species.

Layer 1 needs a microphone and something that can tell an echolocation pulse from a car door. Layer 4 needs, realistically, a specialist with the recording, the context, and often the honesty to say "can't be sure".

Here's the thing: in a lot of places, **layer 1 is missing entirely.** Nobody has ever pointed a microphone at that valley on that night. A record that only says "bats were active here" is not a watered-down version of real data. In an unsurveyed area it *is* real data, and it's the kind that feeds directly into questions people actually need answered — where are bats still present, where have they gone quiet, when does activity start in the spring.

## Bats are not birds, and the maths is different

This is where the comparison to birding gets interesting.

Bird records are abundant. Decades of organised counts, millions of contributors, dense coverage across most of the populated world. One more record of a common bird in a well-watched county adds very little, because the picture there is already sharp.

Bat acoustic records start much closer to empty in a lot of regions. The same marginal record lands on a much thinner picture, so it moves the needle further.

{% chart {
  type: "scatter",
  key: "BIRD RECORDS ON THE LEFT, BAT RECORDS ON THE RIGHT",
  xTicks: false,
  height: 300,
  yGrid: false,
  marks: [{ at: 5 }],
  series: [
    { name: "bird records", data: [{x: 0.5, y: 1}, {x: 1, y: 1}, {x: 1.5, y: 1}, {x: 2, y: 1}, {x: 2.5, y: 1}, {x: 3, y: 1}, {x: 3.5, y: 1}, {x: 4, y: 1}, {x: 4.5, y: 1}, {x: 0.5, y: 2}, {x: 1, y: 2}, {x: 1.5, y: 2}, {x: 2, y: 2}, {x: 2.5, y: 2}, {x: 3, y: 2}, {x: 3.5, y: 2}, {x: 4, y: 2}, {x: 4.5, y: 2}, {x: 0.5, y: 3}, {x: 1, y: 3}, {x: 1.5, y: 3}, {x: 2, y: 3}, {x: 2.5, y: 3}, {x: 3, y: 3}, {x: 3.5, y: 3}, {x: 4, y: 3}, {x: 4.5, y: 3}, {x: 0.5, y: 4}, {x: 1, y: 4}, {x: 1.5, y: 4}, {x: 2, y: 4}, {x: 2.5, y: 4}, {x: 3, y: 4}, {x: 3.5, y: 4}, {x: 4, y: 4}, {x: 4.5, y: 4}, {x: 0.5, y: 5}, {x: 1, y: 5}, {x: 1.5, y: 5}, {x: 2, y: 5}, {x: 2.5, y: 5}, {x: 3, y: 5}, {x: 3.5, y: 5}, {x: 4, y: 5}, {x: 4.5, y: 5}], style: "secondary" },
    { name: "bat records", data: [{x: 5.6, y: 5}, {x: 7.2, y: 3.6}, {x: 9.3, y: 5}, {x: 6.4, y: 1.6}, {x: 8.6, y: 1}, {x: 5.6, y: 1}], style: "accent" }
  ],
  caption: "Illustrative, not to scale — but the shape of it is the point. The value of one more record depends entirely on how empty the map around it already is."
} %}

## What iNaturalist already expects

There's a neat detail here that a lot of people don't know. iNaturalist's "research grade" standard doesn't require an identification down to species. It requires community agreement at whatever level of detail is actually defensible.

So a record agreed at genus level — *Myotis* something, we can't say which — is still research grade, still flows through to GBIF, still counts. The system was designed by people who understood that honest uncertainty is more useful than confident guessing.

That fits bats perfectly, because several bat groups genuinely cannot be separated by sound. Not "our model isn't good enough yet" — *cannot*, by anyone, from a recording alone.

## Which is why the app is built to say "I don't know"

This is the bit I'd point at if I only got one sentence with a sceptical biologist. OpenBat's identification comes with confidence attached, and two extra flags where honesty demands them:

- **Sounds alike** — this species belongs to a group that overlaps too much to
  separate by sound. It's a standing caution about the species, not a comment
  on your particular recording.
- **Or [other species]** — on this specific call, a second species scored
  almost as highly, and here's its name so you can judge for yourself.

None of that is decoration. If the app quietly picked a winner and showed it like a fact, it would be doing the exact thing the sceptics are worried about.

> [!tip] The rule of thumb
> Upload the recording, not just the verdict. A spectrogram and a WAV file let
> a human check the work. A species name on its own asks people to take your
> word for it.

## So what should you actually submit?

Everything you're happy to stand behind, at whatever level you're happy to stand behind it. "Bat, unidentified, here, at 21:40" is a real contribution. If the app suggests a species and you've got a clean recording to back it up, say so and let identifiers do the rest.

The floor is low on purpose. That's not a compromise — it's the point.

Niall & the OpenBat Team 🙂
