---
title: How to Read a Spectrogram
description: The picture on the detector screen is a map of sound. Once you can read it, you can tell a bat from a bush cricket at a glance.
excerpt: The picture on the detector screen is a map of sound — time across, pitch up, loudness as brightness. Once it clicks, you can spot a bat at a glance.
date: 2026-09-15
author: Niall Bell
tags:
  - how-to
  - spectrogram
coverImage: /static/images/screen-detector.webp
featured: false
publish: false
---

The spectrogram is the bit of the app people either love immediately or find
completely baffling. It's worth twenty minutes of your attention, because once
it clicks you stop needing the species name to know roughly what just flew over.

## Three axes, one picture

A spectrogram is a graph of sound with three things happening at once:

- **Left to right is time.** New sound arrives at one edge and scrolls away.
- **Bottom to top is pitch**, in kilohertz. Low rumbles at the bottom, bat calls
  high up.
- **Brightness is loudness.** Faint sounds are dim, loud ones glow.

That's it. Everything else is practice.

For scale: human hearing tops out somewhere around 20 kHz when you're young,
and drops from there. Most of what you'll be looking at sits between 20 and 60
kHz, comfortably above anything you could hear unaided.

## The shape of a bat call

Here's the classic one — a frequency-modulated sweep, which is what most
insect-hunting bats in temperate regions use.

<figure class="chart">
  <svg viewBox="0 0 640 300" role="img" aria-label="An annotated spectrogram sketch showing a steep downward sweep from about 80 kHz to 40 kHz, with the start, end, peak energy and duration marked.">
    <!-- axes -->
    <line x1="70" y1="30" x2="70" y2="250" style="stroke: var(--color-border)" stroke-width="1"></line>
    <line x1="70" y1="250" x2="600" y2="250" style="stroke: var(--color-border)" stroke-width="1"></line>
    <g class="chart-label chart-label--small" style="fill: var(--color-muted)">
      <text x="34" y="46">100</text><text x="40" y="106">80</text><text x="40" y="166">60</text><text x="40" y="226">40</text>
      <text x="16" y="150" transform="rotate(-90 16 150)">kHz</text>
      <text x="335" y="278" text-anchor="middle">time — about 6 milliseconds across this whole call</text>
    </g>
    <!-- the call: steep at the top, flattening at the bottom -->
    <path d="M250 76 C 268 120, 286 168, 320 190 C 352 210, 400 214, 430 216"
          fill="none" style="stroke: var(--color-accent)" stroke-width="9" stroke-linecap="round" opacity="0.35"></path>
    <path d="M250 76 C 268 120, 286 168, 320 190 C 352 210, 400 214, 430 216"
          fill="none" style="stroke: var(--color-accent)" stroke-width="4" stroke-linecap="round"></path>
    <!-- annotations -->
    <circle cx="250" cy="76" r="5" style="fill: var(--color-text)"></circle>
    <circle cx="430" cy="216" r="5" style="fill: var(--color-text)"></circle>
    <g class="chart-label" style="fill: var(--color-secondary)">
      <text x="262" y="66">start — the highest note</text>
      <text x="442" y="212">end — the lowest note</text>
      <text x="342" y="168">the flat tail, where most</text>
      <text x="342" y="186">of the energy sits</text>
    </g>
    <line x1="250" y1="262" x2="430" y2="262" style="stroke: var(--color-secondary)" stroke-width="1"></line>
    <line x1="250" y1="256" x2="250" y2="268" style="stroke: var(--color-secondary)" stroke-width="1"></line>
    <line x1="430" y1="256" x2="430" y2="268" style="stroke: var(--color-secondary)" stroke-width="1"></line>
  </svg>
  <figcaption>One call, hugely magnified. In real time this whole thing lasts about as long as it takes a housefly to beat its wings twice.</figcaption>
</figure>

Read it left to right: the bat starts high and sweeps down, fast. The steep part
at the top covers a wide range of frequencies quickly, which is great for
picking out fine detail — the shape and texture of whatever it's flying at. The
flatter tail at the bottom lingers on a narrow band, which carries further and
is where most of the loudness lives.

Different species lean different ways. Some sweep steeply through a huge range;
some barely sweep at all and sit almost flat; some start so high the top of the
call is off the edge of the screen. Those differences are exactly what a
classifier is looking at, and what an experienced human eye picks up too.

## Rhythm tells you as much as shape

A single call is one data point. A sequence tells a story.

- **Steady, evenly spaced calls** — a bat commuting, cruising along a hedgerow,
  scanning ahead.
- **Calls speeding up** — it's noticed something and is closing in.
- **A buzz**: calls so close together they blur into a rattle. That's the final
  approach to an insect. Whether it caught it, you'll never know, which is
  probably for the best.
- **A pass that fades in and out** — the bat is turning. Bat calls are
  directional, like a torch beam, and you only hear it properly when the beam
  sweeps over your microphone.

## Things that aren't bats

Half of reading a spectrogram is learning what to ignore.

- **Bush crickets and grasshoppers.** Genuinely ultrasonic, genuinely loud, and
  the most common false alarm there is. They look like dense, scratchy, repeated
  blocks rather than clean sweeps, and they very often just keep going.
- **Keys, zips and rustling fabric.** Broadband clicks — vertical smears that
  cover every frequency at once, because a sharp mechanical noise contains
  everything.
- **Wind.** A wash of low-frequency noise that lifts the whole bottom of the
  picture and hides everything else.
- **Electronics.** Some LED drivers, chargers and cheap dimmers whine at
  ultrasonic frequencies. Look for a perfectly flat, perfectly constant line —
  nothing alive is that consistent.

> [!tip] The one-second test
> Bats are brief. If a mark on your spectrogram has been there for more than a
> second or two without changing, it is almost certainly not a bat.

## Getting a proper look

Live, the picture is scrolling and you're outside in the dark. Afterwards, open
a recording from its session and you get the whole pass as one still image, with
time to actually study it — and you can drag the spectrogram back through
recent history to re-examine something you nearly missed.

**Triggered display mode** is the other trick. It throws away the silence and
shows only the pulses, back to back, which turns four hours of a quiet night
into something you can scan in a minute.

Spend a couple of evenings looking rather than naming, and the shapes start to
sort themselves. That's the point at which this hobby gets its hooks in.

Niall & the OpenBat Team 🙂
