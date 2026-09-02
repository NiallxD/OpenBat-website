---
title: Help
description: Getting started, listening modes, pulse settings and frequently asked questions.
permalink: /help/
publish: true
---

<div class="plat-toggle-wrap" role="tablist" aria-label="Platform">
  <div class="plat-toggle">
    <button type="button" class="plat-toggle-btn active" data-platform="ios" role="tab" aria-selected="true" aria-controls="plat-ios">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.37 12.72c-.02-2.3 1.88-3.4 1.96-3.46-1.07-1.56-2.73-1.78-3.32-1.8-1.42-.14-2.76.83-3.48.83-.72 0-1.82-.81-2.99-.79-1.54.02-2.96.89-3.75 2.26-1.6 2.78-.41 6.9 1.15 9.16.76 1.11 1.67 2.35 2.86 2.3 1.15-.04 1.58-.74 2.97-.74 1.39 0 1.78.74 2.99.72 1.23-.02 2.01-1.12 2.76-2.24.87-1.28 1.23-2.53 1.25-2.6-.03-.01-2.39-.92-2.4-3.64zM14.1 5.6c.63-.77 1.06-1.83.94-2.9-.91.04-2.01.61-2.67 1.37-.59.68-1.1 1.76-.96 2.8 1.01.08 2.05-.51 2.69-1.27z"/></svg>
      iOS
    </button>
    <button type="button" class="plat-toggle-btn" data-platform="android" role="tab" aria-selected="false" aria-controls="plat-android">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 11a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><path d="M8 10 6.2 6.6M16 10l1.8-3.4"/><path d="M9.5 7.5h.01M14.5 7.5h.01"/></svg>
      Android
    </button>
  </div>
</div>

<div class="plat-section" id="plat-ios" role="tabpanel">

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

Turn on **Advanced mode** — it's the first switch in **Settings > General** — and the detector fills in the rest: peak frequency, bandwidth, duration and pulse rate for the last call, a zoomable close-up of the pulse itself, controls for the timeline, the colour palette and the frequency band, and the ability to drag the spectrogram back through the last minute of history. Simplified is where a new install starts — you aren't asked to choose during setup, since it's not a useful question before you've seen the screen it's about. Switching between them costs nothing: anything you've adjusted is kept and comes back.

The rest of this page describes the full view, so if a control it mentions isn't on your screen, that's why.

## Listening to bats

Bat calls are ultrasonic, so you can't hear them directly. OpenBat gives you a few ways to bring them into human hearing range, all from a single mode button. Start a session with the round button beside the tab bar, then tap that button again to open the session controls — Listen is the middle one. Tapping it cycles through:

- **Off**: no audio output, just detection and the spectrogram.
- **Heterodyne**: shifts a narrow band around a tunable frequency down into the audible range in real time, so you hear a "chirp" or "click" as each call passes through. Never stops listening, but it's a rough translation rather than a faithful one, more like a Geiger counter than a recording.
- **Slow replay**: captures a short window of audio around a detected call (half a second by default) and plays it back sixteen times slower, so a call that was too short and too high to make sense of turns into something you can actually hear the shape of. Half a second slowed sixteen times takes eight seconds to play, and while a snippet is replaying the mic isn't listening for the next one — so there's a window where a call could be missed. That trade is the whole point of the mode, and it's how dedicated time-expansion detectors have always worked. Both numbers are adjustable in the tuning panel: a shorter window or a gentler slowdown buys the deaf time back. By default Heterodyne keeps running underneath so you never lose track of what's happening between snippets; you can set it to replay only, or heterodyne only, in the tuning panel.

A small pill above the spectrogram shows what Slow replay is doing at any moment: an ear when it's listening, a red dot while it's capturing a snippet, and a tortoise with a filling ring while it plays that snippet back. Tap the pill for a plain-language explanation.

> **Note:** When the sound of a bat is repeated by your phone, the microphone may pick that call up again and reproduce it. Wear earphones for best performance, or turn the volume down a bit.

Recordings can also be played back in full time expansion after the fact — tap the recording in its session — with nothing missed and nothing sped past, since the whole file already exists on disk by then. The speed is yours to pick there: a button under the spectrogram steps between four, eight and sixteen times slower, and you can change it while it's playing.

## Detecting and capturing pulses

OpenBat's pulse detector watches the incoming audio and triggers automatically when it sees a call-shaped pulse, drawing it on screen and, if you've armed recording, saving it.

Open **Settings > Detecting** to tune it. Under **What counts as a call**:

- **Mode**: "Loudness" counts anything loud enough, whatever its pitch — useful for testing, but wind and handling noise will set it off. "Loudness + pitch" requires the sound to be high-pitched too, and is normally the one to use.
- **Loudness**: matches the brightness scale on the spectrogram, so anything that looks brighter than this will trigger. Lower it for faint, distant bats — and more noise with them.
- **Lowest pitch**: anything below this is ignored however loud it is, when you're in "Loudness + pitch" mode. 15 to 20 kHz clears wind and handling noise; raise it to 30 to 40 kHz to target only the higher-pitched species.

Under **Telling calls apart** (advanced mode only, since these are best set with a spectrogram in front of you):

- **Shortest call**: how long a sound must last to count as a call, which rejects clicks and pops.
- **Join gaps up to**: a call can dip quiet partway through, and quiet patches shorter than this stay part of the same call — raise it if one call is being counted as several.
- **Wait after a call**: the shortest gap accepted between two separate calls, 30 ms by default, so echoes aren't counted as extra calls.

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

Every recording can be opened for a proper look afterwards — open a session and tap the recording: a static spectrogram of the whole pass, full time expansion playback at a speed you choose, and the same measurements you get live (peak frequency, bandwidth, duration and so on) but with time to actually study them. A **Pulses** button on the same screen opens every individual pulse the classifier scored in that recording, so you can see the evidence behind the species it was given.

Most of a recording is usually silence. **Hide silence** — the crossed-out speaker in the toolbar — cuts it out: the spectrogram packs down to just the stretches with something in them, so a five-minute recording can become twenty seconds of actual calls, and playing it plays exactly that. The gaps aren't skipped over as you reach them, they're simply not there, so the elapsed time you see is the time you'll spend listening. A few milliseconds are kept either side of every pulse so nothing is clipped, and the join between one kept stretch and the next is crossfaded inside that margin — the recording's own background carries straight through it, so there's no dip in the sound as each join passes.

Two settings in the tuning panel control what counts as silence. **Keep above** is how far above that recording's own background a sound has to be — and it accounts for how much that background wanders over the recording, not just how quiet it gets at its quietest, so the same setting cuts the same way on a still night and a windy one. Lower it to keep faint, distant calls, raise it to cut harder. **Pulse margin** is how much either side of each pulse is kept: widen it for more context, narrow it to pack tighter. Underneath, the panel tells you what it actually did — how much of the recording was kept and how many separate stretches — and says so plainly if nothing cleared the threshold, rather than quietly showing you the whole file.

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
Open **Settings > Detecting** and check **Loudness** isn't set too high, and that **Lowest pitch** (if you're in "Loudness + pitch" mode) is below the range you're actually seeing activity in.

**I can't find my recordings**
Recordings are saved on-device and are visible in the Files app, under OpenBat's own folder. Recordings are kept with the session they were made in; older recordings made outside a session appear in the "Not in a session" group at the bottom of the Sessions list.

## Still stuck?

Get in touch on the [Contact](/contact/) page, we're happy to help.

</div>

<div class="plat-section plat-hidden" id="plat-android" role="tabpanel">

## OpenBat on Android

**There's no Android version of OpenBat yet.** Currently, the OpenBat app is only available on iPhone and iPad. This isn't a permanent decision, I just can't feasibly develop an app for two platforms at the same time, especially when one I am not familiar with. If you'd like to see OpenBat on Android, [Get in Touch](/contact/) and let me know.

## What to use in the meantime

The good news is that the hard part of bat detecting is the microphone, not the app. If you've already got an ultrasonic USB mic, these will get you listening on Android today:

- **[Bat Recorder](https://play.google.com/store/apps/details?id=com.bkmicro.batrecorder)** — heterodyne and time-expansion listening, triggered recording and a live spectrogram, working with a range of USB ultrasonic microphones. The closest thing to OpenBat's feature set on Android.
-**[Bat Gizmo](https://play.google.com/store/apps/details?id=uk.org.gimell.batgizmoapp) — Supports the Griff Mini microphones and allows visualisation of bat calls with heterodyne playback. Note you have to manually tune the heterodyne. Read below for a brief guide on how to tune for bats in BC.

Neither app is ours and neither is open source, so we can't vouch for what they do with your recordings or your location. Check their own privacy terms before you rely on them.

## Tuning a heterodyne detector

One of the easiest ways to hear bats is to use heterodyning. This is the process of 'turning' into a frequency such that simple signal processing can produce an audible sound. I'll skip the details, all you need to know is that the frequency you set needs to be near the frequency the bats call at. 

Bat Gizmo app allows you to set two tuning frequencies at the same time, this is great for picking up more bats! As a rule of thumb, in North America, set one to 25 kHz and one to 47 kHz, this will help you pick up as many bats as possible without tweaking the settings all the time.

For more, search up 'How to use a heterodyne bat detector'.

## What still applies

Most of what's on the iOS tab is about bats rather than about the app, and travels perfectly well to whatever you end up using:

- **When to go out** — the hours after sunset and before sunrise are the ones that matter, whatever's in your hand.
- **What the listening modes do** — heterodyne and time expansion work the same way in any detector, and the trade-off in time expansion (the mic stops listening while a snippet plays back) is a property of the technique, not of OpenBat.
- **Contributing to community science** — a spectrogram and a WAV file are all iNaturalist wants, and any detector that exports recordings can supply both. See the iOS tab for how that upload works.

## Something else?

If you're on Android and stuck on any of this, which microphone to buy, which adapter, where to point it, [Get in Touch](/contact/). The OpenBat project is about more than just our app and we are happy to help.

</div>
