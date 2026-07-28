---
title: Help
description: Setup, troubleshooting and frequently asked questions.
permalink: /help/
publish: true
---

## Getting started

### What you need

OpenBat will work with the built-in microphone on your iPhone, but that only hears up to about 24 kHz and most bat calls happen well above that. To actually detect bats, you need an ultrasonic USB microphone, such as the [Griff Mini](https://www.pippyg.com/griff.html), plugged into your iPhone.

1. Plug your ultrasonic USB microphone into your iPhone (using a USB-C or Lightning adapter, depending on your device). Any USB ultrasonic mic which runs at 384 kHz should work just fine.
2. Open OpenBat. The status indicator at the top of the screen turns green once the microphone is detected, and the app shows the sample rate it's receiving (e.g. "384 kHz, capturing ultrasound up to 192 kHz").
3. Point the microphone at the sky and wait. When a bat calls nearby, you'll see a pulse appear on the spectrogram.

> No microphone plugged in? OpenBat still runs on the built-in mic so you can explore the interface, but it won't pick up bat echolocation calls.

### Listening to bats

Bat calls are ultrasonic, so you can't hear them directly. OpenBat gives you two ways to bring them into human hearing range using the mode button in the control bar:

- **Heterodyne**: shifts a narrow band around a tunable frequency down into the audible range in real time, so you hear a "chirp" or "click" as each call passes through. Never stops listening, but doesn't represent the true character of a call.
- **Time expansion**: slows detected calls down 8× so they land in both audible range and audible duration, turning a call too short and too high to make sense of into a few hundred milliseconds you can actually hear the shape of. The trade-off: while a stretched call is playing back, the microphone isn't listening, so calls arriving in that window are missed. A pill above the stats shows how many calls have been stretched and, in red once it's non-zero, how many were missed — tap it for a plain-language explanation.

Switch between Off, Heterodyne and Time Expansion with the mode button.

> **Note:** When the sound of a bat is repeated by your phone, the microphone may pick that call up again and reproduce it again. Wear earphones for best performance or dial the volume down a bit.

> **Note on time expansion:** Wildlife Acoustics holds a patent covering one particular way of doing real-time time expansion — continuously capturing while selectively discarding samples to keep up with playback. OpenBat's implementation is deliberately different: it captures every sample of a detected call without ever discarding any of it, and it stops listening entirely while a call plays back rather than capturing behind the scenes. That's a real trade-off (see above), not a technicality — it's the same trade classic tape-based bat detectors always made.

Recordings can also be replayed in full time expansion from the Playback screen after the fact, with nothing missed, since the whole file already exists on disk.

## Detecting and capturing pulses

OpenBat's pulse detector watches the incoming audio and triggers automatically when it sees a call-shaped pulse, drawing it on screen and (if you've armed recording) saving it.

In **Pulse Settings** you can tune:

- **Trigger mode**: how the detector decides a pulse is happening.
- **Amplitude threshold**: how loud a signal needs to be to count as a pulse.
- **Frequency gate**: restrict triggering to a chosen ultrasonic frequency range, to ignore non-bat noise.
- **Minimum pulse duration** and **gap bridging**: filter out very short blips and stitch together pulses with brief internal gaps.
- **Hold-off**: a short cooldown after each trigger, to stop a single call's echoes from triggering multiple times.

**Triggered display mode** compresses the spectrogram so only pulses are shown back-to-back, with silent gaps skipped, handy for scanning a long quiet session quickly.

### Recording

Arm the recorder to save triggered calls as WAV files automatically as you listen. Recordings are saved on your phone and organised as either:

- **Sessions**: a survey with a GPS track and any species IDs, if you want to log where and when you were out; or
- **Listening**: casual recordings without session tracking, grouped by day.

You can export or share any recording directly from the app.

## Species identification

Where OpenBat has an open-source model for your region, it can suggest a species for each pulse it detects, entirely on your device, no internet connection needed and nothing is sent anywhere for this to work.

- **NABat ML** covers North America.
- **BatDetect2** covers the United Kingdom, and is currently in **beta** while we test how well it works.

Every suggestion comes with a confidence level. Some species are acoustically very similar to close relatives. When that happens, OpenBat flags the result as part of a **species complex** rather than guessing at a single name, so you're not given false confidence in a call that genuinely could be either.

### Field guide

The built-in field guide covers species profiles: measurements, echolocation characteristics, distribution and conservation status. It's searchable and browsable by region. It's community-contributed; see the [Contribute](/contribute/) page if you'd like to help expand it.

## Contributing recordings to community science

iNaturalist is a global community science platform which allows members of the public to contribute biological observations to a global database of observations which can be used by researchers. In fact, we use this exact database [gbif.org](https://www.gbif.org) in OpenBat to power our range maps found in the Bat Field Guide!

To get started, head out and record some bats. Then select high quality recordings and export them via the Playback section in the app. Then upload the spectrogram image and .wav file to iNaturalist. In time, experts will help ID the species recorded where possible, which contributes to the dataset.

> Note: We are working on a feature to make creating iNaturalist observations easier than ever! Our tool will give you everything you need to submit to iNaturalist, and ensures it includes everything a potential ID'er will need to make an ID.

## Troubleshooting

**The status indicator is red / "no ultrasonic microphone detected"**
Check the USB connection to your microphone and adapter. Unplug and replug if needed — OpenBat detects the microphone through a route change and should pick it up within a second or two. If you're only using the built-in mic, this is expected — it can't hear ultrasound. You will need to use a USB ultrasonic microphone.

**The sample rate shown looks lower than expected**
OpenBat displays the actual sample rate your microphone is delivering. If it's not what you expect for your device (should be 384 khz), check the microphone itself is set to its native/maximum rate, and that no other app has claimed the audio session.

**No pulses are triggering even though I can see activity on the spectrogram**
Open Pulse Settings and check your amplitude threshold isn't set too high, and that the frequency gate (if enabled) covers the range you're seeing activity in.

**I can't find my recordings**
Recordings are saved on-device and are visible in the Files app, under OpenBat's own folder. Casual recordings are grouped by day under "Listening"; recordings made as part of a session are kept together with their GPS track.

## Still stuck?

Get in touch on the [Contact](/contact/) page — we're happy to help.
