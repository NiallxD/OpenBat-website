---
title: "OpenBat 0.9.8: A Blog on the Globe"
description: OpenBat 0.9.8 brings the blog into the field guide, lets you see the classifier's own working on any recording, and stops long calls being cut short.
excerpt: Two items off the roadmap, a way to see exactly what the priors did to an ID, and a 58 ms horseshoe call that was being cut to 17.
date: 2026-09-22
author: Niall Bell
tags:
  - openbat
  - app
  - dev-log
  - release
coverImage: /static/images/screen-globe.webp
featured: false
inApp: false
type: release
publish: true
---

0.9.8 ticks two things off the [[OpenBat Roadmap]] and adds a new way to see
how an identification was made. It also fixes a bug where a display setting
was quietly limiting what got measured.

## The blog, in the field guide

Posts from this blog can now be read in the app, from a list in the field
guide, and are **pinned to the places they're about on the guide's globe**.
The globe has a new dial that switches it between showing where species live
and where posts are about, so one globe answers both questions.

That was "Blog Posts" on the roadmap, with a start on "Featured Places &
Stories": a post with a location becomes a pin. There's more to do there, but
the plumbing is in.

## Favourite recordings

A star in the recording player's spectrogram header marks a recording as a
favourite, and Demo Mode's "Your Recordings" now shows only your favourites.
It used to list every recording, so after a season of fieldwork, finding the
clip you wanted to show someone meant one long scroll. That's the
"Favouriting Recordings" roadmap item, at least in its first form.

## Classifier Analysis

This one is for anyone who wants to know *why* the app named a bat. A new mode
on the Recordings heading opens a recording through the classifier's own
working instead of the player. Every call is re-run through the same model,
using the priors stamped on that session. You see the raw score beside the
weighted one, and the calls where the location weighting changed the answer
are marked.

It's a re-run rather than a replay because the stored data can't answer this
question. Raw scores are never saved, and pulse pictures are only drawn every
couple of seconds. Away from the live microphone there's no time pressure, so
the app can simply do the work again: the same file, the same model and the
same priors give the same result, and nothing is cached.

If you've read [[How OpenBat Weighs Scores By Location]], this is that
weighting, applied to your own recordings and shown call by call.

## Long calls, no longer cut short

A greater horseshoe call runs about 58 ms. The pulse view was cutting it to
about 17 ms, and the reason wasn't obvious: both the capture length and the
measured envelope came from the *display window slider*. A display preference
was capping what got measured. The capture length now comes from the model's
own input region.

With that fixed, the same call measured 38 ms against a real length of about
52. This time the cause was a threshold. The pulse view stopped measuring 12 dB
below the peak and the player stopped at 22, so the same call gave two
different lengths on two screens. Both now use the same value.

## The pulse list is names, not gaps

The pulse list used to try to show a picture for every call. But a pass only
draws one picture every couple of seconds. Drawing is the slowest job on the
capture queue, and every picture drawn delays catching the next call, which is
the lesson from
[[OpenBat 0.9.6: Three Times the Calls, and a Way to iNaturalist|0.9.6]]. So
the list was mostly gaps with a note explaining each one.

Now each row shows what the call was named and what it nearly was, numbered
("MYLU Pulse 3"). The screen also stays on the pass you tapped. It used to
drift to whatever was being identified at that moment, so a detail screen could
quietly become a different pass while you were reading it.

## Fixed

- **Opening a recording mid-session no longer crashes.** Playback and live
  capture both want the audio system, and opening the player during a session
  crashed the app. A recording row now offers to end the session first.
