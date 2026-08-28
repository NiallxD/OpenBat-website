---
title: A Beginner's Bat Vocabulary
description: Heterodyne, GUANO, Fc, pass, buzz, transect. The words you will meet in the app, on forums, and from bat people, explained plainly.
excerpt: Heterodyne, GUANO, Fc, pass, buzz, transect — the words you will meet in the app and from bat people, explained without the jargon that usually comes attached.
date: 2026-08-28
author: Niall Bell
tags:
  - how-to
  - reference
  - glossary
coverImage: /static/images/jargon_graphic.webp
heroImage: /static/images/jargon_graphic.webp
featured: false
publish: true
---

Every hobby has its vocabulary, and bat detecting has more than its share
because it borrows from three separate fields at once: biology, signal
processing, and conservation monitoring.

Here's the plain-language version of the words you'll actually meet. Bookmark it
and come back when something baffles you.

## The sounds

**Echolocation** — shouting and listening to the echo to work out what's around
you. The whole basis of the hobby/acoustic field study.

**Ultrasound** — sound above the range of human hearing, roughly above 20 kHz.
Not louder or more powerful, just higher.

**kHz (kilohertz)** — thousands of cycles per second. The unit of pitch you'll
see everywhere. Human voice is around 100-250 Hz and our hearing tops out around 20 kHz; bat calls typically sit between 15 and 120 kHz.

**FM call** — frequency modulated (the same as FM Radio!): a call that sweeps down through a range of frequencies. Most insect-hunting bats in temperate regions use this type of call.

**CF call** — constant frequency: a call that holds a note. Some species use these, often to pick up the flutter of insect wings against a steady background.

**Pass** — sometimes called sequence: one bat going by, producing a handful of calls. The basic unit of "something happened".

**Feeding buzz** — calls accelerating into a rattle as a bat closes on prey. The best sound bats make, in my opinion. Sounds a bit like a "zzzzzzZZZZZIIIPPP".

**Social call** — bats talking to each other rather than navigating. Often
lower, longer and more complex than echolocation calls, and in some species
audible to humans.

<figure>
  <a href="/static/images/jargon_graphic.webp"><img src="/static/images/jargon_graphic.webp" alt="Screenshot from the OpenBat app showing a bat pulse been analysed to reveal its features.." loading="lazy"></a>
  <figcaption>OpenBat allows you to analyse a bat call and extract some of these key metrics..</figcaption>
</figure>

## The measurements

**Peak frequency** — the pitch at which the call is loudest. Not the highest note.

**Characteristic frequency (Fc)** — the frequency at the flattest part near the end of a call. The number most reference tables mean. Makes up the Call Body.

**Knee frequency (Fk)** — where the call stops falling steeply and levels out.

**Bandwidth** — how much frequency range the call covers, top to bottom.

**Duration** — how long a call lasts, in milliseconds. Usually 2 to 20.

**Pulse rate** — how many calls arrive per second. A property of the sequence,
not of one call.

**Harmonics** — quieter copies of a call at multiples of its frequency. Useful clues, and sometimes the only visible part of a call if the fundamental is out of range.

## The equipment

**Heterodyne** — mixes incoming sound against a tuned frequency to produce an audible difference tone. Continuous, narrow-band, and lossy. Good for "is anything out there".

**Time expansion / slow replay** — records a snippet and plays it back slowed down, dropping every frequency in it into audible range. Faithful, but the microphone isn't listening while it plays.

**Frequency division** — a third approach, common in cheaper detectors, that divides frequencies down by a fixed ratio. Continuous like heterodyne, broader band, still lossy.

**Sample rate** — how many measurements per second the recording takes. Cannot be higher than what the microphone is capable of. Must be twice the frequency you are trying to hear/record (Nyquist Limit). A 384 kHz mic produces a 192 kHz recording.

**Spectrogram** — the picture of sound: time across, pitch up, loudness as brightness. Produced by parsing out individual frequencies using a Fast Fourier Transform (FFT).

**Trigger** — the moment a detector decides a sound counts as a call and starts recording it.

## The data words

**GUANO** — (Grand Unified Acoustic Notation Ontology) a metadata standard for bat recordings. It's how a file carries its time, place, sample rate and equipment details in a form other bat software can read years later. Yes, the name is a joke. Yes, it's a good one. Also bat poo.

**WAV** — uncompressed audio. The only format you should ever store or share bat recordings in because you don't loose any data.

**iNaturalist** — a global platform where anyone can post observations of wildlife and the community identifies them.

**GBIF** — the Global Biodiversity Information Facility. The shared pool that research-grade iNaturalist records flow into, alongside museum and survey data.

**Research grade** — an iNaturalist status meaning enough people agree on the identification. It does *not* require identification to species; agreement at genus level counts.

**NABat** — the North American Bat Monitoring Program. Also the source of one of the classifier models OpenBat uses.

**Presence data** — a record that something was here, at this time. The foundation everything else is built on.

## The fieldwork words

**Transect** — a fixed route walked or driven at a fixed speed, recorded consistently, so results can be compared between visits.

**Point count** — standing still at a fixed spot for a fixed time, for the same reason.

**Emergence count** — sitting outside a roost at dusk and counting bats as they leave. Done from a distance, without lights.

**Roost** — where bats sleep, raise young or hibernate. Legally protected in many countries, often whether or not bats are currently in it.

**Maternity roost** — where females gather to give birth and raise young. The most sensitive of the lot.

**Hibernaculum** — a winter roost. Cold, stable, humid, and absolutely not somewhere to go poking about.

**Clutter** — vegetation and structures that produce confusing echoes. Bats change their calls in it; detectors hear less through it.

## The two that get confused in OpenBat

**Pulse quality** — how clean the recording is. It's about the signal itself not the ID.

**Species confidence** — how sure the classifier is about the name. About the identity.

[[Two Scores That Look The Same|They are not the same number]] and telling them apart is the single most useful distinction in the app.

> [!tip] If you only remember four
> Pass, buzz, spectrogram, and Fc. Those four will get you through most conversations with bat people, and the rest you can look up while nodding.

Niall & the OpenBat Team 🙂
