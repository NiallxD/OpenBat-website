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

Whenever I explain OpenBat to someone who knows bats professionally, there's a
moment where they narrow their eyes slightly, and I know exactly which question
is coming.

*"Acoustic species ID is really hard. Isn't a phone app full of confident wrong
answers going to pollute the dataset?"*

It's a fair question and I want to answer it properly, because the answer is
also the reason the project makes sense at all.

## The useful bit isn't the species name

A bat record has layers. From easiest to hardest:

1. **Something echolocated here, at this time, on this date.**
2. It was probably in this group of species.
3. It was probably this species.
4. It was definitely this species.

Layer 1 needs a microphone and something that can tell an echolocation pulse
from a car door. Layer 4 needs, realistically, a specialist with the recording,
the context, and often the honesty to say "can't be sure".

Here's the thing: in a lot of places, **layer 1 is missing entirely.** Nobody
has ever pointed a microphone at that valley on that night. A record that only
says "bats were active here" is not a watered-down version of real data. In an
unsurveyed area it *is* real data, and it's the kind that feeds directly into
questions people actually need answered — where are bats still present, where
have they gone quiet, when does activity start in the spring.

## Bats are not birds, and the maths is different

This is where the comparison to birding gets interesting.

Bird records are abundant. Decades of organised counts, millions of
contributors, dense coverage across most of the populated world. One more
record of a common bird in a well-watched county adds very little, because the
picture there is already sharp.

Bat acoustic records start much closer to empty in a lot of regions. The same
marginal record lands on a much thinner picture, so it moves the needle further.

<figure class="chart">
  <svg viewBox="0 0 640 260" role="img" aria-label="Two panels illustrating record density. The bird panel is a dense grid of dots; the bat panel is sparse with large gaps.">
    <text x="10" y="20" class="chart-key" style="fill: var(--color-accent)">BIRD RECORDS</text>
    <text x="330" y="20" class="chart-key" style="fill: var(--color-accent)">BAT RECORDS</text>
    <g style="fill: var(--color-secondary)">
      <!-- dense grid -->
      <g opacity="0.85">
        <circle cx="30" cy="50" r="4"/><circle cx="60" cy="50" r="4"/><circle cx="90" cy="50" r="4"/><circle cx="120" cy="50" r="4"/><circle cx="150" cy="50" r="4"/><circle cx="180" cy="50" r="4"/><circle cx="210" cy="50" r="4"/><circle cx="240" cy="50" r="4"/><circle cx="270" cy="50" r="4"/>
        <circle cx="30" cy="85" r="4"/><circle cx="60" cy="85" r="4"/><circle cx="90" cy="85" r="4"/><circle cx="120" cy="85" r="4"/><circle cx="150" cy="85" r="4"/><circle cx="180" cy="85" r="4"/><circle cx="210" cy="85" r="4"/><circle cx="240" cy="85" r="4"/><circle cx="270" cy="85" r="4"/>
        <circle cx="30" cy="120" r="4"/><circle cx="60" cy="120" r="4"/><circle cx="90" cy="120" r="4"/><circle cx="120" cy="120" r="4"/><circle cx="150" cy="120" r="4"/><circle cx="180" cy="120" r="4"/><circle cx="210" cy="120" r="4"/><circle cx="240" cy="120" r="4"/><circle cx="270" cy="120" r="4"/>
        <circle cx="30" cy="155" r="4"/><circle cx="60" cy="155" r="4"/><circle cx="90" cy="155" r="4"/><circle cx="120" cy="155" r="4"/><circle cx="150" cy="155" r="4"/><circle cx="180" cy="155" r="4"/><circle cx="210" cy="155" r="4"/><circle cx="240" cy="155" r="4"/><circle cx="270" cy="155" r="4"/>
        <circle cx="30" cy="190" r="4"/><circle cx="60" cy="190" r="4"/><circle cx="90" cy="190" r="4"/><circle cx="120" cy="190" r="4"/><circle cx="150" cy="190" r="4"/><circle cx="180" cy="190" r="4"/><circle cx="210" cy="190" r="4"/><circle cx="240" cy="190" r="4"/><circle cx="270" cy="190" r="4"/>
      </g>
      <!-- sparse grid -->
      <g opacity="0.85">
        <circle cx="350" cy="50" r="4"/><circle cx="470" cy="85" r="4"/><circle cx="590" cy="50" r="4"/>
        <circle cx="410" cy="155" r="4"/><circle cx="530" cy="190" r="4"/><circle cx="350" cy="190" r="4"/>
      </g>
    </g>
    <g style="fill: var(--color-accent)">
      <circle cx="150" cy="120" r="7"/>
      <circle cx="470" cy="120" r="7"/>
    </g>
    <text x="150" y="230" text-anchor="middle" class="chart-label chart-label--small" style="fill: var(--color-muted)">one more record here…</text>
    <text x="470" y="230" text-anchor="middle" class="chart-label chart-label--small" style="fill: var(--color-muted)">…is worth much more here</text>
  </svg>
  <figcaption>Illustrative, not to scale — but the shape of it is the point. The value of a record depends on how empty the map around it is.</figcaption>
</figure>

## What iNaturalist already expects

There's a neat detail here that a lot of people don't know. iNaturalist's
"research grade" standard doesn't require an identification down to species.
It requires community agreement at whatever level of detail is actually
defensible.

So a record agreed at genus level — *Myotis* something, we can't say which — is
still research grade, still flows through to GBIF, still counts. The system was
designed by people who understood that honest uncertainty is more useful than
confident guessing.

That fits bats perfectly, because several bat groups genuinely cannot be
separated by sound. Not "our model isn't good enough yet" — *cannot*, by
anyone, from a recording alone.

## Which is why the app is built to say "I don't know"

This is the bit I'd point at if I only got one sentence with a sceptical
biologist. OpenBat's identification comes with confidence attached, and two
extra flags where honesty demands them:

- **Sounds alike** — this species belongs to a group that overlaps too much to
  separate by sound. It's a standing caution about the species, not a comment
  on your particular recording.
- **Or [other species]** — on this specific call, a second species scored
  almost as highly, and here's its name so you can judge for yourself.

None of that is decoration. If the app quietly picked a winner and showed it
like a fact, it would be doing the exact thing the sceptics are worried about.

> [!tip] The rule of thumb
> Upload the recording, not just the verdict. A spectrogram and a WAV file let
> a human check the work. A species name on its own asks people to take your
> word for it.

## So what should you actually submit?

Everything you're happy to stand behind, at whatever level you're happy to
stand behind it. "Bat, unidentified, here, at 21:40" is a real contribution. If
the app suggests a species and you've got a clean recording to back it up,
say so and let identifiers do the rest.

The floor is low on purpose. That's not a compromise — it's the point.

Niall & the OpenBat Team 🙂
