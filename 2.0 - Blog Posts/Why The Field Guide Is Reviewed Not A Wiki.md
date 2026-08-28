---
title: Why the Field Guide Is Reviewed, Not a Wiki
description: Anyone can propose a change to the guide. Nobody can publish one alone. That is slower, more annoying, and absolutely necessary.
excerpt: Anyone can propose a change to the field guide. Nobody publishes one alone. That is slower, more annoying, and completely necessary.
date: 2026-10-09
author: Niall Bell
tags:
  - field-guide
  - dev-log
coverImage: /static/images/guide-editor-entry.webp
featured: false
publish: false
---

The field guide inside OpenBat is written by the community. It is not, however,
a wiki, and the difference is one of the more consequential decisions in the
whole project.

Anyone can propose an entry or a correction. Nobody can publish one on their
own. Every change goes through review before it reaches anybody's phone.

## Why not just let people edit it?

Open editing works brilliantly for some things. It works because errors are
visible, lots of people are watching, and a mistake gets caught within minutes
by someone who happened to be reading.

A bat field guide has none of those properties.

- **Errors are invisible.** If an entry says a species' calls peak at 45 kHz
  when it's really 52, that looks completely normal. There is no red squiggle
  under a wrong number.
- **Almost nobody is watching.** The number of people worldwide who could catch
  a subtle error in the entry for a given species might be in the dozens. For
  some species, single figures.
- **The consequences are downstream and silent.** Somebody reads the wrong
  number, mis-identifies a call, uploads it confidently, and a wrong record
  enters a dataset that's supposed to help protect the animal.

An app that hands people confident wrong information about wildlife is worse
than an app that hands them nothing, because they'll act on it.

## What review actually looks like

<figure class="chart">
  <svg viewBox="0 0 640 220" role="img" aria-label="A four-step flow: someone fills in the guide editor, a change request is opened, a reviewer who knows the group checks it, and it ships in an app update.">
    <g class="chart-label">
      <rect x="8" y="60" width="140" height="72" rx="8" style="fill: var(--color-accent); opacity: 0.85"></rect>
      <text x="78" y="90" text-anchor="middle" style="fill: #111; font-weight: 700">You fill in</text>
      <text x="78" y="108" text-anchor="middle" style="fill: #111; font-weight: 700">the form</text>
      <rect x="172" y="60" width="140" height="72" rx="8" style="fill: var(--color-surface); stroke: var(--color-border)"></rect>
      <text x="242" y="90" text-anchor="middle" style="fill: var(--color-text); font-weight: 700">A change</text>
      <text x="242" y="108" text-anchor="middle" style="fill: var(--color-text); font-weight: 700">request opens</text>
      <rect x="336" y="60" width="140" height="72" rx="8" style="fill: var(--color-surface); stroke: var(--color-border)"></rect>
      <text x="406" y="90" text-anchor="middle" style="fill: var(--color-text); font-weight: 700">Someone who</text>
      <text x="406" y="108" text-anchor="middle" style="fill: var(--color-text); font-weight: 700">knows the group</text>
      <rect x="500" y="60" width="132" height="72" rx="8" style="fill: var(--color-surface); stroke: var(--color-border)"></rect>
      <text x="566" y="90" text-anchor="middle" style="fill: var(--color-text); font-weight: 700">Ships in an</text>
      <text x="566" y="108" text-anchor="middle" style="fill: var(--color-text); font-weight: 700">app update</text>
    </g>
    <g style="stroke: var(--color-secondary)" stroke-width="2" fill="none">
      <path d="M150 96 L 168 96"></path><path d="M314 96 L 332 96"></path><path d="M478 96 L 496 96"></path>
    </g>
    <text x="320" y="180" text-anchor="middle" class="chart-label" style="fill: var(--color-muted)">Every step is public. Every change carries the name of whoever wrote it.</text>
  </svg>
  <figcaption>Deliberately unexciting. The interesting part is that step three exists at all.</figcaption>
</figure>

You use the [[Adding a Bat to the Field Guide|guide editor]] on the website,
which shows the guide as ordinary form fields — no raw data files, no code. When
you submit, it opens a change request against the public field guide repository.
Somebody with relevant knowledge reads it. If it's right, it goes in and ships
with the next app update.

Your name goes on it, because the record of who contributed what is part of the
point. Use whatever name you're happy to see published.

## Being honest about the bottleneck

Review is a bottleneck. It's meant to be, but that doesn't make it painless.

Right now the reviewing capacity is small, which means submissions can sit. If
you've sent something in and heard nothing for a while, it's not a rejection and
it's not disinterest — it's a queue with not enough people in front of it.

Growing that reviewer pool is one of the genuinely hard problems in the project.
It's not a technical problem at all; it's a "how do you earn enough trust with
busy experts that they'll spend an evening checking somebody's *Myotis* entry"
problem.

## Which is why the guide starts small

There are around 1,400 bat species. We are not going to have a good entry for
all of them, and pretending otherwise would produce exactly the kind of thin,
confidently-wrong content this whole model exists to avoid.

So the guide is complete where we can vouch for it and honest about where it
isn't. British Columbia first, because that's where the project lives and where
the expertise we can actually reach is. Then outwards, at whatever pace real
people can review.

That's an unglamorous roadmap. It's the difference between a field guide and a
pile of text, though, and I'd rather have the first one.

> [!tip] You know more than you think
> You don't need a doctorate to contribute. If you know that a species is common
> in your valley, or that a photo is mislabelled, or that a measurement looks
> off, that's a useful submission. The reviewer's job is to check, not to be
> impressed.

If you want to have a go, the [Contribute](/contribute/) page is the way in.

Niall & the OpenBat Team 🙂
