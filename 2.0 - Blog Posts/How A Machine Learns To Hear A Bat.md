---
title: How a Machine Learns to Hear a Bat
description: The classifier in your pocket does not listen to sound at all. It looks at pictures. Here is why that works, and where it falls apart.
excerpt: The classifier in your pocket doesn't listen to sound at all — it looks at pictures of sound. Why that works, and where it comes unstuck.
date: 2026-09-22
author: Niall Bell
tags:
  - machine-learning
  - auto-id
coverImage: /static/images/autoid-cover.webp
featured: false
publish: false
---

When OpenBat puts a species name on screen, there's a neural network involved.
That word does a lot of unhelpful work in conversation, so I want to explain
what's actually happening, without maths, and without pretending it's cleverer
than it is.

The short version: **it isn't listening. It's looking.**

## Sound becomes a picture

We've already met the spectrogram — time across, pitch up, loudness as
brightness. Once you draw a bat call that way, it stops being a sound problem
and becomes an image problem. And image recognition is something computers got
very good at over the last fifteen years.

So the chain is:

1. Cut out the moment where a call happened.
2. Draw it as a small picture.
3. Show the picture to a model trained on thousands of similar pictures.
4. Get back a list of species with scores.

Everything difficult is hidden in step 3, and everything *interesting* is hidden
in step 4.

## What "trained" actually means

Nobody sat down and wrote rules like "if the call starts above 80 kHz and ends
near 40, it's this species". People tried that for years and it's brittle, because
individual bats vary enormously depending on what they're doing, how cluttered
the space is, how far away they are, and frankly their mood.

Instead, a model is shown an enormous number of labelled examples — this picture
is species A, this one is species B — and it gradually adjusts millions of
internal numbers until its guesses match the labels. Nobody tells it *which*
features matter. It works that out, and it often lands on things a human expert
wouldn't have articulated.

<figure class="chart">
  <svg viewBox="0 0 640 260" role="img" aria-label="A pipeline: labelled recordings feed training, which produces a model file, which is shipped inside the app and used on new calls.">
    <g class="chart-label">
      <rect x="10" y="30" width="150" height="70" rx="8" style="fill: var(--color-surface); stroke: var(--color-border)"></rect>
      <text x="85" y="58" text-anchor="middle" style="fill: var(--color-accent); font-weight: 700">Thousands of</text>
      <text x="85" y="76" text-anchor="middle" style="fill: var(--color-accent); font-weight: 700">labelled calls</text>
      <text x="85" y="120" text-anchor="middle" class="chart-label--small" style="fill: var(--color-muted)">recorded by researchers,</text>
      <text x="85" y="136" text-anchor="middle" class="chart-label--small" style="fill: var(--color-muted)">verified by people</text>
      <rect x="200" y="30" width="150" height="70" rx="8" style="fill: var(--color-surface); stroke: var(--color-border)"></rect>
      <text x="275" y="58" text-anchor="middle" style="fill: var(--color-accent); font-weight: 700">Training</text>
      <text x="275" y="76" text-anchor="middle" style="fill: var(--color-accent); font-weight: 700">(once, on big machines)</text>
      <text x="275" y="120" text-anchor="middle" class="chart-label--small" style="fill: var(--color-muted)">weeks of compute,</text>
      <text x="275" y="136" text-anchor="middle" class="chart-label--small" style="fill: var(--color-muted)">done by the model's authors</text>
      <rect x="390" y="30" width="110" height="70" rx="8" style="fill: var(--color-surface); stroke: var(--color-border)"></rect>
      <text x="445" y="62" text-anchor="middle" style="fill: var(--color-accent); font-weight: 700">A model file</text>
      <text x="445" y="80" text-anchor="middle" style="fill: var(--color-accent); font-weight: 700">(a few MB)</text>
      <rect x="530" y="30" width="100" height="70" rx="8" style="fill: var(--color-accent); opacity: 0.85"></rect>
      <text x="580" y="62" text-anchor="middle" style="fill: #111; font-weight: 700">In your</text>
      <text x="580" y="80" text-anchor="middle" style="fill: #111; font-weight: 700">pocket</text>
    </g>
    <g style="stroke: var(--color-secondary)" stroke-width="2" fill="none">
      <path d="M162 65 L 196 65" marker-end="url(#a)"></path>
      <path d="M352 65 L 386 65" marker-end="url(#a)"></path>
      <path d="M502 65 L 526 65" marker-end="url(#a)"></path>
    </g>
    <defs>
      <marker id="a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M0 0 L10 5 L0 10 z" style="fill: var(--color-secondary)"></path>
      </marker>
    </defs>
    <text x="320" y="200" text-anchor="middle" class="chart-label" style="fill: var(--color-secondary)">The expensive half happens once, somewhere else, by somebody else.</text>
    <text x="320" y="224" text-anchor="middle" class="chart-label" style="fill: var(--color-secondary)">Your phone only ever does the cheap half.</text>
  </svg>
  <figcaption>OpenBat doesn't train anything. It ships models other people published — NABat ML for North America, BatDetect2 for the UK — and runs them on device.</figcaption>
</figure>

That distinction matters. Training a bat classifier requires a large, carefully
labelled library of recordings that took researchers years to assemble. We
didn't build one and we're not pretending to. We use published, open models and
we say which one produced each answer.

## Why it can be confidently wrong

A trained model always produces an answer. Show it a bush cricket, a car door or
static, and it will still hand back its best guess with a number attached,
because "none of the above" is not something it learned unless somebody taught
it that category explicitly.

This is the single most misunderstood thing about classifiers, and it's why
OpenBat wraps the model in a set of checks rather than printing its output raw:

- **A pulse has to look like a call before it's shown the model at all.** Loud
  enough, high enough, long enough. Most rubbish never gets that far.
- **Confidence is displayed, not hidden.** A weak guess looks weak.
- **Geography gets a vote.** A species that has never been recorded within a
  thousand miles of you is heavily discounted, no matter how much the call
  resembles it.
- **Some answers come with a caution attached.** Species that genuinely can't be
  separated by sound are flagged as such, permanently, rather than being
  presented as a clean result.

## What it's genuinely good at, and what it isn't

Good at: telling a bat from not-a-bat. Narrowing a call down to a plausible
group. Being consistent — it never gets tired at 2am, and it applies the same
standard to the four hundredth call as the first.

Not good at: species that overlap heavily in call structure. Distant, faint or
cluttered recordings where half the call is missing. Anything from a region its
training data never covered — which is most of the world, and the main reason
identification is only offered where a model exists.

> [!note] A useful way to hold it
> The model is a fast, tireless, slightly overconfident assistant with a good
> eye and no judgement. Treat its answers as a starting point for a human, which
> is exactly how they're treated when a recording reaches iNaturalist.

## Why it runs on your phone

Every bit of this happens on the device. No audio, no location and no detection
is sent anywhere to produce an identification — which means it works in a valley
with no signal, costs nothing to run, and doesn't require you to trust us with
your recordings.

That was a deliberate decision with real costs attached, and it deserves its own
post. The short version: a bat detector that stops working when the bars run out
isn't a bat detector.

Niall & the OpenBat Team 🙂
