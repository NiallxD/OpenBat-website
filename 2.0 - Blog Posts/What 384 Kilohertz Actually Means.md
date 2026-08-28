---
title: What 384 kHz Actually Means
description: The number on the microphone box decides which bats you can hear at all. Here is the arithmetic, and why you must never compress a bat recording.
excerpt: The number on the microphone box decides which bats you can hear at all — and it is also why you must never, ever compress a bat recording.
date: 2026-11-20
author: Niall Bell
tags:
  - hardware
  - how-to
featured: false
publish: false
---

Every ultrasonic microphone is sold with a sample rate on it — usually 192 kHz,
256 kHz or 384 kHz. It's the single most important number on the box and it's
rarely explained, so here's what it's actually telling you.

## Digital audio is a series of snapshots

A microphone measures air pressure. To store that as a file, a computer takes
measurements at a fixed rate — 384,000 times a second, in our case — and writes
each one down as a number.

There's a rule about how fast you have to measure, and it's unusually
clean: **you can only faithfully capture frequencies up to half your sample
rate.** Half of 384 kHz is 192 kHz, so a 384 kHz microphone can represent sound
up to about 192 kHz.

Bat calls generally live between about 15 and 120 kHz depending on species. So
384 kHz has comfortable headroom over essentially everything, which is why it's
the number to aim for.

<figure class="chart">
  <svg viewBox="0 0 640 250" role="img" aria-label="A frequency scale from 0 to 192 kHz showing human hearing at the bottom, the bat call range in the middle, and the ceilings for 48, 192 and 384 kHz sample rates.">
    <line x1="40" y1="180" x2="610" y2="180" style="stroke: var(--color-border)" stroke-width="2"></line>
    <rect x="40" y="150" width="60" height="30" style="fill: var(--color-secondary)" opacity="0.45"></rect>
    <rect x="100" y="150" width="300" height="30" style="fill: var(--color-accent)" opacity="0.8"></rect>
    <g class="chart-label chart-label--small" style="fill: var(--color-muted)">
      <text x="40" y="200">0</text>
      <text x="96" y="200">20</text>
      <text x="196" y="200">60</text>
      <text x="396" y="200">120</text>
      <text x="596" y="200">192 kHz</text>
    </g>
    <text x="70" y="140" text-anchor="middle" class="chart-label--small" style="fill: var(--color-secondary)">you</text>
    <text x="250" y="140" text-anchor="middle" class="chart-label" style="fill: var(--color-accent); font-weight: 700">bat calls live here</text>
    <!-- ceilings -->
    <line x1="112" y1="40" x2="112" y2="150" style="stroke: var(--color-muted)" stroke-dasharray="4 4"></line>
    <text x="118" y="52" class="chart-label--small" style="fill: var(--color-muted)">a phone mic gives up around here</text>
    <line x1="330" y1="70" x2="330" y2="150" style="stroke: var(--color-secondary)" stroke-dasharray="4 4"></line>
    <text x="336" y="82" class="chart-label--small" style="fill: var(--color-secondary)">192 kHz sampling reaches 96 kHz</text>
    <line x1="600" y1="100" x2="600" y2="150" style="stroke: var(--color-accent)" stroke-dasharray="4 4"></line>
    <text x="594" y="112" text-anchor="end" class="chart-label--small" style="fill: var(--color-accent)">384 kHz sampling reaches 192 kHz</text>
  </svg>
  <figcaption>Sample rate sets a hard ceiling. Anything above it isn't quiet — it's absent, and no processing brings it back.</figcaption>
</figure>

## Why your phone can't do this

A phone microphone is built for speech. It's optimised for the range a human
voice occupies, it filters hard above the range human ears use, and its audio
path typically runs at rates like 44.1 or 48 kHz — a ceiling of around 24 kHz.

Most bats call above that. Some sit right at the edge of it, which is why you'll
occasionally hear someone claim their phone picked up a bat: it might have
caught the very bottom of a low-frequency species. What you can't do is get a
usable, identifiable, complete call out of it.

This isn't a software problem and no app can solve it. The information was never
recorded.

## The thing that ruins recordings

**Never compress a bat recording.** Not MP3, not AAC, not "just to email it".

Compressed audio formats work by discarding what human ears don't notice.
They're extremely good at it — that's why they exist — and every single
assumption they make is about human hearing. Ultrasound is, by definition,
outside that. A compressor looks at a bat call and sees a large amount of data
carrying no perceptible information, and it does exactly what you'd expect.

So: keep everything as WAV. Share as WAV. If a platform offers to convert,
decline.

The one exception is *lossless* compression — FLAC — which shrinks a file while
guaranteeing that every original bit comes back out. That's a different thing
entirely from MP3, and it's what OpenBat uses when a recording is contributed to
the shared library. Locally it writes plain WAV with standard metadata, because
boring formats are durable formats.

## What "actual sample rate" means in the app

OpenBat shows the sample rate it's really receiving, not the one you'd like it
to be. If it says something lower than expected, it usually means one of:

- The microphone is set to a lower rate than its maximum.
- Another app has claimed the audio session and the system has renegotiated.
- The adapter or cable can't sustain the data rate.

It's worth glancing at once when you plug in, because a night recorded at the
wrong rate is a night of recordings missing their top end.

There's a safety net behind that, and the story of it is a good illustration of
why the number matters. The identification models are trained at one specific
sample rate, and the maths that turns audio into the picture they look at assumes
it. Feed a model 50 milliseconds of audio recorded at a different rate and it
reads the frequency axis wrong — potentially by a factor of eight — and returns a
confident species name computed from a stretched picture. No error, no warning,
just a wrong answer that looks exactly like a right one.

The app now refuses. If the microphone isn't delivering the rate the model was
built for, everything else proceeds normally — the call is detected, drawn,
measured and recorded — and only the species name is withheld, with the pass
logged as unidentified. A missing name is recoverable. A wrong one, sitting in
your session list and eligible for upload, is not.

## What about higher than 384?

There are microphones that go higher, and for a few specialised purposes they're
worth it. For general bat detecting, 384 kHz covers the species you're likely to
meet with room to spare, and higher rates mean bigger files, more processing,
and more battery for information you probably weren't going to use.

Put differently: 384 kHz is not a compromise you're settling for. It's the point
where the curve flattens.

> [!tip] The two-second check
> When you plug in, look at the sample rate on screen and the status indicator.
> Green and 384 kHz means you're good. Doing that once at the start beats
> discovering it at the end.

Niall & the OpenBat Team 🙂
