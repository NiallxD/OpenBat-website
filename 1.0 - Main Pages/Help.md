---
title: Help
description: Getting started, listening modes, pulse settings and frequently asked questions.
permalink: /help/
publish: true
---

## Get started

1. **Plug in an ultrasonic USB microphone.** The built-in iPhone mic only hears up to about 24 kHz, and most bat calls happen well above that, so you need something like the [Griff Mini](https://www.pippyg.com/griff.html). Any USB ultrasonic mic that runs at 384 kHz should work fine, plugged in via a USB-C or Lightning adapter depending on your device.
2. **Open OpenBat and allow microphone and location access.** Location is used to tag your recordings, to suggest the right species model for your area, to look up which species occur near you, and — if you start a Session — to record that session's GPS track. It never leaves your phone except as an approximate position sent to GBIF for that species lookup; see the [Privacy Policy](/privacy-policy).
3. **Calibrate your microphone** when the app asks. It only takes a moment and it's what keeps the amplitude readings meaningful.
4. **Point the mic at the sky and wait.** Once the status indicator up top turns green, you're receiving audio. When a bat calls nearby you'll see a pulse land on the spectrogram.

Once you're up and running, the rest of this page covers what everything does.

## Listening to bats

Bat calls are ultrasonic, so you can't hear them directly. OpenBat gives you a few ways to bring them into human hearing range, all from the single mode button in the control bar at the bottom of the Detector screen. Tapping it cycles through:

- **Off**: no audio output, just detection and the spectrogram.
- **Heterodyne**: shifts a narrow band around a tunable frequency down into the audible range in real time, so you hear a "chirp" or "click" as each call passes through. Never stops listening, but it's a rough translation rather than a faithful one, more like a Geiger counter than a recording.
- **Slow replay**: captures a short window of audio around a detected call (1.5 seconds by default) and plays it back eight times slower, so a call that was too short and too high to make sense of turns into something you can actually hear the shape of. While a snippet is replaying, the mic isn't listening for the next one, so there's a brief window where a call could be missed — that trade is the whole point of the mode, and it's how dedicated time-expansion detectors have always worked. By default Heterodyne keeps running underneath so you never lose track of what's happening between snippets; you can set it to replay only, or heterodyne only, in the tuning panel.

A small pill above the spectrogram shows what Slow replay is doing at any moment: an ear when it's listening, a red dot while it's capturing a snippet, and a tortoise with a filling ring while it plays that snippet back. Tap the pill for a plain-language explanation.

> **Note:** When the sound of a bat is repeated by your phone, the microphone may pick that call up again and reproduce it. Wear earphones for best performance, or turn the volume down a bit.

Recordings can also be played back in full time expansion from the Playback screen after the fact, with nothing missed and nothing sped past, since the whole file already exists on disk by then.

## Detecting and capturing pulses

OpenBat's pulse detector watches the incoming audio and triggers automatically when it sees a call-shaped pulse, drawing it on screen and, if you've armed recording, saving it.

Open **Settings > Audio** to tune:

- **Trigger mode**: "Amplitude only" fires on any loud sound in the analysis band, handy for testing but easily set off by wind or handling noise. "Frequency + Amplitude" also requires the peak frequency to be above a minimum you set, which rejects most low-frequency noise.
- **Amplitude threshold**: how loud a signal needs to be, as a normalised 0 to 1 value, before it counts as a pulse.
- **Frequency gate**: sets the minimum peak frequency a pulse needs to hit, when you're in Frequency + Amplitude mode. 15 to 20 kHz is enough to reject wind and handling noise; push it up to 30 to 40 kHz to target common pipistrelle-range calls specifically.
- **Minimum duration** and **bridge gaps**: filter out very short blips and stitch together a call's internal gaps so one pass gives you one capture instead of a handful of fragments.
- **Hold-off**: a short cooldown after each trigger, by default 50 ms, so a single call's echoes don't set off several detections in a row.

**Triggered display mode** (the icon next to the spectrogram controls) compresses the view so only pulses are shown back to back with the silent gaps skipped, which makes scanning a long quiet session much faster.

### Recording

Arm the recorder to save triggered calls as WAV files automatically as you listen. When you start detecting, you'll be asked whether this is a **Session** (logs a GPS track and groups everything together, handy for a proper survey) or **Just Listening** (still tracks location, but recordings aren't grouped, they just land in a flat list). Either way, everything is saved on your phone and you can export or share any recording directly from the app.

## Species identification

Where OpenBat has an open-source model for your region, it can suggest a species for each pulse it detects, entirely on your device. No internet connection needed and nothing is sent anywhere for this to work.

- **NABat ML** covers North America.
- **BatDetect2** covers the United Kingdom, and is currently in **beta** while we test how well it holds up.

Every suggestion comes with a confidence level. Some species are acoustically very similar to close relatives, so when that's the case, OpenBat flags the result as part of a **species complex** rather than guessing at a single name. That way you're not given false confidence in a call that could genuinely be either one.

### Field guide

The built-in field guide covers species profiles: measurements, echolocation characteristics, distribution and conservation status. It's searchable and browsable by region, and it's community-contributed, so if you know your local bats, have a look at the [Contribute](/contribute/) page to see how to help expand it.

## Reviewing recordings

Every recording can be opened from the Playback screen for a proper look afterwards: a static spectrogram of the whole pass, full time expansion playback, and the same measurements you get live (peak frequency, bandwidth, duration and so on) but with time to actually study them.

## Contributing recordings to community science

iNaturalist is a global community science platform that lets members of the public contribute biological observations to a shared database that researchers can use. We actually use this same database, [gbif.org](https://www.gbif.org), to power the range maps in the field guide.

To get started, head out and record some bats, then pick your best recordings and export them from the Playback screen. Upload the spectrogram image and the WAV file to iNaturalist, and in time other experts will help ID the species where they can, which feeds straight back into the wider dataset.

> Note: we're working on a feature to make creating iNaturalist observations easier still, one that gives you everything you need to submit and makes sure it includes everything a potential ID'er would want to see.

## Troubleshooting

**The status indicator is red, or it says "no ultrasonic microphone detected"**
Check the USB connection to your microphone and adapter. Unplug and replug if needed, OpenBat detects the microphone through a route change and should pick it up within a second or two. If you're only using the built-in mic, this is expected, it can't hear ultrasound and you'll need a USB ultrasonic microphone.

**The sample rate shown looks lower than expected**
OpenBat displays the actual sample rate your microphone is delivering. If it's not what you expect for your device (should be 384 kHz), check the microphone itself is set to its native or maximum rate, and that no other app has claimed the audio session.

**No pulses are triggering even though I can see activity on the spectrogram**
Open Pulse Settings and check your amplitude threshold isn't set too high, and that the frequency gate (if you're using it) covers the range you're actually seeing activity in.

**I can't find my recordings**
Recordings are saved on-device and are visible in the Files app, under OpenBat's own folder. Recordings made as part of a session are kept together with their GPS track; everything else lands in the flat Recordings list.

## Still stuck?

Get in touch on the [Contact](/contact/) page, we're happy to help.
