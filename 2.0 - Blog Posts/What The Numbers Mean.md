---
title: What All Those Numbers Mean
description: Peak frequency, bandwidth, duration, sweep rate, Fc, Fk. A plain-language tour of the measurements OpenBat shows for each call.
excerpt: Peak frequency, bandwidth, duration, sweep rate, Fc, Fk — a plain-language tour of every measurement the app puts next to a bat call.
date: 2026-10-16
author: Niall Bell
tags:
  - how-to
  - spectrogram
coverImage: /static/images/screen-call-analysis.webp
featured: false
publish: false
---

Turn on advanced mode and OpenBat starts putting numbers next to every call. If
you've not met them before they look like a cockpit. They're not, really — most
of them are simple measurements of the shape you can already see on the
spectrogram.

Here's what each one is, and which of them are worth your attention.

## The shape they're all describing

<figure class="chart">
  <svg viewBox="0 0 640 320" role="img" aria-label="A single bat call annotated with start frequency, peak energy, characteristic frequency, end frequency, bandwidth and duration.">
    <line x1="90" y1="20" x2="90" y2="250" style="stroke: var(--color-border)"></line>
    <line x1="90" y1="250" x2="600" y2="250" style="stroke: var(--color-border)"></line>
    <path d="M200 50 C 220 100, 240 155, 280 182 C 330 214, 400 218, 440 220"
          fill="none" style="stroke: var(--color-accent)" stroke-width="10" stroke-linecap="round" opacity="0.3"></path>
    <path d="M200 50 C 220 100, 240 155, 280 182 C 330 214, 400 218, 440 220"
          fill="none" style="stroke: var(--color-accent)" stroke-width="4" stroke-linecap="round"></path>
    <!-- markers -->
    <circle cx="200" cy="50" r="6" style="fill: var(--color-text)"></circle>
    <circle cx="440" cy="220" r="6" style="fill: var(--color-text)"></circle>
    <circle cx="330" cy="200" r="6" style="fill: var(--color-accent); stroke: var(--color-text)" stroke-width="2"></circle>
    <circle cx="270" cy="178" r="6" style="fill: none; stroke: var(--color-text)" stroke-width="2"></circle>
    <g class="chart-label" style="fill: var(--color-secondary)">
      <text x="212" y="42">start — highest point</text>
      <text x="452" y="224">end — lowest point</text>
      <text x="344" y="196">Fc — the flattest part</text>
      <text x="180" y="172" text-anchor="end">Fk — the knee, where</text>
      <text x="180" y="188" text-anchor="end">it stops falling steeply</text>
    </g>
    <!-- bandwidth bracket -->
    <line x1="70" y1="50" x2="70" y2="220" style="stroke: var(--color-accent)" stroke-width="2"></line>
    <line x1="64" y1="50" x2="76" y2="50" style="stroke: var(--color-accent)" stroke-width="2"></line>
    <line x1="64" y1="220" x2="76" y2="220" style="stroke: var(--color-accent)" stroke-width="2"></line>
    <text x="46" y="140" class="chart-key" style="fill: var(--color-accent)" transform="rotate(-90 46 140)">BANDWIDTH</text>
    <!-- duration bracket -->
    <line x1="200" y1="272" x2="440" y2="272" style="stroke: var(--color-accent)" stroke-width="2"></line>
    <line x1="200" y1="266" x2="200" y2="278" style="stroke: var(--color-accent)" stroke-width="2"></line>
    <line x1="440" y1="266" x2="440" y2="278" style="stroke: var(--color-accent)" stroke-width="2"></line>
    <text x="320" y="296" text-anchor="middle" class="chart-key" style="fill: var(--color-accent)">DURATION</text>
  </svg>
  <figcaption>Every number in the app is measuring something on this picture. Once you can see them here, the panel stops being intimidating.</figcaption>
</figure>

## The measurements, one at a time

**Peak frequency (FPEAK)** — the pitch where the call is loudest. Not the
highest note, the *loudest* one. For most FM calls that's down in the flat tail,
because that's where the energy piles up. This is one of the most useful single
numbers for narrowing down species.

**Characteristic frequency (Fc)** — the frequency at the flattest part towards
the end of the call. It's a standard measurement in bat work because it tends to
be more stable between individuals of a species than the extremes are. If you're
going to compare a call to a reference table, this is usually the number the
table means.

**Start and end frequency** — the top and bottom of the sweep. Both are affected
by distance: the very top of a call is quiet and gets absorbed by air quickly,
so a distant bat often looks like it starts lower than it really did.

**Bandwidth (BNDWTH)** — how much frequency range the call covers, top to
bottom. Wide bandwidth means a steep, information-rich sweep, typical of a bat
working in cluttered space. Narrow bandwidth means a flatter call that carries
further, typical of open-air flying.

**Duration (DUR)** — how long the call lasts, in milliseconds. Usually
somewhere between about two and twenty. Bats in clutter use short calls; bats in
the open use longer ones.

**Sweep rate** — how fast the pitch falls, in hertz per millisecond, and it's a
big negative number because the pitch is going down. It's essentially "how steep
is that line".

**Knee frequency (Fk)** — where the call stops falling steeply and levels out.
The bend in the curve.

**Body slope** — the steepness of the main descending part, separately from the
tail.

**Toe** — whether the very end of the call kicks up, down, or stays flat. A
small detail that's diagnostic in some groups.

**Pulse rate** — how many calls per second are arriving. Not a property of one
call at all, but a property of the sequence, and it tells you what the bat is
doing. Steady means commuting; accelerating into a buzz means hunting.

**Quality** — how clean the measurement is, not how confident the species is.
Those two are [[Two Scores That Look The Same|very different numbers]] and
mixing them up is the classic mistake.

## Which ones actually matter

If you only look at three: **peak frequency, duration, and pulse rate.** Those
three between them tell you roughly what kind of bat it is and what it's doing,
and they're robust enough to be worth trusting from a live pass.

The rest are for afterwards, when you've opened a recording and you're comparing
against reference material properly.

## The caveat that matters more than any of them

**A single call is weak evidence.** Bats change their calls constantly depending
on what they're flying through, how far they are from a surface, whether they're
chasing something, and whether another bat is nearby. The same individual can
produce calls that look like two different species within a few seconds.

Which is why the app scores every pulse in a recording rather than just one, and
why the Pulses view exists — so you can see the whole spread of evidence, not
the single call that happened to be shown on screen. A consistent picture across
a dozen pulses is worth vastly more than one impressive-looking measurement.

> [!note] Distance lies to you
> Almost every one of these numbers is affected by how far away the bat was.
> High frequencies fade first, so distant calls look lower, narrower and
> shorter than they really were. When something looks odd, "it was far away" is
> the first explanation to reach for.

Niall & the OpenBat Team 🙂
