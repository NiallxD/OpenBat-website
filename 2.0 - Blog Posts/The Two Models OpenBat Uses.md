---
title: The Two Models OpenBat Uses
description: OpenBat doesn't have "an AI" — it ships two published classifiers, NABat ML for North America and BatDetect2 for the UK, and only one runs at a time. What each is, how they differ, and why their numbers can't be compared.
excerpt: OpenBat ships two published classifiers rather than one of its own — NABat ML for North America, BatDetect2 for the UK. Only one runs at a time, and their confidence figures mean different things.
date: 2026-09-05
author: Niall Bell
tags:
  - auto-id
  - classifier
  - machine-learning
featured: false
publish: true
---

OpenBat doesn't have "an AI". It ships two separate, published models built by
other people, and which one you get depends on where you are. Most apps present
identification as one seamless capability; being upfront about this explains a
lot of otherwise confusing behaviour.

This is the short version. For how either model's output is actually turned into
a name, see [[How OpenBat Decides What It Heard]].

## The two of them

**NABat ML** covers North America. It comes from the USGS North American Bat
Monitoring Program, the continental standard for acoustic monitoring. It knows
31 classes — North American species, plus an explicit NOISE class for things
that aren't bats. Licensed CC BY 4.0.

**BatDetect2** covers the United Kingdom. It comes from the University of
Edinburgh, knows 17 UK species, and is licensed CC BY-NC 4.0 — non-commercial.
It is still marked **beta** in the app.

Only one classifies at a time. The app suggests the right one from where you
are rather than switching silently.

## They are not interchangeable

They were trained on different recordings, expect different lengths of audio,
and know entirely different species. The app handles the mechanics — each model
is handed the window length it was trained on, 50 ms for NABat ML and 256 ms for
BatDetect2 — but the results carry the fingerprint of whichever one produced
them.

The difference that matters most to you is the score.

**Confidence is not comparable between the two.** BatDetect2 tends to produce
far more emphatic numbers, so 70% from one does not mean what 70% from the other
does. Each model has its own cut-off for putting a name on a call at all — 0.57
for NABat ML, 0.4 for BatDetect2 — precisely because the numbers sit on
different scales.

The practical consequence: **the model name is part of the result.** If you are
reporting an identification anywhere serious, say which model produced it.

## Why not one model for everywhere?

Because it doesn't exist, and building it would be a research programme rather
than an app feature.

A classifier can only recognise species it was trained on, and training needs a
large library of recordings verified by people who know what they are listening
to. Those libraries are assembled region by region, over years, by monitoring
programmes and research groups. Where that effort has gone in, there is a model.
Where it hasn't, there isn't.

The part that surprises people: **you can be somewhere with no model and still
get almost the whole app.** Detection doesn't need a classifier, and neither
does the spectrogram, the listening modes, recording, sessions or export. An
unidentified recording that a person later identifies is a genuinely useful
contribution.

## Why we don't train our own

We can't, and we shouldn't.

We can't because we don't have the verified recording library, and assembling
one takes research groups years.

We shouldn't because a model that exists only inside one app is a model nobody
can check, compare or improve. Using published models means anyone sceptical
about a result can go and read what the model was trained on and how it
performed.

## What "beta" means on BatDetect2

Not that the model is bad — it is published research and it is good work.

It means we haven't yet seen enough real-world use to know how it behaves in
ordinary hands, in ordinary places, with ordinary phones. A model can do well on
a curated test set and still surprise you in a hedge in the rain. NABat ML's
cut-off was checked against the reference pipeline it came from; BatDetect2's is
a documented starting point that nobody has tested against a labelled set of
noise yet, and its scoring differs enough that the NABat number can't just be
borrowed.

So the beta label is about our confidence in the integration, not a judgement on
the research. It comes off when we have seen enough to say something honest —
and if the answer turns out to be "it struggles with X", we will say that too.

## The licence decides more than you would think

One model was rejected for a reason unrelated to accuracy. BattyBirdNET is
capable, and it was considered, but its weights carry a *share-alike* term:
anything derived from them, including a converted phone-ready copy, would have
to be released under the same licence. BatDetect2's licence is the opposite
shape — non-commercial only, but no obligation to hand the derived model back.

That comes with a hard consequence. While the app ships a non-commercial model,
OpenBat cannot be sold, subscribed to, or carry in-app purchases of any kind.
The licence, not a business decision, is what keeps it free.

> [!note] If you know of a model
> If there is a published, open classifier for a region we don't cover, we would
> genuinely love to hear about it. It turns a whole region from "detector" into
> "detector plus identification" in one go.

Neither model knows anything about where you are standing. That is a separate
step, described in [[OpenBat Species Priors for Location Weighting]].
