---
title: Three Things OpenBat Is Trying To Do
description: OpenBat is a community project with an app attached, not an app with a community attached. Here is what the project is actually for.
excerpt: OpenBat is a community project with an app attached, not an app with a community attached. Here is what the project is actually for.
date: 2026-09-01
author: Niall Bell
tags:
  - openbat
  - project
coverImage: /static/images/OpenBat_Screens.webp
featured: false
publish: false
---

People usually ask what the app does. That's the easy question, and the Help
page answers it. The harder question, and the more interesting one, is what the
app is *for*, because OpenBat isn't really an app project. It's a community
project that happens to need an app to work.

There are three goals. Everything else — every feature, every argument about a
button, every late night with a spectrogram — is downstream of one of them.

## 1. Build a field guide that's actually worth reading

There are around 1,400 known bat species. Depending on where you live, finding
decent, readable information about the ones near you ranges from "fine" to
"good luck". Plenty of it exists, but it's scattered across papers, PDFs,
regional handbooks and the memory of people who've spent thirty years doing
this.

So the guide is community-contributed and expert-reviewed. Anyone can propose
a species entry or a correction through the
[[Adding a Bat to the Field Guide|guide editor]]; nothing goes live unless
someone who knows the group has looked at it. That's slower than a wiki and
it's meant to be. A guide that professionals won't quote is a guide that
doesn't do its job.

## 2. Make appreciating bats something ordinary people can do

Bats are hard to experience. They're small, they fly at night, they don't perch
where you can see them, and they shout at frequencies you physically cannot
hear. For most people, most of the time, they are effectively invisible — which
is a large part of why they're so widely misunderstood.

A microphone and a phone fix that in about four seconds. The first time you
hear a bat pass over your head as a burst of clicks, something changes. It's
not an abstraction any more, it's an animal, twenty feet up, doing its job.

That moment is the whole product, honestly. Everything else on the screen is
scaffolding around it.

## 3. Be a catalyst for community science

This is the one people don't expect from a free curiosity app.

Bat records are scarce. In a lot of the world nobody has ever formally recorded
which bats are where, and "there were bats here, on this date, at this time" is
genuinely new information. Meanwhile, platforms that would happily accept that
information — iNaturalist, and through it GBIF — already exist and already work.

What doesn't exist is the bit in the middle. Getting from "I recorded a bat" to
"that recording is a properly formatted observation a researcher can use"
currently takes about ten minutes per record and a lot of fiddling on a
computer. Almost nobody does it, and the ones who do don't do many.

## The shape of the thing

Put those three together and you get a funnel that looks a lot like the one
Merlin Bird ID and eBird have been running for years: a huge number of people
download something fun, a smaller number get hooked, and a smaller number again
end up contributing real data they never set out to contribute.

{% chart {
  key: "RELATIVE, AND ILLUSTRATIVE — NOBODY HAS MEASURED THIS",
  xTicks: false,
  bars: [
    { label: "Downloads the app out of curiosity", value: 100, note: "" },
    { label: "Gets hold of an ultrasonic microphone", value: 62, note: "" },
    { label: "Hears their first bat", value: 38, note: "" },
    { label: "Contributes data", value: 18, note: "", highlight: true }
  ],
  caption: "Nobody arrives at the bottom on purpose. They arrive because each step was small and the next one was obvious. The widths are a shape, not a measurement."
} %}

The important thing about that shape is that the top is enormous and free. You
don't have to join anything, sign up to anything, or care about science at all
to be at the top of it. You just have to be curious about the thing squeaking
over your garden.

## What OpenBat is deliberately not

A few things we've decided not to be, because saying no early saves a lot of
disappointment later:

- **Not research-grade hardware.** We don't make microphones and we're not
  trying to. Any USB ultrasonic mic that doesn't demand its own app will work.
- **Not a replacement for the people already doing this.** Community bat
  programmes, local bat groups and national monitoring schemes have the
  expertise and the relationships. OpenBat is a tool to point volunteers at,
  not a competitor for their volunteers.
- **Not globally complete on day one.** The guide starts where we can actually
  vouch for it, and grows from there.

> [!note] The honest version
> OpenBat is a few friends in Squamish, British Columbia, with a microphone
> habit and too many ideas. Scoping it small is not modesty, it's the only way
> it survives contact with real life.

If you want the detail on any of that, most of it has its own post coming. And
if you disagree with any of it, that's genuinely useful — [get in
touch](/contact/).

Niall & the OpenBat Team 🙂
