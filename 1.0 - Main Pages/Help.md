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

- **Heterodyne**: shifts a narrow band around a tunable frequency down into the audible range in real time, so you hear a "chirp" or "click" as each call passes through. Good for scanning while you're out in the field but doesn't represent the character of bat calls.
- **Frequency Division:** takes the input audio stream and divides the frequencies by a factor (in our case 10) and plays that sound. This brings ultrasonic into the audible range.

Switch between Off, Heterodyne and Frequency Division with the mode button.

> **Note:** When the sound of a bat is repeated by your phone, the microphone may pick that call up again and reproduce it again. Wear earphones for best performance or dial the volume down a bit.

> **Note:** Another technique is time expansion. Wildlife Acoustics pioneered a technology they call "Real Time Expansion" for which they received a patent. For this reason we do not include and form of time expansion which operates on real-time principles.

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

## Contributing recordings

With OpenBat, you can optionally help build an open reference library of bat calls, but **nothing is ever uploaded automatically**. If you choose to contribute:

1. Turn on contribution from Settings, or when prompted after a recording.
2. From the playback screen, tap the upload icon on the specific recording you want to send.
3. Your phone builds a stripped, anonymised copy of that recording, with location rounded to roughly 100 m, time rounded to the nearest 5 minutes, human speech filtered out, and no identifying information at all, and sends only that copy.

You can turn contribution off at any time in Settings, and you can permanently erase your consent record (and get a fresh, disconnected device identifier) with **Erase My Consent Record**. Because contributed recordings carry no identifier, we can't trace one back to a device — see our [Privacy](/privacy/) page for the full explanation, including why that means we can't delete an individual contribution after the fact.

## Troubleshooting

**The status indicator is red / "no ultrasonic microphone detected"**
Check the USB connection to your microphone and adapter. Unplug and replug if needed — OpenBat detects the microphone through a route change and should pick it up within a second or two. If you're only using the built-in mic, this is expected — it can't hear ultrasound. You will need to use a USB ultrasonic microphone.

**The sample rate shown looks lower than expected**
OpenBat displays the actual sample rate your microphone is delivering. If it's not what you expect for your device, check the microphone itself is set to its native/maximum rate, and that no other app has claimed the audio session.

**No pulses are triggering even though I can see activity on the spectrogram**
Open Pulse Settings and check your amplitude threshold isn't set too high, and that the frequency gate (if enabled) covers the range you're seeing activity in.

**I can't find my recordings**
Recordings are saved on-device and are visible in the Files app, under OpenBat's own folder. Casual recordings are grouped by day under "Listening"; recordings made as part of a session are kept together with their GPS track.

## Still stuck?

Get in touch on the [Contact](/contact/) page — we're happy to help.
