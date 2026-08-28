---
title: Choosing a Microphone
description: The app is free and the phone is in your pocket. The microphone is the one thing you have to solve, and the price range is enormous.
excerpt: The app is free and you already own the phone. The microphone is the one thing you have to solve — and the prices range from about thirty dollars to several hundred.
date: 2026-11-03
author: Niall Bell
tags:
  - hardware
  - how-to
coverImage: /static/images/griff-hero.webp
featured: false
publish: false
---

Your phone cannot hear bats. This surprises people, so it's worth being blunt
about: the microphone in a phone is designed for speech, filters aggressively
above the range of human hearing, and typically samples at rates that
physically cannot represent an ultrasonic call. No app can fix that. It isn't a
software limitation, it's a hardware one.

So you need an ultrasonic microphone. That's the whole barrier, and it's worth
understanding what you're actually buying.

## What matters, in order

**Sample rate.** This is the number that decides what you can hear at all. A
digital recording can only represent frequencies up to half its sample rate, so
a 384 kHz microphone can capture sound up to about 192 kHz — comfortably above
every bat you're likely to meet. That's the number to look for.

**Whether it needs its own app.** Some microphones only talk to their
manufacturer's software. Those won't work with OpenBat, or with anything else,
and you're buying into one company's ecosystem. Anything that presents itself as
a standard USB audio device will work.

**Connector and adapter.** USB-C or Lightning depending on your phone, and
whichever adapter bridges the gap. Test this indoors before you take it out.

**Weather resistance and a way to hold it.** Less glamorous, more relevant than
you'd think at 11pm in a drizzle.

## The price landscape

<figure class="chart">
  <svg viewBox="0 0 640 240" role="img" aria-label="A price scale showing an open-source self-build microphone at around thirty dollars and commercial detector hardware from about one hundred and eighty dollars upwards.">
    <line x1="40" y1="150" x2="610" y2="150" style="stroke: var(--color-border)" stroke-width="2"></line>
    <g style="fill: var(--color-accent)">
      <circle cx="90" cy="150" r="10"></circle>
      <circle cx="420" cy="150" r="10"></circle>
      <circle cx="560" cy="150" r="10"></circle>
    </g>
    <g class="chart-label" style="fill: var(--color-secondary)">
      <text x="90" y="120" text-anchor="middle" style="fill: var(--color-text); font-weight: 700">~$30 CAD</text>
      <text x="90" y="186" text-anchor="middle">open-source design,</text>
      <text x="90" y="202" text-anchor="middle">you or a friend build it</text>
      <text x="420" y="120" text-anchor="middle" style="fill: var(--color-text); font-weight: 700">$180+</text>
      <text x="420" y="186" text-anchor="middle">commercial detector</text>
      <text x="420" y="202" text-anchor="middle">hardware</text>
      <text x="560" y="120" text-anchor="middle" style="fill: var(--color-text); font-weight: 700">£200+</text>
      <text x="560" y="186" text-anchor="middle">standalone recorders,</text>
      <text x="560" y="202" text-anchor="middle">desktop analysis</text>
    </g>
    <text x="325" y="40" text-anchor="middle" class="chart-key" style="fill: var(--color-accent)">THE GAP THIS PROJECT EXISTS TO CLOSE</text>
    <path d="M110 62 C 200 62, 250 100, 300 130" fill="none" style="stroke: var(--color-accent)" stroke-width="2" stroke-dasharray="5 5"></path>
    <path d="M540 62 C 460 62, 400 100, 350 130" fill="none" style="stroke: var(--color-accent)" stroke-width="2" stroke-dasharray="5 5"></path>
  </svg>
  <figcaption>An order of magnitude. That difference is the whole reason a curious person can try this at all.</figcaption>
</figure>

The commercial detectors are good instruments and I'm not going to pretend
otherwise. They're built by people who've been doing this for decades, they're
robust, and the research-grade end of the market genuinely needs research-grade
kit.

But at £180 to £250, buying one is a decision, not an impulse. Nobody spends
that to find out whether they're interested. The open-source designs — most
notably Phil Atkin's **Griff Mini**, buildable for around thirty Canadian
dollars — change the question from "am I committed to this hobby?" to "shall I
have a go?"

## The soldering problem

Here's the honest catch: cheap open hardware means somebody has to build it, and
that somebody needs to be able to solder small components.

Your options, roughly:

- **Build it yourself.** The design and parts list are public. It's a good
  first surface-mount project, and there's a
  [[Build Your Own Bat Microphone|full walkthrough]] here.
- **Buy one assembled.** There's an official commercial channel for the Griff,
  which is the sensible route if you'd rather not own a hot air station.
- **Find a group.** Bat groups, naturalist clubs, makerspaces and university
  societies are full of people who can solder and would enjoy a batch build
  evening. This is by far the best option and produces more detectors *and*
  more bat people.
- **Buy any other standard USB ultrasonic mic.** OpenBat isn't tied to one
  design. If a mic presents itself as a normal audio device at a high sample
  rate, it works.

## What you don't need

**You don't need the most expensive option to contribute usefully.** A record
that says "bats were active here on this date" doesn't get better with a more
expensive microphone. The floor for useful data is genuinely low.

**You don't need a separate recorder.** Your phone is the recorder. That's the
whole design.

**You don't need to worry about matching brands.** There's no ecosystem here and
no lock-in. Files come out as plain WAV with standard metadata, readable by
every piece of bat software going.

> [!tip] Before you buy anything
> Ask your local bat group whether they have a detector you can borrow for an
> evening. Most do, most are delighted to be asked, and one borrowed night will
> tell you more about what you want than any amount of spec-comparing.

## The one thing I'd say to anyone hesitating

The gear is the least interesting part of this hobby and it's where people spend
the most time deliberating. Whatever you get, the first night you hear a bat
overhead as a burst of clicks will be worth it — and the second night, when you
notice the same bat arriving at roughly the same time, is when it really starts.

Niall & the OpenBat Team 🙂
