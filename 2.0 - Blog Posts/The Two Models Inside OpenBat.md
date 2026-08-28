---
title: The Two Models Inside OpenBat
description: North America gets one classifier, the UK gets another, and most of the world gets none. Here is why, and what "beta" means when it is attached to a species name.
excerpt: North America gets one classifier, the UK gets another, most of the world gets none — and one of them is labelled beta. Here is what all of that means.
date: 2026-11-27
author: Niall Bell
tags:
  - auto-id
  - machine-learning
featured: false
publish: false
---

OpenBat doesn't have "an AI". It ships two separate, published models built by
other people, and which one you get depends on where you are.

That's an unusual thing to be upfront about — most apps present identification
as a single seamless capability — but it explains a lot of otherwise confusing
behaviour, so it's worth knowing.

## The two of them

**NABat ML** covers North America. It comes out of the North American Bat
Monitoring Program, the continental standard for acoustic bat monitoring. If
you're in the US or Canada, this is what's scoring your calls.

**BatDetect2** covers the United Kingdom, and it's currently in **beta** in
OpenBat while we work out how well it holds up in real use.

They're not interchangeable and they don't work identically. They were trained
on different recordings, expect different lengths of audio, and know entirely
different sets of species. The app handles the differences — each model gets the
window length it was trained for, for instance — but the results carry the
fingerprint of whichever one produced them.

## Why not one global model?

Because it doesn't exist, and building it would be a research programme rather
than an app feature.

A classifier can only recognise species it was trained on, and training requires
a large library of recordings that have been verified by people who know what
they're listening to. Those libraries are built region by region, over years, by
research groups and monitoring programmes. Where the effort has gone in, you get
a model. Where it hasn't, you get nothing, and no amount of enthusiasm on our
part changes that.

<figure class="chart">
  <svg viewBox="0 0 640 220" role="img" aria-label="Three tiers: regions with a model get species identification, regions without still get full detection and recording, and everywhere gets the rest of the app.">
    <g class="chart-label">
      <rect x="20" y="20" width="600" height="52" rx="8" style="fill: var(--color-accent); opacity: 0.85"></rect>
      <text x="40" y="42" style="fill: #111; font-weight: 700">Everywhere</text>
      <text x="40" y="62" class="chart-label--small" style="fill: #111">detection, spectrogram, listening modes, recording, sessions, export</text>
      <rect x="20" y="84" width="600" height="52" rx="8" style="fill: var(--color-accent); opacity: 0.45"></rect>
      <text x="40" y="106" style="fill: var(--color-text); font-weight: 700">Where a model exists</text>
      <text x="40" y="126" class="chart-label--small" style="fill: var(--color-secondary)">+ species suggestions with confidence — North America, UK (beta)</text>
      <rect x="20" y="148" width="600" height="52" rx="8" style="fill: var(--color-surface); stroke: var(--color-border)"></rect>
      <text x="40" y="170" style="fill: var(--color-text); font-weight: 700">Where the guide is written</text>
      <text x="40" y="190" class="chart-label--small" style="fill: var(--color-secondary)">+ full species profiles, measurements, range maps</text>
    </g>
  </svg>
  <figcaption>Three separate coverage questions that people reasonably assume are one. A region can have any combination of these.</figcaption>
</figure>

This is the bit that surprises people most: **you can be somewhere with no model
and still get almost the whole app.** Detection doesn't need a classifier. A
spectrogram doesn't need a classifier. Recording, measuring, sessions, and
exporting a recording to iNaturalist all work perfectly well without one — and
an unidentified recording uploaded for human identification is a genuinely
useful contribution.

## What "beta" actually means here

It doesn't mean the model is bad. BatDetect2 is published research and it's
good work.

It means **we** haven't yet accumulated enough real-world use to know how it
behaves in ordinary hands, in ordinary places, with ordinary microphones. A model
can perform well on a curated test set and still surprise you when it meets a
phone in a hedge in the rain.

There's a concrete example of what "not verified" means here. Each model needs a
cut-off — how strong a score has to be before the app is willing to put a name on
it rather than recording the call as unidentified. NABat ML's cut-off was checked
against the reference pipeline it came from. BatDetect2's is a documented
starting point that nobody has yet tested against a labelled set of noise, and
its scoring behaves differently enough that the NABat number can't just be
borrowed. So the number in there is a reasonable guess, held loosely, waiting on
field data.

That's the beta: a real threshold that hasn't earned its place yet.

So the beta label is about our confidence in the integration, not a judgement on
the research. It'll come off when we've seen enough to say something honest
about it, and if the answer turns out to be "it struggles with X", we'll say
that too.

## The licence decides more than you'd think

One model was rejected for a reason that has nothing to do with accuracy.

BattyBirdNET is a capable classifier, and it was considered. Its weights carry a
*share-alike* term: anything derived from them — including a converted,
phone-ready copy — would have to be released under the same licence, obliging us
to let anyone redistribute it freely. BatDetect2's licence is the opposite shape:
non-commercial use only, but no obligation to hand the derived model back.

That fits how OpenBat is built, and it comes with a hard consequence: while the
app ships a non-commercial model, the app cannot be sold, subscribed to, or
carry in-app purchases of any kind. The licence, not a business decision, is
what keeps it free.

## Why we don't train our own

Two reasons, and the first is the honest one: we can't. Training a bat
classifier needs a verified recording library that takes research groups years
to assemble, and we don't have one.

The second reason is that we shouldn't, even if we could. A model that only
exists inside one app is a model nobody can check, compare, or improve. Using
published models means anyone sceptical about a result can go and read what the
model was trained on and how it performs. That's worth more than the marketing
value of "our own AI".

## What this means when you're using it

- **The model name is part of the result.** If you're reporting an
  identification anywhere serious, say which model produced it. Different
  classifiers disagree, and that's information.
- **No model doesn't mean no value.** Record it, upload it, let a human have a
  look.
- **Neither model knows about your specific site.** The geographic weighting
  that reranks results comes from records data, not from the model — which is
  why the two are worth thinking about separately.

> [!note] If you know of a model
> If there's a published, open classifier for a region we don't cover, we would
> genuinely love to hear about it. That's one of the highest-leverage messages
> you could send us — it turns a whole region from "detector" into "detector
> plus identification" in one go.

Niall & the OpenBat Team 🙂
