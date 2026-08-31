---
title: The Species That Sound Alike
description: Some bats cannot be told apart from their calls. Not "not yet" — not by anyone, from sound alone. Here is why, and what to do about it.
excerpt: Some bats simply cannot be separated by their calls. Not "not yet", not "not by an app" — not by anyone, from sound alone. Here is why.
date: 2026-12-15
author: Niall Bell
tags:
  - auto-id
  - echolocation
featured: false
publish: false
---

There's a flag in OpenBat that says **sounds alike**, and it's the most
important label in the app.

It doesn't mean "the recording was poor". It doesn't mean "the model isn't very
good". It means this species belongs to a group whose calls overlap so much that
separating them by sound is not reliably possible — by our classifier, by a
better classifier, or by a human expert with thirty years of experience and
excellent equipment.

That's an unusual thing for software to admit, so it's worth explaining why it's
true.

## Calls are behaviour, not identity

The intuition that trips everyone up is that a species has *a call*, the way it
has a wingspan. It doesn't.

A bat adjusts its call constantly depending on what it's doing:

- Flying in the open? Longer, lower, narrower calls that carry.
- Threading through vegetation? Shorter, higher, broader calls updating fast.
- Closing on prey? Faster and faster, into a buzz.
- Near a surface? Different again, to avoid being deafened by its own echo.

So a single species produces a wide range of calls. And when several related
species are all doing similar jobs in similar habitats, their ranges of calls
land on top of each other.

{% chart {
  key: "RANGE OF CALLS EACH SPECIES PRODUCES →",
  xTicks: false,
  min: 0,
  max: 10,
  bars: [
    { label: "species A", from: 0.5, to: 3.5, note: "separable — barely touch" },
    { label: "species B", from: 4, to: 7.5 },
    { label: "species C", from: 1.8, to: 6.6, note: "not separable — almost identical", highlight: true },
    { label: "species D", from: 2.4, to: 6.9, highlight: true }
  ],
  caption: "The bars are ranges, not values. When two ranges sit on top of each other, a single call in the overlap could honestly have come from either."
} %}

If a call lands in the overlap — and most do — there is no measurement that
resolves it. The information simply isn't in the recording.

## The famous example

In North America and Europe alike, the *Myotis* bats are the classic problem
group. Several species, similar sizes, similar habitats, similar hunting styles,
and steeply sweeping calls that cover much the same ground.

Bat workers deal with this constantly, and the professional convention is to
report at the level the evidence supports: *Myotis* sp., or a species group,
rather than pretending to a name. That's not a failure of rigour, it *is* the
rigour.

## What the app does instead of guessing

Three things, and they're different from each other:

**A confidence score.** How strongly the model favoured its answer, after
geographic weighting. Low confidence should look low.

**"Sounds alike".** A permanent property of the species. You'll see it on a
flawless recording, because it's telling you about the *species*, not your
audio.

**"Or [another species]".** Specific to this call: a second species scored
almost as highly, and here it is, so you can weigh them yourself.

The temptation, from a product point of view, is to hide all this. A clean
single answer looks more confident and demos better. It's also the thing that
would make bat biologists — the people whose trust actually matters here —
correctly dismiss the whole project.

## What to do with an unresolvable call

Report it honestly and it stays useful. Specifically:

- **Upload the recording**, not just the verdict. The audio is evidence; the
  name is an opinion.
- **Identify at the level you can defend.** "*Myotis* sp." is a real,
  research-grade-eligible identification on iNaturalist — the platform's
  standard asks for community agreement at whatever depth is achievable, not
  resolution to species.
- **Note what you saw and heard.** Habitat, flight behaviour, time relative to
  sunset. Sometimes context does what acoustics can't.
- **Let the identifiers argue.** Some of them are extremely good and genuinely
  enjoy this.

## The bigger point

An identification system that never says "I don't know" isn't more capable —
it's less honest, and downstream, it's actively harmful. Wrong species records
enter datasets and quietly mislead people for years.

So when OpenBat hedges, it isn't being coy. It's telling you something true
about bats: that a few of them have converged on nearly identical solutions to
the same problem, and sound is not always enough to tell them apart.

Which is, when you think about it, quite a good advert for the animals.

Niall & the OpenBat Team 🙂
