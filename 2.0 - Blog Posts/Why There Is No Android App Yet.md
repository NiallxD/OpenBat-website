---
title: Why There Is No Android App Yet
description: It is not a judgement about Android users. It is one developer, two platforms, and the arithmetic of doing either one properly.
excerpt: It is not a judgement about Android or its users. It is one developer, two platforms, and the arithmetic of doing either one properly.
date: 2026-11-24
author: Niall Bell
tags:
  - dev-log
  - project
featured: false
publish: false
---

The most common message I get, by a comfortable margin, is some version of:
*"This looks great. Android?"*

Not yet. I want to explain why properly, because "we're focusing on iOS" is the
kind of non-answer that makes people assume they've been deprioritised on
purpose.

## The actual reason

I'm one person, building this around a full-time job, some voluntary
commitments, and a life. Real-time audio processing at 384 kHz, on-device
machine learning, a live spectrogram that doesn't drop frames — that's a
demanding app on the platform I know well.

Building the same thing again on a platform I don't know, at the same time,
wouldn't give you two good apps. It would give you two mediocre ones and a
maintainer with a haunted expression.

So the choice wasn't "iOS or Android". It was "one platform properly, or two
platforms badly".

## Why iOS specifically

Three practical reasons, none of them about which phone is better.

**It's what I know.** The fastest route to a working app was the toolchain
already in my head. On a volunteer project, developer familiarity is a real
resource.

**Hardware behaviour is more predictable.** Getting a USB audio device running at
384 kHz reliably, across a whole ecosystem of phones, is exactly the kind of
problem that eats months. A smaller range of devices means fewer variables.

**The early-adopter overlap.** The people most likely to buy an accessory
ultrasonic microphone and go and stand in a field with it skew, at least
currently, towards iPhone. That's not a value judgement, it's just where the
first users were likely to be — and getting a small number of users properly
served matters more at this stage than reaching everyone shallowly.

## What Android users lose, and what they don't

Here's the part I think is genuinely reassuring: **the hard part of bat
detecting is the microphone, not the app.**

If you've got an ultrasonic USB mic, you can be listening to bats on Android
tonight with other software. There are apps that do heterodyne and time
expansion, live spectrograms and triggered recording. They're not ours, they're
not open source, and we can't vouch for what they do with your data — check
their terms — but they work, and the [Help](/help/) page lists the ones we know
about along with a quick guide to tuning a heterodyne detector.

What you don't get from those is the OpenBat-specific stuff: the field guide,
the on-device identification, the session structure and the export pipeline.
That's the gap, and I'm not going to pretend it's nothing.

Almost everything else on this blog travels fine, though. Where to stand, when
to go out, how to read a spectrogram, what a feeding buzz looks like, how to
contribute a recording to iNaturalist — none of that cares what's in your
pocket.

## No mid-funnel wall

One decision I'm quietly pleased with: because OpenBat is a single combined app
rather than a free app with paid add-ons, there's no situation where someone
downloads it, gets invested, and *then* hits a wall.

If you're on Android, you find out immediately, on the website, before you've
spent anything or committed to anything. That's a smaller reach and a cleaner
deal. I'd rather turn someone away honestly at the door than disappoint them
halfway in.

## Would it happen?

Realistically it needs one of:

- **An Android developer who wants to take it on.** The models are open, the
  field guide data is open and licensed for reuse, the formats are standard.
  Someone building an Android client isn't starting from nothing.
- **Enough demand to justify learning the platform**, which means time I'd have
  to take from somewhere else.
- **Funding**, which changes the arithmetic entirely and which we don't have.

If you'd like to see it, [tell us](/contact/). Not as a formality — the count
genuinely informs where effort goes, and right now the honest answer is that
more people ask about it than I expected.

> [!note] The uncomfortable trade
> Every hour spent on a second platform is an hour not spent on the field guide,
> the export pipeline, or the identification models. Those three serve everyone,
> including the Android users who don't have an app yet. Given a fixed number of
> hours, I think shared infrastructure wins — but I hold that view loosely, and
> it's the kind of decision worth arguing about in public.

Niall & the OpenBat Team 🙂
