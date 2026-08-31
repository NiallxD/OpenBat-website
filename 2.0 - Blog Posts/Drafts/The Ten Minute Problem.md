---
title: The Ten Minute Problem
description: Getting one bat recording into a usable scientific record takes about ten minutes of fiddling. Multiply that by a good night and you see why almost nobody does it.
excerpt: Turning one bat recording into a usable scientific record takes about ten minutes of fiddling. Multiply that by a decent night's recording and you see the problem.
date: 2026-11-10
author: Niall Bell
tags:
  - dev-log
  - community-science
featured: false
publish: false
---

Here's a problem that doesn't look like a problem until you try to do it forty
times.

You've recorded some bats. You'd like those recordings to be useful to somebody
other than yourself. The route exists — iNaturalist, then onward to GBIF — and
identifiers are out there willing to look at bat calls. Everything you need is
in place.

Now actually do it, for one recording.

## The ten minutes

Roughly, by hand:

1. Get the WAV file off your phone and somewhere you can work with it.
2. Open it in something that can draw a spectrogram of ultrasound.
3. Find the best pulse in the pass, out of possibly dozens.
4. Frame it sensibly and export an image — with a log frequency axis, because
   that's the convention reviewers expect.
5. Dig out the time, date and location. Convert them into the format the upload
   form wants.
6. Find the sample rate and the detector model.
7. Write all of that into a comment, in a form an identifier can read.
8. Upload the audio, upload the image, fill in the fields, submit.
9. Decide how confident you are, and phrase that honestly.

Ten minutes if you know what you're doing and nothing goes wrong.

{% barChart {
  key: "MINUTES OF DESK WORK, AT TEN MINUTES A RECORD",
  caption: "Ten minutes is fine once. It is not fine as a per-record cost, and per-record costs are what decide whether data exists — which is why almost nobody does the third bar.",
  bars: [
    { label: "1 recording", value: 10, note: "10 minutes" },
    { label: "a decent night (10 records)", value: 100, note: "1 hour 40 minutes" },
    { label: "a season (30 nights)", value: 3000, note: "50 hours — nobody does this", highlight: true }
  ]
} %}

This is the actual gap between "lots of people record bats" and "very few bat
records reach scientific databases". Not apathy. Not gatekeeping. Just an
unreasonable amount of clicking.

## What we're building instead

Some of this is already gone, and it's worth being precise about which.

**The metadata problem is solved.** Every recording the app saves carries its
GUANO metadata *inside the WAV file itself* — the bat world's own standard for
exactly this, so time, place, sample rate and what recorded it travel with the
audio rather than living in your head. Steps 5 and 6 above simply don't exist
any more.

**Export is one tap.** Share a recording and you get a zip containing the WAV and
a rendered spectrogram image, named after the recording. That's steps 1 through 4
collapsed into a share sheet.

**What's still missing** is the last mile: a spectrogram framed and axed the way
iNaturalist reviewers expect, centred on the best pulse in the pass rather than
showing the whole thing, and the metadata presented in a form that drops
straight into an observation rather than being embedded in a file the uploader
has to know to look inside.

The app already knows all of this. It knows which pulse scored highest, it knows
the sample rate, it knows the time and the place. Making a human look those up
by hand is a design failure, not a necessary step.

## Two decisions worth explaining

**We cut the heterodyned audio export.** It was on the list, and it sounds
helpful — a version of the recording you can actually hear. But think about who
receives it. An identifier working on a bat call wants the raw file and the
spectrogram; a heterodyned version is a lossy translation made for human ears
and no use for identification. It would have been a nice feature that quietly
made submissions worse.

**Direct upload is applied for, not delivered.** iNaturalist has an API that
could create a properly structured observation in a single authenticated call,
which would be strictly better than a share sheet. Getting app-level access
requires meeting criteria designed for individual power users — an established
account with a recent record of helpful identifications — and the approval
timeline is, from what we can tell, unpredictable. The application is written and
going in.

So: apply, and ship the share-sheet version regardless. A feature that exists
beats a better feature waiting in someone else's inbox.

## The principle underneath

There's a general lesson here that applies well beyond bats.

If you want people to contribute to something, the per-contribution cost matters
far more than the total value of contributing. People will happily do a
thirty-second thing forty times. They will not do a ten-minute thing forty
times, no matter how strongly they agree it's worthwhile.

Most citizen science tooling is built by people who care enormously about the
data and therefore don't notice the friction — they'd do the ten minutes, so
they assume others will. They mostly won't, and that's not a character flaw,
it's arithmetic.

> [!note] The measure we care about
> Not "how many people downloaded it". Not even "how many recordings were
> made". The number that matters is **how many recordings became records
> somebody else can use** — and that number is decided almost entirely by how
> annoying the last step is.

Niall & the OpenBat Team 🙂
