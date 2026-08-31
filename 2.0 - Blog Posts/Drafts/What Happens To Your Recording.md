---
title: What Happens to Your Recording After You Upload It
description: A WAV file from your garden can end up in a global biodiversity database that researchers and governments actually use. Here is the whole route.
excerpt: A WAV file recorded in your garden can end up in the same database governments and researchers query. Here is the full route, step by step.
date: 2026-09-29
author: Niall Bell
tags:
  - community-science
  - inaturalist
coverImage: /static/images/records-hero.webp
featured: false
publish: false
---

You stand in a field, a bat goes over, your phone saves a WAV file. So far this
is a nice evening and nothing more.

The interesting question is what has to happen for that file to become something
a researcher three thousand miles away can use in five years' time. It's a
longer chain than most people expect, and every link is one somebody built on
purpose.

## The route

<figure class="chart">
  <svg viewBox="0 0 640 400" role="img" aria-label="A chain: your recording, an iNaturalist observation, community identification, research grade, GBIF, and then researchers, range maps and policy.">
    <g class="chart-label">
      <rect x="180" y="10" width="280" height="46" rx="8" style="fill: var(--color-accent); opacity: 0.85"></rect>
      <text x="320" y="39" text-anchor="middle" style="fill: #111; font-weight: 700">Your recording, on your phone</text>
      <rect x="180" y="76" width="280" height="46" rx="8" style="fill: var(--color-surface); stroke: var(--color-border)"></rect>
      <text x="320" y="105" text-anchor="middle" style="fill: var(--color-text); font-weight: 700">An iNaturalist observation</text>
      <rect x="180" y="142" width="280" height="46" rx="8" style="fill: var(--color-surface); stroke: var(--color-border)"></rect>
      <text x="320" y="171" text-anchor="middle" style="fill: var(--color-text); font-weight: 700">Other people look at it</text>
      <rect x="180" y="208" width="280" height="46" rx="8" style="fill: var(--color-surface); stroke: var(--color-border)"></rect>
      <text x="320" y="237" text-anchor="middle" style="fill: var(--color-text); font-weight: 700">Research grade, if it earns it</text>
      <rect x="180" y="274" width="280" height="46" rx="8" style="fill: var(--color-surface); stroke: var(--color-border)"></rect>
      <text x="320" y="303" text-anchor="middle" style="fill: var(--color-text); font-weight: 700">GBIF — the global database</text>
      <rect x="40" y="340" width="170" height="44" rx="8" style="fill: var(--color-surface); stroke: var(--color-border)"></rect>
      <text x="125" y="368" text-anchor="middle" class="chart-label--small" style="fill: var(--color-secondary)">researchers</text>
      <rect x="235" y="340" width="170" height="44" rx="8" style="fill: var(--color-surface); stroke: var(--color-border)"></rect>
      <text x="320" y="368" text-anchor="middle" class="chart-label--small" style="fill: var(--color-secondary)">range maps (including ours)</text>
      <rect x="430" y="340" width="170" height="44" rx="8" style="fill: var(--color-surface); stroke: var(--color-border)"></rect>
      <text x="515" y="368" text-anchor="middle" class="chart-label--small" style="fill: var(--color-secondary)">conservation decisions</text>
    </g>
    <g style="stroke: var(--color-secondary)" stroke-width="2" fill="none">
      <path d="M320 58 L 320 72"></path>
      <path d="M320 124 L 320 138"></path>
      <path d="M320 190 L 320 204"></path>
      <path d="M320 256 L 320 270"></path>
      <path d="M320 322 L 320 336"></path>
      <path d="M320 330 L 125 330 L 125 338"></path>
      <path d="M320 330 L 515 330 L 515 338"></path>
    </g>
  </svg>
  <figcaption>Nothing here is new infrastructure. It all already existed — the gap was getting a bat recording into the top of it without a miserable evening at a laptop.</figcaption>
</figure>

## Step one: from a file to an observation

An observation needs more than audio. It needs **where**, **when**, **what you
think it is**, and enough evidence for someone else to check.

For a bat, that means:

- **The recording itself**, as a plain WAV file. Not a compressed version —
  compression is tuned for human hearing and does unkind things to ultrasound.
- **A spectrogram image**, so an identifier can see the call shape without
  downloading and opening the audio. Convention is a log-frequency axis, which
  is what serious reviewers expect to see.
- **The metadata**: time, date, location, sample rate, what recorded it. There's
  a standard for this in the bat world called GUANO, and it exists precisely so
  that files from different detectors can be understood by the same software
  years later. OpenBat writes it into every WAV it saves, so this part travels
  with the file whether or not you remember it.

Doing all of that by hand takes about ten minutes per record. Which is why
almost nobody does it more than a few times, and why closing that gap is one of
the things OpenBat exists to do.

## Step two: other people argue with you politely

This is the bit I love. Your observation goes up with whatever identification
you're comfortable with — down to species, or just "a bat" — and then other
people weigh in.

Some of those people are very good at this. Bat call identification attracts
exactly the sort of person who will cheerfully tell you the second harmonic is
missing and it's therefore not what you thought.

When enough people agree at a given level, the observation becomes **research
grade**. Crucially, that level doesn't have to be species. Agreement at genus
level — "some kind of *Myotis*" — still counts, because the standard was written
by people who understood that honest uncertainty is more useful than confident
nonsense.

## Step three: it leaves the app entirely

Research-grade observations flow into **GBIF**, the Global Biodiversity
Information Facility. That's the shared pool that museums, national monitoring
programmes, universities and government agencies all draw from.

At this point your Tuesday evening is a row in a dataset alongside records from
museum collections and formal surveys, and it will outlive the app, the phone,
and probably me.

We use it ourselves, incidentally. The
[[How OpenBat Draws a Range Map|range maps]] in the field guide are built from
GBIF records. There's a satisfying loop there: a record you contribute can end
up drawing the map that somebody else sees in the app next year.

## What makes a record actually useful

Five things, in rough order of importance:

1. **An accurate location and time.** A record with a vague location is much
   weaker than one that's precisely placed. This is the part software gets right
   and humans get wrong.
2. **The raw audio.** Always. The verdict is an opinion; the file is evidence.
3. **An honest identification.** "Bat sp." is a real, useful record. A confident
   wrong species is worse than no species at all.
4. **A clean example.** One good pass beats forty scrappy ones. Nobody thanks
   you for uploading everything.
5. **Consistency over time.** The same garden, recorded regularly, is worth far
   more than a scattering of one-off visits — it turns into a picture of a
   season.

> [!tip] Start with one
> Pick your single best recording from your next outing and put it up. One good
> record you actually completed beats forty you meant to.

## The uncomfortable bit

None of this works if the pipeline is painful, and right now it is more painful
than it should be. That's a tooling problem, not a people problem — the
platforms are willing, the identifiers are willing, and there are far more
people recording bats than there are records reaching GBIF.

Closing that gap is, if I'm honest, the whole reason OpenBat is more than a nice
way to listen to bats.

Niall & the OpenBat Team 🙂
