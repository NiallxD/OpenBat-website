---
title: Open Is Not the Same as Free
description: Free is a price. Open is a claim about who is allowed to look inside, rebuild it, or carry on without us.
excerpt: Free is a price. Open is a claim about who gets to look inside, rebuild it, or carry the whole thing on without us.
date: 2026-09-08
author: Niall Bell
tags:
  - openbat
  - project
featured: false
publish: false
---

"Free" is the first thing people notice about OpenBat, and it's the least
interesting thing about it.

Free is a price. Prices change. Plenty of things that started free are now a
subscription, and plenty of free apps are free because *you* are the thing
being sold. Free tells you almost nothing about whether a project can be
trusted or relied on.

Open is a different kind of claim. It's about who is allowed to look inside,
who is allowed to rebuild it, and what happens to your work if we get bored,
run out of time, or get hit by a bus.

## The stack, top to bottom

Here's every layer of OpenBat and what it's built on.

<figure class="chart">
  <svg viewBox="0 0 640 330" role="img" aria-label="A five-layer stack: hardware, species data, detection models, the app, and output format — each labelled with its open licence or standard.">
    <g class="chart-label">
      <rect x="40" y="15" width="560" height="52" rx="8" style="fill: var(--color-surface); stroke: var(--color-border)"></rect>
      <text x="60" y="38" style="fill: var(--color-accent); font-weight: 700">Hardware</text>
      <text x="60" y="57" style="fill: var(--color-secondary)">Griff Mini — open design and parts list, buildable for about $30 CAD</text>
      <rect x="40" y="77" width="560" height="52" rx="8" style="fill: var(--color-surface); stroke: var(--color-border)"></rect>
      <text x="60" y="100" style="fill: var(--color-accent); font-weight: 700">Species data</text>
      <text x="60" y="119" style="fill: var(--color-secondary)">The field guide — CC BY 4.0, downloadable in full</text>
      <rect x="40" y="139" width="560" height="52" rx="8" style="fill: var(--color-surface); stroke: var(--color-border)"></rect>
      <text x="60" y="162" style="fill: var(--color-accent); font-weight: 700">Detection models</text>
      <text x="60" y="181" style="fill: var(--color-secondary)">NABat ML and BatDetect2 — published, open, not ours</text>
      <rect x="40" y="201" width="560" height="52" rx="8" style="fill: var(--color-surface); stroke: var(--color-border)"></rect>
      <text x="60" y="224" style="fill: var(--color-accent); font-weight: 700">The app</text>
      <text x="60" y="243" style="fill: var(--color-secondary)">Free, source available, no account, no tracking</text>
      <rect x="40" y="263" width="560" height="52" rx="8" style="fill: var(--color-surface); stroke: var(--color-border)"></rect>
      <text x="60" y="286" style="fill: var(--color-accent); font-weight: 700">Output</text>
      <text x="60" y="305" style="fill: var(--color-secondary)">Plain WAV files and GUANO metadata, into iNaturalist and GBIF</text>
    </g>
  </svg>
  <figcaption>No layer of this depends on us being around. That is the actual design goal.</figcaption>
</figure>

Look at that stack and notice what's missing: there's no layer that only we can
supply. The microphone is somebody else's open design. The models are somebody
else's published research. The output is a format that bat researchers already
use, going into a platform run by a non-profit.

We're the connective tissue. That's a deliberately unglamorous job.

## Why that matters more than it sounds

Three practical consequences, none of them philosophical.

**Your recordings outlive the app.** OpenBat saves plain WAV files with
standard metadata, in a folder you can open in the Files app. If OpenBat
vanished tomorrow, your recordings would still be recordings, readable by every
piece of bat software in existence. Compare that to a proprietary format tied
to one company's desktop tool.

**Nobody has to trust us about the identifications.** The models are published.
Anyone who wants to argue with a result can go and read what the model was
trained on and how it behaves. We didn't invent a secret classifier and ask you
to believe in it.

**The field guide is a dataset, not a moat.** It's CC BY 4.0 and it lives in a
public repository. If somebody wants to take it and build a better app, they
can, and the bats come out ahead. That would sting for about a day and then
I'd get over it.

## The cost of being open

I'd be lying if I said it was all upside.

Open hardware means the microphone requires soldering, or knowing someone who
solders, or buying an assembled one from the people who make them properly.
That's a real barrier and no amount of enthusiasm makes an iron cool.

Open models mean we inherit their limits. The regions they cover are the
regions we can identify in — currently North America, with the UK in beta —
and we can't magic up a model for somewhere nobody has trained one.

Open data means the guide grows at the speed of people volunteering knowledge
and other people checking it. That's slower than typing it in ourselves, and
much slower than letting a language model fill in 1,400 species profiles, which
would be fast, cheap, and worthless.

> [!note] On the "free" bit
> The app is free because a price tag at the top of the funnel would defeat the
> entire point. If someone has to weigh up £5 before they can find out whether
> bats are interesting, most people never find out.

## One honest caveat

"Source available" isn't identical to a formally open-source licence, and I try
not to blur the two. The code can be read and inspected. The parts that matter
most for trust — the data, the models, the formats, the hardware — are
properly open, licensed, and usable without asking us anything.

If that distinction matters to you, good. It should. It's the sort of thing
worth being picky about.

Niall & the OpenBat Team 🙂
