---
title: "OpenBat 0.9.6: Three Times the Calls, and a Way to iNaturalist"
description: OpenBat 0.9.6 hears about three times as many calls, stops guessing between two bats, and can post a recording straight to iNaturalist.
excerpt: The detector was quietly throwing most calls away, and the fastest-calling bats worst of all. 0.9.6 fixes that, and adds posting to iNaturalist.
date: 2026-09-08
author: Niall Bell
tags:
  - openbat
  - app
  - dev-log
  - release
coverImage: /static/images/detection-cover.webp
featured: false
inApp: false
type: release
publish: true
---

0.9.6 has two headline changes. The detector now hears about three times as
many calls as it used to, and a recording can go straight to iNaturalist
without leaving the app. The first one matters more, and it started with three
devices that disagreed.

## Three devices, one recording, three answers

I played the same demo recording on three devices, and they didn't agree on
which bat it was. At first that looked like a classifier problem. It wasn't.
None of the disagreement came from the model.

To prove it I needed a fair comparison, and the demo is the only input two
phones can be given identically. So there's now a **demo log** (tucked away
in the configuration menu, off by default). It writes a CSV for every demo run:
every pulse the detector kept, every pulse it dropped and why, and every pass,
with the device, the OS, the model and every threshold in the header. Two files
whose headers differ in one line and whose rows differ everywhere don't leave
much to argue about.

The logs showed a detector that was dropping calls.

## The detector was throwing calls away

Drawing a call's picture and running the model on it happened on the same
queue as catching the *next* call. The detector couldn't reopen until the model
had finished, and any call that arrived in that window was silently discarded.
It was counted in the rate readout and then vanished from everything
downstream.

The losses weren't spread evenly, either. They fell hardest on **whichever bat
called fastest**, so the species calling most were the ones heard least. On the
demo clip, the 2020 iPad scored zero big brown bats in seven loops, because
every one of their calls landed inside that gap.

Two further things made it worse:

- After each call the app waited for trailing audio, and it waited as long as
  the *slowest* model needed, whichever model was actually running. That wait
  went from 184 ms to 40 ms.
- It drew a detailed picture of every call, even though almost nobody would
  ever look at most of them. Now it only draws one when the pulse view is going
  to show it, at half the column density, which looks the same to the eye.

With classification moved to its own queue, the oldest device went from 1.35
to 3.97 pulses a second. The share of calls discarded dropped from **68% to
9%**. The 2020 iPad now files slightly more than the 2022 iPhone.

## One pass, one bat

A pass used to run until things had been quiet for a couple of seconds. On a
busy night that meant several bats averaged into one entry, named after
whichever had been sampled best. That name could change between builds even
though the audio never did.

Now a pass closes after about a second of quiet, so each bat gets its own
entry. When the top two species are within 0.10 of each other, **OpenBat
doesn't name the pass at all**. Two bats calling at once is an unanswered
question, not a weak answer. The calls and their measurements are still kept;
only the verdict is held back. After the change, the worst margin across a run
went from 0.004 to 0.161, and the devices now report the same species in the
same places.

(If the gates behind that decision are new to you,
[[How OpenBat Decides What It Heard]] walks through the whole chain.)

## The long, low bats were invisible

Hoary and silver-haired bats were almost never drawn in the pulse view, for
two separate reasons:

1. The view hid anything that scored low on a "quality" measure. That measure
   averaged the whole search window, *including the call itself*, so a longer
   call dragged its own score down. The slow, low species make the longest
   calls, so they sat under the bar.
2. The view was a fixed window with only 7 ms to the right of the call's start,
   so the long calls it did show were cut in half.

Quality is now measured against the background, and the view widens to fit
the call.

## Posting to iNaturalist

A recording can now become an iNaturalist observation from inside the app.
Sign in and OpenBat posts it for you, or it hands you the files to upload
yourself. A leaf on a recording's row marks the ones worth posting, and it
turns gold for the best recording of a night. Posting runs in the background
with a pill over the tab bar, so you don't have to watch a spinner while a
15 MB file uploads.

Most of the work went into making the observation something an identifier can
trust:

- **One clip for sound and pictures.** An identifier told me the audio on an
  observation didn't match its spectrogram. The sound had been cut from the
  recording while the pictures were drawn from the whole file, so they didn't
  share a starting point. Everything now comes from one clip.
- **The full-spectrum sound, and only that.** There was a slowed-down listening
  copy as well. I dropped it. No browser will play 384 kHz audio, so a visitor
  who presses play gets nothing, and that is a real cost. But a processed file
  sitting on a permanent public record, as the thing most people actually hear,
  seemed worse.
- **Real axes on every picture.** Frequency on a log scale, time labelled, and
  a caption saying whether silence was cut out. Log is always used here,
  whatever the player is set to, because on a linear axis a 45 kHz pipistrelle
  and a 25 kHz noctule are drawn at different sizes for the same shape of call.
- **The right microphone.** It was posting whichever detector is selected
  *now*. It now reads the one written into the recording when it was made.
- **"AutoID" on the caption.** A species name burned into a spectrogram reads
  as a determination once the image travels on its own. Two words make it a
  suggestion again.
- **Echoes count against a recording.** A call recorded somewhere reverberant
  loses up to 10 points and says why. Those thresholds are reasoned rather than
  measured, and that's written down as an open question.

Also, sharing no longer asks for access to your photo library. Nothing OpenBat
exports needs that permission.

## Switches I can throw from here

If something goes wrong with identification, range maps, location weighting or
posting, I can now switch it off remotely and tell you why, instead of leaving it
broken until Apple approves the next build. Every feature is compiled *on*, and
the remote file can only turn one *off*. The version Apple reviewed is the most
the app can ever do.

Each feature also has a sensible off state. With identification off,
recordings are still made and marked as unidentified. They aren't filed as
"no ID", which would have put them one tap away from "Delete NoID
Recordings". The notice stays in Settings for as long as it applies.

That's 0.9.6. Most of it came from asking why two devices disagreed, and not
accepting "the model" as the answer.
