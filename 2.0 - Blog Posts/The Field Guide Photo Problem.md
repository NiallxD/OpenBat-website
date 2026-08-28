---
title: The Field Guide's Photo Problem
description: Every species entry wants a photograph. Bats are nocturnal, hard to photograph, often protected, and the good pictures usually belong to somebody.
excerpt: Every species entry wants a photograph. Bats are nocturnal, hard to photograph, often legally protected — and the good pictures nearly always belong to somebody.
date: 2027-02-06
author: Niall Bell
tags:
  - field-guide
  - dev-log
featured: false
publish: false
---

A field guide entry with no picture feels broken. People scroll past text; they
stop at a face.

Getting those faces is one of the fiddliest jobs in the whole project, and it's
worth explaining why, because "just add a photo" turns out to involve four
separate problems.

## Problem one: bats are awful to photograph

They're nocturnal, small, fast, usually flying, and asleep somewhere
inaccessible the rest of the time.

Which means the good photos of bats almost all come from one of three
situations: an animal in the hand during licensed survey work, a roost
photographed by someone with permission, or a captive or rehabilitating animal.

All three involve people with training and licences. None of them are situations
an enthusiast should be creating in order to get a picture for a field guide.

## Problem two: the licence

A photograph belongs to whoever took it, and using one means having permission —
in a form that's clear, durable, and lets us pass the guide on to other people
under an open licence.

That rules out an enormous amount of what's on the internet. "It was on a search
results page" is not a licence. Even generously shared photos often carry terms
that don't fit an openly licensed dataset.

What works: images published under licences that permit reuse with attribution,
most commonly through Wikimedia Commons, and images donated directly by their
photographers with clear permission. Which is why entries carry credit lines
naming the photographer and the licence — that's not decoration, it's the
condition of use.

## Problem three: identification

Here's the one nobody expects. **A photograph labelled with a species is a
claim, and claims can be wrong.**

Bats are hard to identify from photographs — several species look extremely
similar, and the diagnostic features are often things like ear shape,
tragus shape, or forearm length that a casual photo doesn't show. Plenty of
images online are labelled confidently and incorrectly.

If we take a mislabelled photo and put it in a field guide, we've laundered
somebody's error into something that looks authoritative. Then people learn the
wrong animal, and eventually somebody uploads a misidentified record because our
guide showed them the wrong face.

So a photograph needs checking as carefully as a measurement does, by somebody
who knows the group.

## Problem four: what the photo is doing

A good field guide photo isn't a nice picture of a bat. It shows the features
you'd use to tell this species from its neighbours.

An artistic shot of a bat in flight against a sunset is lovely and nearly
useless. A well-lit, slightly boring image showing the face, ears and wing
membranes is worth ten of them.

That's a different selection criterion than "best photo", and it takes some
discipline to apply, particularly when the beautiful one is right there.

## What we do about it

**Prefer openly licensed images with clear provenance**, credited properly in
the entry.

**Treat the species label as unverified until reviewed**, the same as any other
field in a submission.

**Accept that some entries won't have a photo yet**, rather than filling the gap
with something wrong. An entry with good text and no image is honest. An entry
with a confident picture of the wrong animal is worse than nothing.

**Ask people to donate photos.** This is the one that could genuinely change
things, and it's the ask I'd make of anyone reading who does licensed bat work:
if you have images you'd be willing to license openly, they would be
disproportionately useful. Not to us — to the guide, which anyone can reuse.

> [!note] Why not generate them?
> Because a generated image of a bat is a picture of no bat in particular, and a
> field guide's entire job is to show you the specific animal. It would look
> fine, it would be worthless, and it would quietly destroy the credibility of
> every entry next to it. Same reasoning as [[Why The Field Guide Is Reviewed Not A Wiki|not auto-filling the text]].

If you can help — with photos, with checking labels, or with entries — the
[Contribute](/contribute/) page is the door.

Niall & the OpenBat Team 🙂
