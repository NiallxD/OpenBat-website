---
title: Two Scores That Look the Same and Mean Completely Different Things
description: Pulse quality and species confidence are both percentages on the same screen, and confusing them will lead you badly astray.
excerpt: Pulse quality and species confidence are both percentages, sat on the same screen, meaning completely different things. Here is how to tell them apart.
date: 2026-09-25
author: Niall Bell
tags:
  - auto-id
  - machine-learning
coverImage: /static/images/autoid-priors.webp
featured: false
publish: false
---

There are two numbers in OpenBat that both look like percentages, sit near each
other, and answer entirely unrelated questions. Getting them mixed up is the
easiest mistake in the app, and it's one I've made myself while staring at my
own screen.

## Number one: how good is this recording?

**Pulse quality** is about the signal, and only the signal. Was the call loud
against the background? Is the sweep complete, or did it fade out halfway? Is it
clean, or smeared with echo and noise?

It knows nothing about species. A textbook-perfect recording of a bat nobody can
identify still scores highly, because the recording *is* good — that's all the
number claims.

Think of it as focus on a photograph. A sharp photo of an unidentifiable blob is
still a sharp photo.

## Number two: how sure is the model about the name?

**Species confidence** is the classifier's output, after a geographic sanity
check. It's about identity, not quality.

And here's the part that trips people up: **you can have one without the other,
in both directions.**

<figure class="chart">
  <svg viewBox="0 0 640 380" role="img" aria-label="A two by two grid crossing pulse quality against species confidence, with an example in each quadrant.">
    <line x1="90" y1="30" x2="90" y2="310" style="stroke: var(--color-border)"></line>
    <line x1="90" y1="310" x2="600" y2="310" style="stroke: var(--color-border)"></line>
    <line x1="345" y1="30" x2="345" y2="310" style="stroke: var(--color-border)" stroke-dasharray="4 4"></line>
    <line x1="90" y1="170" x2="600" y2="170" style="stroke: var(--color-border)" stroke-dasharray="4 4"></line>
    <text x="40" y="170" class="chart-key" style="fill: var(--color-accent)" transform="rotate(-90 40 170)">QUALITY</text>
    <text x="345" y="350" text-anchor="middle" class="chart-key" style="fill: var(--color-accent)">CONFIDENCE</text>
    <g class="chart-label" style="fill: var(--color-secondary)">
      <text x="110" y="60" style="fill: var(--color-text); font-weight: 700">Clean recording,</text>
      <text x="110" y="78" style="fill: var(--color-text); font-weight: 700">no clear name</text>
      <text x="110" y="102">A perfect call from a group</text>
      <text x="110" y="120">that overlaps by nature.</text>
      <text x="110" y="138">Worth keeping. Worth uploading.</text>
      <text x="365" y="60" style="fill: var(--color-text); font-weight: 700">Clean recording,</text>
      <text x="365" y="78" style="fill: var(--color-text); font-weight: 700">confident name</text>
      <text x="365" y="102">The one you want. Rare enough</text>
      <text x="365" y="120">to feel good about.</text>
      <text x="365" y="138">Definitely upload this.</text>
      <text x="110" y="205" style="fill: var(--color-text); font-weight: 700">Poor recording,</text>
      <text x="110" y="223" style="fill: var(--color-text); font-weight: 700">no clear name</text>
      <text x="110" y="247">A distant bat, or not a bat</text>
      <text x="110" y="265">at all. Fine as presence data,</text>
      <text x="110" y="283">nothing more.</text>
      <text x="365" y="205" style="fill: var(--color-text); font-weight: 700">Poor recording,</text>
      <text x="365" y="223" style="fill: var(--color-text); font-weight: 700">confident name</text>
      <text x="365" y="247">Be suspicious. This is where</text>
      <text x="365" y="265">classifiers embarrass</text>
      <text x="365" y="283">themselves.</text>
    </g>
  </svg>
  <figcaption>The bottom right corner is the one to watch. A confident name on a scrappy call is a claim worth doubting.</figcaption>
</figure>

## Why geography gets a vote — and where it doesn't

Before a species confidence is shown, the model's raw scores are weighed against
where you actually are. A species whose known range doesn't reach you is pushed
down; one that lives around you is not.

There's an important limit on that, and it's deliberate. Geography is only
allowed to decide **which** species to report — never **whether** this was a bat
call at all. That first question is settled on the model's raw, unweighted
output, because letting a location preference feed into it would let a setting
invent evidence. Priors choose between candidates; they never manufacture one.

The range data itself has three states rather than two: present, absent, and
*unknown*. A species nobody has mapped properly stays enabled at half weight
rather than being silenced, because "we have no data" and "it isn't here" are
very different statements and conflating them would quietly switch off real bats.

Where the boundary is uncertain, it's drawn generously on purpose. You're most
likely to be recording somewhere nobody has recorded before — that's what a new
detector is *for* — and a range that stops at the edge of existing survey
coverage would suppress exactly the species you're standing under.

It does mean genuine range extensions are hard to detect this way, which is a
real limitation and worth saying out loud. If you think you've found one, the
recording is the evidence, not the app's verdict. Send it to people who can
check it properly.

## Two extra flags, and what they really mean

Alongside the confidence you'll sometimes see:

- **Sounds alike.** This species is in a group that overlaps too much to
  separate by sound. It's a permanent caution about the species, not a comment
  on your call. Even a flawless recording gets this flag.
- **Or [another species].** On this particular call, a second species scored
  close behind the winner *and* belongs to the same confusable group. The app
  names it rather than quietly discarding it, so you can weigh the two yourself.
  The threshold for "close behind" is deliberately generous — the point is
  honesty, not a tidy screen.

The difference between them is worth internalising. The first says *"this can't
be resolved by sound"*. The second says *"this one was close"*.

## What to do with all this

A simple decision rule that will serve you well:

1. **High quality, high confidence** — keep it, upload it, enjoy it.
2. **High quality, low confidence** — keep it and upload it anyway. A clean
   recording is exactly what an identifier needs, and your uncertainty is
   honest data.
3. **Low quality, anything** — fine for "bats were here". Don't build a story on
   it.
4. **Low quality, high confidence** — the trap. Look at the spectrogram before
   you believe it.

Two numbers, two questions. Keep them separate and the app becomes much easier
to trust, mostly because you'll know exactly when not to.

Niall & the OpenBat Team 🙂
