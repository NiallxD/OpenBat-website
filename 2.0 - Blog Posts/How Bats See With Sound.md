---
title: How Bats See With Sound
description: Echolocation is not a superpower, it is a set of trade-offs. Understanding them explains almost everything you see on a spectrogram.
excerpt: Echolocation isn't a superpower so much as a set of trade-offs — and those trade-offs explain almost everything you see on a spectrogram.
date: 2026-11-17
author: Niall Bell
tags:
  - bats
  - echolocation
featured: false
publish: false
---

A bat shouts, listens for the echo, and works out what's in front of it. That's
the whole idea, and it's such a neat sentence that it hides how much engineering
is buried in it.

Once you understand the constraints a bat is working under, the shapes on your
spectrogram stop being arbitrary. Every one of them is a bat solving a physics
problem in real time.

## Distance is just timing

Sound travels about 343 metres per second in air. If a bat shouts and hears the
echo 6 milliseconds later, the sound made a round trip of about two metres, so
the target is about one metre away.

That's the easy part, and it's why calls have to be *short*. A bat that's still
shouting when the echo comes back can't hear the echo over itself. Short calls
mean you can detect close targets; longer calls carry further but blind you to
anything nearby.

This is why bats flying in cluttered space — through trees, along a hedge — use
short, quiet calls, and bats in open air use longer, louder ones. It's not
personality. It's the geometry of the situation.

## Pitch buys detail, and costs range

Here's the trade-off that shapes everything else.

<figure class="chart">
  <svg viewBox="0 0 640 260" role="img" aria-label="A trade-off chart: as frequency rises, detail improves but range falls sharply.">
    <line x1="60" y1="200" x2="600" y2="200" style="stroke: var(--color-border)"></line>
    <line x1="60" y1="30" x2="60" y2="200" style="stroke: var(--color-border)"></line>
    <path d="M70 190 C 200 150, 340 90, 590 45" fill="none" style="stroke: var(--color-accent)" stroke-width="3"></path>
    <path d="M70 50 C 200 90, 340 160, 590 192" fill="none" style="stroke: var(--color-secondary)" stroke-width="3" stroke-dasharray="7 5"></path>
    <text x="330" y="230" text-anchor="middle" class="chart-key" style="fill: var(--color-accent)">FREQUENCY →</text>
    <g class="chart-label">
      <text x="470" y="38" style="fill: var(--color-accent)">detail you can resolve</text>
      <text x="430" y="186" style="fill: var(--color-secondary)">how far it carries</text>
      <text x="80" y="46" style="fill: var(--color-secondary)">far</text>
      <text x="80" y="196" style="fill: var(--color-accent)">coarse</text>
    </g>
  </svg>
  <figcaption>Every echolocating bat sits somewhere on this crossing. Where it sits tells you a lot about how it hunts.</figcaption>
</figure>

A sound wave can only resolve detail down to roughly its own wavelength. At 20
kHz the wavelength is about 17 millimetres — fine for a wall, useless for a
midge. At 60 kHz it's under 6 millimetres, sharp enough to pick a small insect
out of the air.

So higher is better for detail. Unfortunately, high frequencies are absorbed by
air much faster than low ones. That 60 kHz call fades away in a few metres,
while a 20 kHz call carries much further.

Which gives you the two ends of the spectrum:

- **Low, loud callers** hunting in open air, detecting bigger prey further out.
- **High, quiet callers** working close in among vegetation, where they only
  need a few metres of range but need to see fine detail.

Neither is better. They're different jobs.

## Why calls sweep

Most insect-hunting bats don't hold a single note — they sweep down through a
range of frequencies in a few milliseconds. Why not just pick one and stick to
it?

Because a sweep gets you both ends of that trade-off in a single call. The high
part gives fine detail on anything close; the low part carries further and picks
up bigger structure. And because every moment of the call is at a slightly
different pitch, the returning echo can be matched precisely against the moment
it was sent — which sharpens the timing, and therefore the distance measurement.

Some species take the opposite approach: a long, almost constant note, sometimes
with a sweep tacked on the end. Those bats are usually exploiting the Doppler
shift, listening for the tiny frequency changes caused by a moth's beating wings
against a still background. That's an astonishing thing to do with a nose and a
pair of ears.

## The buzz

Watch a hunt on a spectrogram and you'll see it: calls arriving steadily, then
speeding up, then accelerating into a rattle that blurs together.

That's the bat updating faster as the target gets closer, because at half a
metre a call from a tenth of a second ago is already out of date. The feeding
buzz is the most information-dense fraction of a second in the entire hobby, and
it lasts about as long as a blink.

## What this means for you and your microphone

Three practical consequences:

**Distance flattens everything.** High frequencies fade first, so a bat further
away appears lower-pitched, narrower in bandwidth, and shorter than it really
was. When a measurement looks strange, "it was far away" is the first
explanation to reach for.

**Calls are directional.** A bat's beam is more like a torch than a lightbulb.
You often hear a pass fade in and out not because the bat moved away, but
because it turned its head.

**Cluttered sites under-report.** In dense woodland bats use short, quiet calls
that don't travel, so you detect a fraction of what's there. A quiet reading
from inside a wood means much less than a quiet reading from an open pond edge.

> [!note] The thing that still gets me
> A bat is doing all of this — timing echoes to fractions of a millisecond,
> adjusting its call for the space it's in, tracking a moving target — while
> flying, in the dark, using a brain the size of a blueberry. We built an entire
> app to draw one picture of it afterwards.

Niall & the OpenBat Team 🙂
