---
title: Choosing a Bat Microphone
description: OpenBat requires an ultrasonic microphone to detect bats. Here is what makes one work, which ones people actually use, and what they really cost.
excerpt: You can buy a 384 kHz microphone that works out of the box for €65, or build one for about $30. Here is the honest range, and what separates the options.
date: 2026-09-08
author: Niall Bell
tags:
  - hardware
  - griff
heroImage: /static/images/griff-hero.webp
coverImage: /static/images/griff-cover.webp
featured: false
publish: true
---

## You need a microphone

Your phone can't hear in the range which bats call. The microphone built into it gives up at around 24 kHz, and almost every bat call happens above that, so without something
else plugged in, OpenBat, just like you and I, can't hear the bats.

What you need is an **ultrasonic USB microphone**: a small device that plugs
into your phone's charging port and hears far higher than you can. OpenBat
doesn't come with one and doesn't sell one. This post is about how to get one.

## What OpenBat needs from a microphone

Three things, in plain terms.

✅ **It plugs in and just works.** No app of its own, no driver, no pairing. In the specs you'll see this called *USB Audio Class* or *class compliant*, and it's the thing that lets your phone treat the microphone as a microphone rather than as a gadget it doesn't recognise.

✅ **It records at 384 kHz.** This is the number that matters most, and it's not a preference, see below.

✅ **It runs off your phone.** Ultrasonic microphones are small and take very little power, so the ones here draw what they need from the phone itself. Nothing to charge, no batteries.

> [!note] Why 384 kHz specifically
> A microphone's sample rate sets the highest pitch it can capture, roughly
> half the rate. At 384 kHz that ceiling is 192 kHz, comfortably above every
> known bat, which is why it became the standard number in bat recording.
>
> OpenBat's species identification was built and tested at exactly that rate,
> and it reads pitch straight off it. Hand it a recording made at some other
> rate and every frequency it measures would be wrong by the same proportion.
> So rather than confidently name the wrong bat, **OpenBat won't name a species
> at all** unless the audio arrives at 384 kHz.
>
> A slower microphone isn't useless. You'll still see calls on the spectrogram
> and still hear them through the listening modes. You just won't get
> identifications. If you're choosing what to buy, choose 384 kHz.

One thing worth knowing if you already own something: a few devices claim 384 kHz while quietly recording at a much lower rate and stretching it to fit. OpenBat shows you the rate it's actually receiving on the detector screen, so you can check rather than trust the box.

## Microphones people use

This is a small market serving professional ecologists, so the top of it is priced accordingly — but the bottom is friendlier than it used to be. You can buy an assembled microphone that works out of the box for **€65**, or build one for about **$30**, and only above that do you reach the several-hundred tier.

Prices are approximate, as of September 2026, in whatever currency the seller
lists.

### Griff Mini — build it yourself, around $30 CAD

The microphone OpenBat is developed and tested against, designed by Phil Atkin and given away as an open design. It's a small circuit board around a Raspberry Pi Pico, and in parts it costs roughly **$30 a unit**, an order of magnitude below anything you can buy finished.

The catch is real: it's a surface-mount build, so it wants solder paste, a stencil and a hotplate rather than a soldering iron. It's very learnable, and it's a genuinely good afternoon for a bat group to spend together, because the parts come in fives and the equipment is bought once.

Our **[[Build Your Own Bat Microphone]]** post is a full walkthrough: what to order, what it costs, and a first-timer's guide to the soldering. Phil's own page is at **[pippyg.com](https://www.pippyg.com/griff.html)**, and it's the authoritative source.

Phil's terms: Griffs are not to be sold. Build one, build five with friends, but nobody's making money on them, including us.

### Apodemus Pipistrelle Mini — €65

**If you aren't going to build one, this is the cheapest way to get a working bat detector right now.** Nothing else on this page comes close: the next option up is a third dearer again, and the commercial detectors start at three times the price. It's sold by
[Apodemus](https://www.apodemus.eu/en/Apodemus-Pipistrelle-Mini/00126) in the Netherlands, factory-built and tested, and it does two jobs.

Plugged into a phone it is a **384 kHz USB microphone**, which is exactly what OpenBat wants. Unplugged, with three AAA batteries and wired headphones, it's a standalone heterodyne and time-expansion detector you can use on its own — so it doubles as a way into bat listening that doesn't depend on a phone at all.

> [!warning] Take the batteries out
> Its manual is blunt about this: "when using as a USB microphone, the
> batteries must be removed." It won't work as a microphone with them in.
>
> Also worth knowing: while it's plugged into a phone, the buttons on the
> device itself stop responding. Everything is controlled from the phone, which
> is correct but surprising the first time.

It has a **USB-Micro** socket, so you'll need a cable — see below. Batteries, headphones and cable are all sold separately.

Apodemus ship from the Netherlands and also list [resellers](https://www.apodemus.eu/en/Information/Resellers/) across the UK, much of Europe, the USA, Australia and New Zealand, Japan and India — usually the cheaper route once postage and customs are counted. There's no Canadian reseller at the time of writing, so from here it's the US listing or direct.

We haven't tested this one with OpenBat ourselves, but Apodemus document it working as a plain USB microphone with both an iOS and an Android app, which is the behaviour OpenBat needs. If you try it, [tell us](/contact/).

### AudioMoth USB Microphone — around $80 USD

The cheapest thing you can simply order. It's made by[Open Acoustic Devices](https://www.openacousticdevices.info/usb-microphone), sold through a few retailers such as [GroupGets](https://groupgets.com/products/audiomoth-usb-microphone), records up to 384 kHz, and plugs in as an ordinary USB microphone.

Two things to know. It has a **micro-USB socket**, so you'll need a cable or adapter (see below). And its sample rate is set in its own free configuration app on a computer rather than by your phone, so set it to its highest rate before you take it out.

We haven't tested this one with OpenBat ourselves, we have two but they are currently deployed surveying bats! It's widely used with other bat apps on iPhone, and on paper it's exactly what OpenBat asks for. If you try it, [tell us](/contact/) and we'll say so here.

### Dodotronic Ultramic 384K EVO — around €350

A well-established commercial option, [sold direct by Dodotronic](https://www.dodotronic.com/product/ultramic-384k-evo/) and through wildlife equipment retailers. Driverless, 384 kHz, properly built, and popular with people doing survey work. Untested by us.

### Professional detectors — $400 and up

Above this point you're into equipment aimed at consultants doing paid survey work, Pettersson and similar. They're excellent and they're priced for somebody billing for the night. If you're reading this page, you probably don't need one.

### Handheld self-builds

Phil Atkin also designs the **PiPistrelle Mini** — handheld detectors that double as 384 kHz USB microphones, at similar self-build cost to the Griff. Same site, [pippyg.com](https://www.pippyg.com/). If the handheld shape appeals but the soldering doesn't, the assembled Apodemus above is the same idea bought rather than built.

> [!tip] Know a good one we've missed?
> This list is short because the market is, and because we'd rather name a
> few microphones we can say something honest about than pad it out. If
> you're using something that works well with OpenBat, [get in
> touch](/contact/) — we'll add it, and say who tried it. That goes for the
> "what won't work" list below too: if we've written off something you've
> got working, we'd rather be corrected than leave it wrong.

## Cables and adapters

Most of these microphones have a **micro-USB** socket, and no phone has one, so something goes in between:

- **iPhone or iPad with USB-C** — a plain
  [USB-C to micro-USB cable](https://www.aliexpress.com/item/1005008423647623.html)
  is all you need. A couple of dollars.
- **iPhone with a Lightning port** — you need a **Lightning OTG adapter**, the
  kind that carries data and can power a device. A plain charging adapter looks
  identical and does nothing at all, so check before you buy.

  You don't need to spend much here. [These
 ones](https://www.aliexpress.com/item/1005005713313657.html) are about $3.50
  and **we've tested them ourselves** — they work. Apodemus name Apple's own
  Lightning to USB Camera Adapter (part `MD821ZM/A`) as the adapter they've
  verified, which is the safe answer if you'd rather not gamble on a cheap one,
  but it isn't necessary.

## What won't work

- **Your phone's own microphone.** It stops around 24 kHz. This isn't a setting
  that can be changed.
- **Ordinary USB microphones** — podcast mics, clip-on interview mics, USB-C
  headsets. They're built for voices and record at 48 kHz, which is fifteen
  times too slow for a bat.
- **Wildlife Acoustics Echo Meter Touch modules.** These are popular and they
  are good at what they do, but they are not microphones in the sense this page
  means. The module digitises the sound on board and streams it to Wildlife
  Acoustics' own [Echo Meter Touch
  app](https://www.wildlifeacoustics.com/products/echo-meter-touch-2), which
  does the identifying — so it never appears to your phone as an audio input,
  and OpenBat has nothing to listen to. That's a design decision on their part
  rather than a fault, and it applies to any app that isn't theirs.
- **Anything else locked to its maker's own app.** The same goes for other
  detectors that talk only to the software they shipped with. If a product
  doesn't describe itself as a *USB microphone*, assume this is the case.
- **Standalone recorders**, like the Song Meter family or an AudioMoth left in
  its case. These write to an SD card on their own rather than streaming to a
  phone, so there's no live audio for OpenBat to work with. The recordings are
  perfectly good, they just belong in desktop analysis software. (An AudioMoth
  is the exception that proves the rule — reflash it with the USB microphone
  firmware above and it streams.)
- **Cheap "bat detector" toys.** The heterodyne boxes sold for a few pounds can
  be genuinely fun and will tell you a bat is there, but they produce a tuned
  audible squeal rather than a recording, so there's nothing for OpenBat to
  analyse.

## Once it's plugged in

Open OpenBat, and the status indicator at the top of the detector screen turns
green once audio is arriving. It'll also offer to calibrate — worth doing, it
takes a moment, and it's what keeps the loudness readings meaningful.

The [Help page](/help/) covers everything from there, and if the microphone
isn't showing up, the troubleshooting section at the foot of it is the place to
start.
