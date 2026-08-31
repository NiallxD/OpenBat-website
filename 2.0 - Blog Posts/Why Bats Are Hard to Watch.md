---
title: Why Bats Are Hard to Watch
description: Bats are all around us and almost nobody has properly seen one. What makes them so difficult to observe, and why a blank night means less than it looks.
excerpt: Bats are all around us and almost nobody has properly seen one. What makes them so difficult to observe — and why a blank night means far less than it looks.
date: 2026-08-27
author: Niall Bell
tags:
  - bats
  - acoustics
heroImage: /static/images/detection-hero.webp
coverImage: /static/images/detection-cover.webp
featured: false
publish: true
---

Bats are one of the most numerous groups of mammals on earth, they live in
almost every landscape people do, and hardly anyone has ever properly watched
one. That isn't for lack of interest. Nearly everything about a bat is arranged
to make it hard to observe.

## They are inaudible

A bat's echolocation sits mostly between 15 and 120 kHz. Human hearing tops out
somewhere around 20 kHz when you're young and drops steadily from there, so
only the very lowest bat calls are ever in reach: a noctule at around 20 kHz
sits right on that edge, where some children hear it and most adults don't. A
common pipistrelle calling at 45 kHz is inaudible to everybody. (The squeaking
you can sometimes hear at a roost is a different thing — social calls, much
lower than the calls the bat navigates with.)

So the first problem is simply that the animal is broadcasting constantly and
you can't hear it. A detector shifts that signal down into your range, which
solves the problem and immediately introduces a new one: the simplest detectors
listen to a narrow slice of frequency at a time, so you have to be tuned near a
species' call before it exists for you at all. Bats you aren't listening for go
past in silence.

## The detector doesn't hear every bat equally

This is the one that surprises people, and it quietly shapes almost every bat
dataset in existence.

A noctule calls loudly, at a low frequency that carries. A brown long-eared bat
whispers — its calls are so faint that it is sometimes called a whispering bat.
Standing in one spot with one detector, you are listening to a different sized
world for each species.

{% chart {
  key: "HOW FAR AWAY A DETECTOR HEARS EACH ONE, IN METRES",
  caption: "Approximate detection distances from survey guidance — the real figure moves with habitat, weather, microphone and how the bat is flying. The ratio is the point: a noctule is audible across a field, a long-eared bat has to be almost overhead.",
  alt: "Bar chart of detection distance for five species, all to the same scale: noctule 100 m, serotine 40 m, common pipistrelle 25 m, Daubenton's 15 m, brown long-eared 6 m.",
  bars: [
    { label: "Noctule (~20 kHz)", value: 100, note: "100 m" },
    { label: "Serotine (~25 kHz)", value: 40, note: "40 m" },
    { label: "Common pipistrelle (~45 kHz)", value: 25, note: "25 m" },
    { label: "Daubenton's (~45 kHz, quieter)", value: 15, note: "15 m" },
    { label: "Brown long-eared (faint, broadband)", value: 6, note: "6 m", highlight: true }
  ]
} %}

A noctule crossing a hundred metres away is on your recording. A long-eared bat
doing exactly the same thing is not — it has to be nearly overhead. An evening's
recording is therefore not a survey of the bats present. It's a survey of the
loud ones, with the quiet ones appearing only when they happen to come close.

Nothing about better equipment fixes this. It is a property of the animals.

## A recording tells you a bat passed, not how many there were

The unit you actually collect is a pass: a burst of calls as an animal crosses
in front of the microphone. One bat hunting back and forth over the same pond
for an hour can produce dozens of them. Two bats crossing once each produce two.

So a night's tally measures *activity*, not abundance, and the two come apart
badly. A busy night and a busy bat look much the same on paper. Anyone
comparing counts between sites is comparing something much slipperier than "how
many bats live here".

## The calls resist identification

Even with a clean recording, there is a ceiling on what a call can tell you.

Species overlap — several *Myotis* species are effectively inseparable on call
shape alone, and common and soprano pipistrelles, or Leisler's bat and noctule,
sit close enough to be regularly confused. And a bat doesn't have one call: the
same animal calls differently in the open than in clutter, changes as it closes
on prey, and produces social calls that look nothing like its search phase.

That means the honest answer is often a genus rather than a species, or a
shortlist rather than a name. It's why OpenBat's identification says which
species it considered, and why it will
[[How OpenBat Decides What It Heard|say it doesn't know]] rather than pick the
best of a bad set.

## They don't turn up on demand

Bats are seasonal, and weather-dependent, and mostly busy in a window after
sunset. Cold, wind or heavy rain can empty a site that was full the week
before. Much of the year they're hibernating or elsewhere entirely.

The consequence is the single most misread result in bat surveying: **a blank
night is not evidence of absence.** It might mean no bats. It might mean cold,
or wind, or the wrong hour, or the wrong ten metres of hedgerow, or a quiet
species you couldn't have heard from where you stood. Recording nothing is a
weak claim, and it needs repeating before it means anything.

## And you must not disturb them

Bats are protected in most countries where anyone is likely to be reading this.
Roosts are generally protected whether or not bats are in them at the time, and
handling bats or inspecting roosts needs training and a licence — the rules
vary, so check what applies where you are.

There is a conservation reason as well as a legal one. Disturbing hibernating
bats can cost them fat reserves they cannot replace mid-winter, and moving
between roosts and caves carries a real risk of spreading disease. This is a
group of animals that is genuinely fragile in the face of curiosity.

Which leaves listening. Standing outside at dusk with a microphone is the one
method that is open to everybody, cannot harm the animals, and produces a record
someone else can check.

## Which is exactly why it's worth doing

Put all of that together and you get the reason bat data is so much thinner than
bird data: the animals are nocturnal, unhearable, unevenly detectable,
uncountable by pass, hard to identify, weather-dependent and legally
off-limits to handle.

It also means the bar for a useful contribution is far lower than people
assume. In much of the world, "a bat was here, on this date, at this time" is
new information. It doesn't need a species name to be worth having, and
[[How OpenBat Draws a Range Map|a map built from records like that]] is what
tells the next person where to look.
