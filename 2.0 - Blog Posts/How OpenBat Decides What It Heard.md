---
title: How OpenBat Decides What It Heard
description: The chain that turns a burst of ultrasound into a species name — pulse detection, a short window of audio, an on-device model, and the gates that let it say "no idea".
excerpt: The chain that turns a burst of ultrasound into a species name — pulse detection, a short window of audio, an on-device model, and the gates that let it say "no idea".
date: 2026-08-27
author: Niall Bell
tags:
  - auto-id
  - classifier
  - on-device
heroImage: /static/images/how-autoid-hero.webp
coverImage: /static/images/how-autoid-hero.webp
featured: false
publish: true
---

Point OpenBat at the sky and, a second or two after a bat goes over, a name
appears. This is what happens in between.

Everything below runs on the phone. No audio, no location and no detection
leaves the device to produce an identification. There is no server in this
loop at all, which is also why it works deep in a forest or valley with no phone signal.

<figure>
  <a href="/static/images/autoid-pipeline.webp"><img src="/static/images/autoid-pipeline.webp" alt="A seven-step diagram: sound, pulse, window, picture, model, where, verdict." loading="lazy"></a>
  <figcaption>The whole chain. Steps 1–4 are signal processing, 5 is the neural network, and 6–7 are the parts that decide whether to trust it.</figcaption>
</figure>

## Finding a call

The microphone delivers 384,000 samples a second. Almost none of it is a bat.

A call has to be both **loud enough and high enough** to trigger — the pitch
half of that test is what stops wind, footsteps and jangling keys from filling
your night with detections. Anything below 15 kHz is ignored, which is under
every species OpenBat can name.

Two details do most of the practical work:

- **A 30 ms hold-off after each call.** A bat's own echo comes back a few
  milliseconds behind it, and would otherwise be counted as a second call. The
  hold-off is deliberately shorter than the typical gap between real calls —
  field recordings put that around 79 ms — so a normal pass isn't thinned out.
- **A 6 ms tolerance inside a call.** FM sweeps have amplitude nulls in the
  middle. Without bridging them, one call arrived as three fragments.

These numbers are set from field recordings rather than theory, and every one
of them is adjustable in the app if your site or your microphone wants
something different.

## Cutting the window, and drawing it

Each detected call is cut out with the **onset placed 30% of the way into the
window** — enough room in front of it to be sure the call started, and enough
behind for the sweep to finish. How much audio gets cut is the model's own
number: 50 ms for NABat ML, and 256 ms for BatDetect2, which is exactly the
clip length that model was trained on. Everything after the cut is the model's
own business.

Where the call sits matters more to some models than others. NABat ML looks at
the window as a whole and expects the call in a consistent place; BatDetect2
hunts for the call inside the window itself, so there the 30% is only keeping it
clear of both edges.

The model never sees the sound. It sees a **picture** — a spectrogram, drawn
to whatever size and shape that particular model expects. That is genuinely how
these classifiers work: an image network, looking at a plot of frequency
against time, the same plot you are watching scroll across the screen.

Some models can also measure how good a capture is before spending anything on
it, and where that is available OpenBat uses it as a **quality gate**: enough
signal above the noise, enough amplitude, and the call not jammed against
either edge of the window, since a clipped call is a misleading one. Not every
model offers those measurements, and the app only shows the gate's controls for
one that does.

## Two models, one at a time

- **NABat ML** — the USGS North American Bat Monitoring Program's classifier,
  31 classes covering North American species plus an explicit non-bat NOISE
  class. CC BY 4.0.
- **BatDetect2** — the University of Edinburgh's detector/classifier, 17 UK
  species. CC BY-NC 4.0, and still marked beta in the app.

Only one classifies at a time, and the app suggests the right one from where
you are rather than picking silently.

**Confidence is not comparable between the two.** They score very differently —
BatDetect2 tends to produce far more emphatic numbers — so 70% from one does not
mean what 70% from the other does.

## Where you are

Every species starts neutral. When the phone gets a location fix, OpenBat reads
the [[How OpenBat Draws a Range Map|bundled range grid]] and turns it into a
weight per species: **1.0** if this is inside the species' range, **0.01** if it
is well outside, and **0.5** if the grid has nothing to say about that species
at all.

{% panels { columns: 3, caption: "An out-of-range species is multiplied down to almost nothing, and the rest are scaled back up so they still add to 1. The winner gains confidence because a rival was ruled out, not because the model heard more. Illustrative scores; the weights are the real ones." } %}
{% chart {
  key: "1 · WHAT THE MODEL HEARD",
  caption: "One pulse, scores as the network produced them.",
  max: 0.7,
  height: 300,
  xTicks: false,
  xGrid: false,
  bars: [
    { label: "Daubenton's (MYODAU)", value: 0.38, note: "0.38" },
    { label: "Brandt's (MYOBRA)", value: 0.23, note: "0.23" },
    { label: "Common pip (PIPPIP)", value: 0.16, note: "0.16" },
    { label: "Natterer's (MYONAT)", value: 0.11, note: "0.11" },
    { label: "Soprano pip (PIPPYG)", value: 0.08, note: "0.08" },
    { label: "Barbastelle (BARBAR)", value: 0.04, note: "0.04" }
  ]
} %}
{% chart {
  key: "2 · WHAT LIVES HERE",
  caption: "Weight from the bundled range grid at your location.",
  max: 1.2,
  height: 300,
  xTicks: false,
  xGrid: false,
  bars: [
    { label: "Daubenton's (MYODAU)", value: 1, note: "1" },
    { label: "Brandt's (MYOBRA)", value: 0.01, note: "0.01", highlight: true },
    { label: "Common pip (PIPPIP)", value: 1, note: "1" },
    { label: "Natterer's (MYONAT)", value: 1, note: "1" },
    { label: "Soprano pip (PIPPYG)", value: 1, note: "1" },
    { label: "Barbastelle (BARBAR)", value: 0.5, note: "0.5", style: "secondary" }
  ]
} %}
{% chart {
  key: "3 · WHAT GETS REPORTED",
  caption: "Weighted, then renormalised back to a total of 1.",
  alt: "Bar chart of the renormalised scores: Daubenton's 0.51, common pipistrelle 0.21, Natterer's 0.15, soprano pipistrelle 0.11, barbastelle 0.03, Brandt's 0.00.",
  max: 0.7,
  height: 300,
  xTicks: false,
  xGrid: false,
  bars: [
    { label: "Daubenton's (MYODAU)", value: 0.51, note: "0.51", highlight: true },
    { label: "Brandt's (MYOBRA)", value: 0.001, note: "0.00" },
    { label: "Common pip (PIPPIP)", value: 0.21, note: "0.21" },
    { label: "Natterer's (MYONAT)", value: 0.15, note: "0.15" },
    { label: "Soprano pip (PIPPYG)", value: 0.11, note: "0.11" },
    { label: "Barbastelle (BARBAR)", value: 0.03, note: "0.03" }
  ]
} %}
{% endpanels %}

Two things about that middle panel matter more than the arithmetic.

**"I don't know" is not "not here."** A species with no range data keeps half
weight and stays enabled, and the settings screen says plainly that it is
unconfirmed rather than quietly presenting a guess as a fact.

**The weights never decide whether it was a bat.** That question is settled
first, on the model's own unweighted scores. Only once those say "this is a
real, confidently identified call" do the weights get a say in *which* species
to name. If where you were standing could influence the first question, the app
would be inventing evidence out of your own expectations.

## A pass, not a call

Bats don't call once. The unit OpenBat identifies is a **pass (sometimes called a sequence)**,  the burst of calls as an animal crosses in front of the microphone, closed by two seconds of silence.

{% chart {
  key: "PULSE",
  yKey: "MODEL'S OWN CONFIDENCE",
  vertical: true,
  yTicks: true,
  max: 1,
  height: 340,
  caption: "Calls are found one at a time; the verdict is taken over all of them. Two of these eight pulses sit below the no-ID line on their own and neither is thrown away — the pass is judged on the average. Illustrative, at the real thresholds.",
  alt: "Bar chart of eight pulses in one pass, confidences from 0.41 to 0.88, with the no-ID line at 0.57 and the mean at 0.67 marked. Pulses 1 and 8 fall below the no-ID line; the mean clears it.",
  bars: [
    { label: "1", value: 0.44, note: "" },
    { label: "2", value: 0.71, note: "" },
    { label: "3", value: 0.83, note: "" },
    { label: "4", value: 0.75, note: "" },
    { label: "5", value: 0.88, note: "" },
    { label: "6", value: 0.62, note: "" },
    { label: "7", value: 0.69, note: "" },
    { label: "8", value: 0.41, note: "" }
  ],
  lines: [
    { at: 0.57, axis: "y", text: "no-ID line 0.57", style: "muted", position: "start" },
    { at: 0.67, axis: "y", text: "mean 0.67 — the pass gets a name", dashed: false, position: "start" }
  ]
} %}

A pass gets a name only if the **mean raw confidence across its pulses clears
the model's no-ID line** — 0.57 for NABat ML, 0.4 for BatDetect2, whose scores
sit on a different scale. Then, among the weighted scores, the winner needs at
least two pulses and a mean of 0.15 to be reported.

There are three possible outcomes, and the third is the one worth arguing for:

- a **species**,
- **NOISE**, when the model's own non-bat class wins,
- **no ID** — pulses were captured and classified, but the evidence never
  cleared the bar.

No ID is recorded like any other pass, rather than dropped. The list says
"something triggered, we couldn't tell what" instead of quietly losing evidence
you heard yourself and watched cross the spectrogram.

## Saying "these two are hard"

Some species pairs simply are not separable by ear or by model — UK *Myotis*,
common versus soprano pipistrelle, Leisler's versus noctule, brown versus grey
long-eared. Each model carries its own list of these **complexes**, because
whether two species can be told apart is a fact about the model, not about the
bats.

When the runner-up is close behind the winner *and* belongs to the same
complex, the ID is flagged as genuinely ambiguous rather than merely hard. What
counts as close is deliberately generous — the point is honesty, not a
confident-looking number.

## What it isn't

A species ID from OpenBat is a suggestion — treat it as a knowledgeable
friend's guess, not a verified record. It can be confidently wrong, particularly
inside a complex.

If one looks wrong, the app keeps a **classifier log**: a diary of every
detection with the scores behind it, no audio and no coordinates, which
Settings → General will hand you as a zip. That log is the most useful thing you
can attach to a report — it shows what the model actually thought, which is
usually more interesting than what it eventually said.
