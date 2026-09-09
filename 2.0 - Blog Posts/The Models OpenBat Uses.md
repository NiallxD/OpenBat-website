---
title: The Models OpenBat Uses
description: OpenBat doesn't have "an AI" — it ships two published classifiers, NABat ML for North America and BatDetect2 for the UK, and only one runs at a time. What each is, how they differ, and why their numbers can't be compared.
excerpt: OpenBat ships two published classifiers rather than one of its own — NABat ML for North America, BatDetect2 for the UK. Only one runs at a time, and their confidence figures mean different things.
date: 2026-09-05
author: Niall Bell
tags:
  - auto-id
  - classifier
  - machine-learning
heroImage: /static/images/orange-sunset.webp
coverImage: /static/images/orange-sunset.webp
featured: false
publish: true
---

OpenBat doesn't have "an AI". It does however include two, separate, published models built by other people. The model you use depends on where you are.

This is the short version or how these model outputs are actually turned into an ID suggestion. For the details, checkout [[How OpenBat Decides What It Heard]].

## The current models

OpenBat currently includes two models, and has been built to allow new models to be added over time:

**NABat ML** covers North America. It was developed by researchers at the USGS North American Bat Monitoring Program and is the continental standard for acoustic bat monitoring. It has been trained to identify 30 North American/Canadian bat species, plus an explicit NOISE class for things that aren't bats. Licensed CC BY 4.0.

**BatDetect2** covers the United Kingdom. It comes from the University of Edinburgh, knows 17 UK species, and is licensed CC BY-NC 4.0 — non-commercial. It is still marked **beta** in the app.

Only one model runs at a time and the app suggests the best option for your current location.

## They are not interchangeable

The models were trained on different recordings, expect different lengths of audio,
and know entirely different species. Each model works in it’s own way, accepts different ‘shaped’ audio, and produces their own scores, independently of other model methodology.

Something to keep in mind on the scores:

**Confidence is not comparable between the two.** BatDetect2 tends to produce
far higher confidence numbers, so 70% from BatDectect2 and 70% from NABat ML does not mean the same thing. Each model has its own cut-off for whether to offer an ID on a call: 57% for NABat ML, 40% for BatDetect2. The difference here reflected the ‘character’ of each model.

The practical consequence: **the model name is part of the result.** If you are
reporting an identification anywhere serious, say which model produced it.

## Why not one model for everywhere?

Because it doesn't exist, and building it would be a research programme rather than an app feature.

A classifier, the proper term for a model which classifies inputs, can only recognise species it was trained on, and training needs a large library of recordings verified by people who know what they are listening to. Those libraries are created over time, one region at a time, and reflect the activity of machine learning experts and researcher.

It’s worth noting here that, while OpenBat only currently supports North America and the UK, the app can still be used elsewhere. OpenBat is a bat detector and field guide app first, with autoID and community science as additional features. You can download the app, learn about bats, and listen to them in real time (if you have a compatible microphone).

## What "beta" means on BatDetect2

Not that the model is bad, it is published research and performs well.

The beta tag is ours, and we have it there because we have not yet tested how it behaves in the real world alongside our app. We are based in North America and until we distribute the app in the UK, we can’t get the data we need to assess how well the pieces (our app and the BatDetect2 Model) work together.

So the beta label is about our confidence in the integration, not a judgement on the research. Once we have had time to test and collect data, we will assess how well it fits the app, and we can amend things from there.

> [!note] If you know of a model
> If there is a published, open classifier for a region we don't cover, we would
> genuinely love to hear about it. It turns a whole region from "detector" into
> "detector plus identification" in one go.

## Location is key

These models are trained to classify species in a given region, and as we know, not all species are found in all parts of that region. This is a real weakness of using classifiers to identify species with geographic nuance. It’s the same for birds too! 

Neither model knows anything about where you are standing. That is a separate
step, described in [[How OpenBat Weighs Scores By Location]]. In short, we use a range map generated from community science data to understand where a species has been seen before. We then use this to filter out those species from the model outputs in real time so that you only see suggestions of identification for species knowing to be present where you currently are. There is some nuance to this, so check the linked article for more details.
