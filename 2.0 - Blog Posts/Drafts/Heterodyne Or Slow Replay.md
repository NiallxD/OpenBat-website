---
title: Heterodyne, Slow Replay, and What They Do to a Bat
description: Two ways to make an ultrasonic call audible, each with a real trade-off. Here is what each one is doing to the sound, and when to use which.
excerpt: Two ways to drag an ultrasonic call into human hearing, each with a genuine trade-off. What they do to the sound, and when to pick which.
date: 2026-09-18
author: Niall Bell
tags:
  - how-to
  - listening
featured: false
publish: false
---

You cannot hear a bat. Not really. The calls are up around 25 to 60 kHz and your
ears gave up somewhere below 20, so every bat detector ever built exists to
solve the same problem: how do you drag that sound down into a range a human can
actually hear?

There are two classic answers, and OpenBat does both. They are not
interchangeable, and knowing which is which changes what you get out of a night.

## Heterodyne: the radio trick

Heterodyning is borrowed straight from radio. You pick a frequency, the detector
mixes the incoming sound against that frequency, and what comes out is the
*difference* between the two.

Tune to 45 kHz, a bat calls at 47 kHz, and you hear a 2 kHz tone — a click or a
chirp, well within human hearing.

The consequences of that are worth understanding:

- **It never stops listening.** The processing is continuous and real time, so
  you don't miss anything while it works.
- **It only hears a narrow band around your tuning.** Sound far from your tuned
  frequency comes out too high or too low to be useful. This is why a bat can be
  right overhead and nearly silent if you're tuned badly.
- **It throws away most of the information.** Heterodyne turns a rich,
  structured sweep into a click. You lose the shape. Two different species can
  sound nearly identical through it.

That last point is worth more than a bullet, because it's been measured. Your ear
needs somewhere between six and ten cycles of a tone to register it as a pitch at
all. A steep FM sweep crosses the narrow window heterodyne listens through in
about a millisecond and a half — which at the shipped settings works out at
roughly **two and a half cycles per call**.

Below the floor where pitch exists, in other words. What you hear genuinely is a
click rather than a note, and no amount of cleverer mixing changes that: the call
isn't inside the window long enough for anything else to be possible. Think of it
as a Geiger counter for bats. Brilliant for *"is anything out there?"*, poor for
*"what was that?"*.

## Slow replay: the honest one

Time expansion — "slow replay" in the app — does something conceptually simpler.
It records a short window of real audio around a detected call, then plays that
window back many times slower — sixteen times, by default.

Slow the audio down sixteen times and every frequency in it drops sixteen times
too. A 48 kHz call becomes 3 kHz. Suddenly you're not hearing a click, you're
hearing the actual sweep: the pitch falling, the texture, the difference between
a clean call and a messy one. It sounds like a bird. It's genuinely lovely.

(Eight times is the number the hardware gives you for free — 384 kHz divided by
the 48 kHz the speaker wants — and it needs no filtering at all. Sixteen goes
past that ratio and has to interpolate to get there. It won a night of field
tuning anyway, because slowing each call twice as far turned out to be worth the
trouble.)

The catch is in the arithmetic. Playing back half a second of audio at
one-sixteenth speed takes eight seconds, and during those eight seconds the
microphone isn't listening for the next call.

{% chart {
  key: "SECONDS ACTUALLY LISTENING, IN A 30-SECOND WINDOW",
  max: 30,
  bars: [
    { label: "heterodyne", value: 30, note: "30 s — never stops listening", highlight: true },
    { label: "slow replay", value: 14, note: "14 s — two calls, 8 s deaf after each" }
  ],
  caption: "The trade is the technique, not the app. Every time-expansion detector ever made has had this gap in it: while it plays a call back to you, it cannot hear the next one."
} %}

That gap isn't a bug we haven't got round to fixing. It's inherent to playing
sound back slower than it arrived, and dedicated time-expansion detectors have
always worked this way. Both numbers are yours to change: a shorter window or a
gentler slowdown buys the deaf time back, at the cost of catching less of the
call and hearing it less slowly.

## So which one?

By default OpenBat keeps heterodyne running underneath slow replay — ducking
politely while a replay sounds — so you get continuous awareness *and* the
occasional beautiful slowed-down call. The tuning panel offers heterodyne only,
replay only, or both.

There's a nice touch in the heterodyne-only setting: the snippet is still
captured and replayed silently underneath. Switching over mid-pass therefore
isn't jarring, because the mode was already running — you just weren't hearing
it.

Rough guide:

| Situation | Use |
|---|---|
| Walking a transect, want to know where bats are | Heterodyne |
| Standing at a good spot, want to enjoy them | Slow replay, heterodyne underneath |
| Busy night, lots of passes | Heterodyne — eight deaf seconds per replay adds up |
| Quiet night, one bat that keeps returning | Slow replay, definitely |
| Trying to identify something by ear | Neither — record it and look at the spectrogram |

That last row is the important one. Neither listening mode is an identification
tool. They're for *you*, so the night has a soundtrack and you know when to look
up. Identification happens on the picture, not in your ears.

> [!note] The feedback loop
> When your phone plays a bat call out loud, the microphone can hear it and
> detect it again. Use earphones, or keep the volume low, unless you enjoy
> logging imaginary bats.

## And afterwards

Once a recording exists on disk, the trade-off disappears entirely. Open the
recording from its session and you get full time expansion with nothing missed
and nothing skipped, because the whole file is already there. All the pleasure
of slow replay, none of the gap.

Which is a decent summary of the whole hobby, really: listen in the moment,
understand it afterwards.

Niall & the OpenBat Team 🙂
