---
title: Setting Up for the First Time
description: Plug in, grant two permissions, calibrate, point at the sky. The whole setup takes three screens, and here is what each one is for.
excerpt: Plug in, grant two permissions, calibrate, point at the sky. Setup takes three screens — here is what each one is actually doing, and why.
date: 2026-12-11
author: Niall Bell
tags:
  - how-to
featured: false
publish: false
---

Setting OpenBat up takes about two minutes. This post takes longer to read than
the setup does, which is a slightly odd thing to write, but the *why* behind
each step is worth knowing — especially the permission it asks for that people
are rightly cautious about.

## 1. Plug in the microphone

Your phone's own microphone cannot hear bats. It's built for speech, and its
audio path physically cannot represent the frequencies you're after.

So you need an ultrasonic USB microphone and the right adapter for your phone.
Plug it in, and OpenBat should pick it up within a second or two — it watches
for the audio route changing.

Check two things on screen:

- **The status indicator is green.** Red, or "no ultrasonic microphone
  detected", almost always means the physical connection. Unplug, replug.
- **The sample rate says what you expect** — usually 384 kHz. If it's lower,
  either the mic is set below its maximum or something else has claimed the
  audio session.

Do this indoors in daylight the first time. Debugging a dongle in a dark field
is nobody's idea of an evening.

## 2. Allow the microphone. And, yes, location

Microphone is obvious. Location gets a raised eyebrow, and it deserves an
explanation rather than a shrug.

Location is used for five things, all of them on the device:

1. **Tagging recordings**, so a record has a place attached — which is what
   makes it useful to anyone later.
2. **Choosing the right identification model** for your region.
3. **Working out which species are plausible where you are**, which reranks
   identification results.
4. **Naming each session** after where it happened, so your list isn't forty
   entries called "Session".
5. **Calculating your local sunset and sunrise**, which is what drives the
   "when to go out" indicator.

None of it leaves your phone. There's no background tracking and no GPS trail —
the app isn't following you around, it's asking "where am I?" when it needs to
know, and using the answer locally. The [privacy page](/privacy/) says the same
thing in more formal language, and it's worth reading rather than taking my word
for it.

## 3. Calibrate

The app offers to calibrate the first time you plug a particular microphone in.
It takes a moment and it's worth doing.

Calibration is what makes the loudness readings *mean* something. Without it,
"−43 dBFS" is a number relative to nothing in particular; with it, the amplitude
scale is anchored to your specific microphone, so the detection thresholds
behave predictably and the numbers are comparable between sessions.

You can skip it and do it later from Settings. Do it later, though — don't just
never do it.

## 4. Choose simplified or advanced

You'll be asked which view you'd like. Both are good answers.

**Simplified** shows a running list of species identified, the input level, and
the spectrogram. That's most of what a first night needs and it stays readable
when you're outside in the dark and slightly cold.

**Advanced** adds the measurements for each call, a zoomable close-up of the
pulse, timeline and palette controls, and the ability to drag back through the
last minute of history.

Switching costs nothing and keeps your settings, so start simplified. Turn
advanced on when you catch yourself wanting a number you can't see — that's the
right moment, and it usually arrives on the second or third night.

## 5. Go and point it at the sky

Up and out, not down. Wait for green. Then wait some more, because the first bat
of the evening always takes longer to arrive than you expect.

When one comes over, you'll get pulses on the spectrogram, a click or chirp in
your ears if you've got a listening mode on, and — where a model covers your
region — a species suggestion with a confidence attached.

That's setup done. Everything after this is learning to read what you're seeing,
and there's a whole blog about it.

> [!tip] Three screens, then two tours
> Onboarding itself is short — a welcome, the permissions ask, and a caveat about
> how far to trust an identification. Everything that used to sit alongside those
> moved out to the **Info & Tour** screen, as two tours you can take when you
> actually want them. The guided one dims the screen and points at one control at
> a time on your own detector, with your own audio running; **About OpenBat** is
> the reading version — what echolocation is, what the listening modes do, why
> calibration matters. Both are more use on your second night than your first,
> once you've got something to attach them to.

Niall & the OpenBat Team 🙂
