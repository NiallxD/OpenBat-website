---
title: "OpenBat 0.9.7: Listening, Without the Howl"
description: OpenBat 0.9.7 rebuilds live listening after a night in the field, lets defaults be corrected without an update, and makes the percentage on an ID mean one thing.
excerpt: A night in the field where nothing was loud enough, and a finger snap that set the phone howling. 0.9.7 is mostly about what you hear.
date: 2026-09-10
author: Niall Bell
tags:
  - openbat
  - app
  - dev-log
  - release
coverImage: /static/images/id_numbers.webp
featured: false
inApp: false
type: release
publish: true
---

Most of 0.9.7 is about **listening**, meaning what comes out of the speaker
while you detect. It came out of a night on real bats where neither channel was
loud enough with the phone turned all the way up, and then a finger snap that
set the whole thing howling.

## Why it howled

Once the output was louder, a sharp sound near the phone could start a runaway:
what left the speaker came back in through the microphone, louder each time,
until it drowned out everything else. It turned out to be two loops, not one.

The one you could hear came from clipping. A maxed-out output clipped into
harmonics above 15 kHz, the band filter let them straight back in, and the gate
that should have shut kept renewing itself. The quieter loop mattered more,
and it never needed an ultrasonic frequency at all. With the advanced view's
band starting at 3.8 kHz, the auto-tuner could decide the phone's own output
was the loudest thing around and tune itself onto it.

The fixes:

- **Listening never goes below 15 kHz**, whatever the display band says. No bat
  is down there, and the phone's own output is. The spectrogram still shows
  whatever you ask for; this only changes what you hear.
- **The sound comes out of the bottom speaker.** It had been coming out of the
  earpiece, about two centimetres from where the mic is held, which is the
  loudest path the phone has back into its own ears.
- **A howl guard.** When the output stays loud for longer than a bat pass does,
  the app turns itself down. Afterwards it holds the level a little below where
  the runaway started, so it settles instead of pumping. The output is also
  filtered so the microphone can no longer hear it.
- **A warning above about half volume**, once a session. Feedback doesn't only
  reach your ear; it ends up in the saved recording, underneath the calls.

Recordings aren't affected by any of this. They're still the full band,
exactly as the microphone delivered it.

## Louder, and simpler

With the loop broken, the volume could go up safely:

- Both channels now start as loud as the app can go, and **the phone's own
  buttons are the volume control**.
- The two volume sliders are now **one Mixer**. In the middle both channels are
  at full; slide it towards the tortoise or the antenna to put that channel on
  top by up to 24 dB. The sliders could only ever set the balance, so it's now
  one control.
- Live listening is **one card in Settings**, with both channels behind a
  two-way switch. When you hear both at once, setting one against the other is
  a single decision.
- **Slow replay is now called time expansion**, which is what it always was
  and what everyone else calls it.
- The live channel has no **High** background reduction. On a replay, silencing
  everything that isn't plainly a call is useful. Live, it would make a missed
  bat and a quiet night sound the same.
- **Demo mode goes through the same audio path as the microphone**, so levels
  you judge against the demo are the levels you'll get in the field.
- **Hold the phone to your ear** and the sound moves to the earpiece at half
  level with the screen dark, like you're on a phone call with a bat...bat phone mode!

## Defaults that can be corrected without an update

We spent a week arguing about numbers like these by ear, and every one of them
was compiled into the app, so trying a different value meant another App Store
review. Now some of them can be set remotely, from the same config file as the
kill switches from [[OpenBat 0.9.6: Three Times the Calls, and a Way to iNaturalist|0.9.6]].

This needed more care than the switches. The worst a bad switch can do is
remove a feature. A bad *number* removes nothing: it makes the app quietly deaf
while it still looks like it works. So:

- Only listed parameters can be changed, and each one has an allowed range.
- A value outside its range is **ignored rather than clamped**, so a typo fails
  visibly instead of half-applying in the field.
- **A value you've set yourself is never touched.** Only the ones still at
  their defaults change.
- **Nothing about how species are identified can be changed this way.** That
  still takes an app update.
- New values apply when the app launches, never during a session.

Getting this right turned up a plain bug. Three places in the app were quietly
saving values nobody had chosen, which froze those settings on every install.
The recording timings weren't being saved at all, so they reset every time you
reopened the app. Both are fixed. Settings now also shows when the app last
checked for new values, because a correction that never arrived looks exactly
like no correction.

## The percentage means one thing now

The percentage on an identification now shows one thing: **the model's track
record for that species**, meaning how often it's right when it names that
bat. Where a species has no measured track record, you get an ⓘ that explains
why, rather than a different number quietly shown in the same spot. In
simplified view, the ⓘ shows what the call scored and what came second.
[[On Model Confidence Percentages]] covers why those are different questions.

AutoID also only lists models that work where you are. Listing every model
read as a choice between them, but your location decides the model.

## Three more bats

The field guide adds **Andersen's fruit-eating bat**, the **Ecuadorean tailless
bat** and the **Amazonian sac-winged bat**. The first two come with range maps.
There are too few records for the third to draw a range, so the app doesn't
say anywhere is outside its range; it doesn't treat it as absent.

## Fixed

A long list, collected by going through the whole app for bugs in one day. The
ones worth knowing about:

- **A phone call no longer stops your recording.** Any interruption (a call,
  Siri, another app taking the mic) quietly switched recording off. Listening
  came back afterwards and looked normal, but nothing was being saved.
- **Replays are calls, not clatter.** The check meant to throw out windows
  with no call in them was measuring a background that had already been
  silenced, so keys and footsteps got replayed at full volume.
- **Session exports don't fill your phone.** Every exported zip stayed on the
  device, out of sight, often hundreds of megabytes each.
- **Listening works on microphones that aren't 384 kHz.** Anything else gave
  continuous crackle.
- **Calibration is only applied at the sample rate it was measured at.**
- **Tapping a bat in "Bats Near You" no longer crashes the app.**
- **Onboarding checks whether your microphone is connected**, rather than
  warning in general terms. A detector with no mic stays silent, and that's
  easy to mistake for a broken app.
- **Species photos come back after a bad connection.** One offline visit to the
  guide used to mark those species as having no photo, permanently.

The full list is in What's New in the app.
