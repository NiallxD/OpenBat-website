---
title: Help
description: Getting started, listening modes, pulse settings and frequently asked questions.
permalink: /help/
publish: true
---

## Get started

1. **Plug in an ultrasonic USB microphone.** The built-in iPhone mic only hears up to about 24 kHz, and most bat calls happen well above that, so you need something like the [Griff Mini](https://www.pippyg.com/griff.html). Any USB ultrasonic mic that runs at 384 kHz should work fine, plugged in via a USB-C or Lightning adapter depending on your device.
2. **Open OpenBat and allow microphone and location access.** Location is used to tag your recordings, to suggest the right species model for your area, to work out which species are plausible where you are, to name each session after the place it happened, and to work out your local sunset and sunrise times. It never leaves your phone, and OpenBat doesn't record a GPS track or use location in the background; see the [Privacy Policy](/privacy-policy).
3. **Calibrate your microphone** when the app offers to, which is the first time you plug that microphone in. It only takes a moment and it's what keeps the amplitude readings meaningful. You can skip it and do it later from Settings.
4. **Point the mic at the sky and wait.** Once the status indicator up top turns green, you're receiving audio. When a bat calls nearby you'll see a pulse land on the spectrogram.

Setting the app up takes three screens and asks for nothing but the microphone and location permissions.

## Finding your way around

Two tours are waiting on the **Info & Tour** screen, and neither is a video — both live inside the app.

- **The guided tour** dims the screen and points at one control at a time, on your own detector, with your own audio running. It's also offered by the sparkles button at the top of the Detector screen, which appears for a moment shortly after your first run and then stays there until you've been through the tour.
- **About OpenBat** is the reading tour: what echolocation is, what each listening mode does to the sound, and why calibrating the microphone matters. It's the same material the app used to walk you through before you'd even plugged anything in, which turned out to be the wrong moment for it.

Once you're up and running, the rest of this page covers what everything does.

## When to go out

Bats are busiest in the few hours **after sunset** and again in the hours **before sunrise**, so timing matters more than almost anything else you can control. The top-left of the detector screen tells you where in that night you are:

| It shows | It means |
|---|---|
| 🌇 at 20:24 | Still daylight — sunset is at 20:24. |
| 🌇 +1h 45m | Sunset was an hour and three-quarters ago, and you're still inside the evening window. This is prime time. |
| 🌅 at 05:12 | The quiet middle of the night. Sunrise is at 05:12. |
| 🌅 in 1h 45m | The dawn window has started — sunrise is an hour and three-quarters away. |

The sun icon is filled in while you're inside an active window and hollow outside one, so a glance tells you which.

Each window is the first and last **15% of that night**, rather than a fixed number of hours, so it moves with the season along with everything else: around an hour and three-quarters each side at the equinoxes, closer to an hour at midsummer when the whole night is only seven hours long.

**Tap the pill** for tonight's sunset and sunrise times, how long each window lasts tonight, and a reminder of why those hours are the ones to be out in. It's worked out on your phone from your latitude and the date, so it's right whether or not you have signal — and it needs location access to know where the sun is.

## Simplified and full views

OpenBat starts in **simplified view**, which shows a running list of every species identified, the input level and the spectrogram. That's deliberately most of what a first night needs, and it keeps the screen readable while you're outside in the dark.

Turn it off — it's the first switch in **Settings > General** — and the detector fills in the rest: peak frequency, bandwidth, duration and pulse rate for the last call, a zoomable close-up of the pulse itself, controls for the timeline, the colour palette and the frequency band, and the ability to drag the spectrogram back through the last minute of history. You're asked which you'd prefer when you first set the app up, and switching between them costs nothing: anything you've adjusted is kept and comes back.

The rest of this page describes the full view, so if a control it mentions isn't on your screen, that's why.

## Listening to bats

Bat calls are ultrasonic, so you can't hear them directly. OpenBat gives you a few ways to bring them into human hearing range, all from a single mode button. Start a session with the round button beside the tab bar, then tap that button again to open the session controls — Listen is the middle one. Tapping it cycles through:

- **Off**: no audio output, just detection and the spectrogram.
- **Heterodyne**: shifts a narrow band around a tunable frequency down into the audible range in real time, so you hear a "chirp" or "click" as each call passes through. Never stops listening, but it's a rough translation rather than a faithful one, more like a Geiger counter than a recording.
- **Slow replay**: captures a short window of audio around a detected call (1.5 seconds by default) and plays it back eight times slower, so a call that was too short and too high to make sense of turns into something you can actually hear the shape of. While a snippet is replaying, the mic isn't listening for the next one, so there's a brief window where a call could be missed — that trade is the whole point of the mode, and it's how dedicated time-expansion detectors have always worked. By default Heterodyne keeps running underneath so you never lose track of what's happening between snippets; you can set it to replay only, or heterodyne only, in the tuning panel.

A small pill above the spectrogram shows what Slow replay is doing at any moment: an ear when it's listening, a red dot while it's capturing a snippet, and a tortoise with a filling ring while it plays that snippet back. Tap the pill for a plain-language explanation.

> **Note:** When the sound of a bat is repeated by your phone, the microphone may pick that call up again and reproduce it. Wear earphones for best performance, or turn the volume down a bit.

Recordings can also be played back in full time expansion after the fact — tap the recording in its session — with nothing missed and nothing sped past, since the whole file already exists on disk by then.

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

Arm the recorder to save triggered calls as WAV files automatically as you listen. Every outing is saved as a **session** automatically — there's nothing to choose on the way in. Its detections are grouped together and mapped where each one was heard, and if you stop and start again shortly afterwards it carries on the same session rather than beginning a new one. Everything is saved on your phone, and you can export or share any recording directly from the app.

Opening a session shows a map of where its IDs happened, then two charts, then its recordings. **Species detected** is a bar per species, as long as the number of detections logged for it. **Detections over time** puts those same detections on the clock, which is a different question worth asking — a hundred IDs spread evenly over four hours and the same hundred in one busy twenty minutes look identical on the first chart and are very different nights. Tap the **i** beside either title for what it does and doesn't tell you; the important caveat is that these count *detections*, not individual bats, since one bat circling a pond gets logged again each time it comes past.

Older recordings that belong to no session — imports, and anything from before every outing became a session — sit in a "Not in a session" group at the bottom of the Sessions list.

## Species identification

Where OpenBat has an open-source model for your region, it can suggest a species for each pulse it detects, entirely on your device. No internet connection needed and nothing is sent anywhere for this to work.

- **NABat ML** covers North America.
- **BatDetect2** covers the United Kingdom, and is currently in **beta** while we test how well it holds up.

Every suggestion comes with a confidence level, and two extra flags where honesty demands one. **Sounds alike** means the species belongs to a group that overlaps too much to separate by sound — a standing caution about that species rather than a comment on the call you just heard. **Or SPECIES** means that on this particular call a second species scored almost as highly as the winner, and names it, so you can judge for yourself. Either way you're not given false confidence in a call that could genuinely be either one.

### Field guide

The built-in field guide covers species profiles: measurements, echolocation characteristics, distribution and conservation status. It's searchable and browsable by region, and it's community-contributed, so if you know your local bats, have a look at the [Contribute](/contribute/) page to see how to help expand it.

## Reviewing recordings

Every recording can be opened for a proper look afterwards — open a session and tap the recording: a static spectrogram of the whole pass, full time expansion playback, and the same measurements you get live (peak frequency, bandwidth, duration and so on) but with time to actually study them. A **Pulses** button on the same screen opens every individual pulse the classifier scored in that recording, so you can see the evidence behind the species it was given.

## Contributing recordings to community science

iNaturalist is a global community science platform that lets members of the public contribute biological observations to a shared database that researchers can use. We actually use this same database, [gbif.org](https://www.gbif.org), to power the range maps in the field guide.

To get started, head out and record some bats, then pick your best recordings and export them from the player (open a session, then tap the recording). Upload the spectrogram image and the WAV file to iNaturalist, and in time other experts will help ID the species where they can, which feeds straight back into the wider dataset.

> Note: we're working on a feature to make creating iNaturalist observations easier still, one that gives you everything you need to submit and makes sure it includes everything a potential ID'er would want to see.

## Troubleshooting

**The status indicator is red, or it says "no ultrasonic microphone detected"**
Check the USB connection to your microphone and adapter. Unplug and replug if needed, OpenBat detects the microphone through a route change and should pick it up within a second or two. If you're only using the built-in mic, this is expected, it can't hear ultrasound and you'll need a USB ultrasonic microphone.

**The sample rate shown looks lower than expected**
OpenBat displays the actual sample rate your microphone is delivering. If it's not what you expect for your device (should be 384 kHz), check the microphone itself is set to its native or maximum rate, and that no other app has claimed the audio session.

**No pulses are triggering even though I can see activity on the spectrogram**
Open Pulse Settings and check your amplitude threshold isn't set too high, and that the frequency gate (if you're using it) covers the range you're actually seeing activity in.

**I can't find my recordings**
Recordings are saved on-device and are visible in the Files app, under OpenBat's own folder. Recordings are kept with the session they were made in; older recordings made outside a session appear in the "Not in a session" group at the bottom of the Sessions list.

## Still stuck?

Get in touch on the [Contact](/contact/) page, we're happy to help.
