---
title: OpenBat Species Priors for Location Weighting
description: The short version of how OpenBat uses where you are standing to weight a species identification — the three weights, what they do to a score, and the question they are never allowed to answer.
excerpt: A classifier has no idea where it is. OpenBat gives it one, by weighting every species against the range map for the spot you are standing in — and by being careful about what that weighting is allowed to decide.
date: 2026-09-05
author: Niall Bell
tags:
  - auto-id
  - classifier
  - range-maps
featured: false
publish: true
---

A classifier has no idea where it is. Show one a recording of a bat and it will
happily offer you a species from the other side of the world, because nothing in
the sound says otherwise.

OpenBat gives it that context. This is the short version of one link in the
chain described in [[How OpenBat Decides What It Heard]] — the part where the
app takes where you are standing and turns it into a set of weights.

## The prior

Every species the model can name starts neutral. When the phone has a location
fix, OpenBat looks that spot up in the range grid it ships with — the same grid
behind the maps in [[How OpenBat Draws a Range Map|the field guide]] — and gives
each species one of three weights:

- **1.0** — the species' range covers where you are.
- **0.5** — the grid has nothing to say about this species here.
- **0.01** — you are well outside the species' range.

The model's score for each species is multiplied by its weight, and the results
are scaled back up so they still add to 1. That last step is why the winner's
confidence *rises*: a rival has been ruled out, so what is left divides a whole
between fewer plausible species. Nothing about the sound changed.

## A worked example

Say the model hears one pulse in the UK and reports Daubenton's at 0.38,
Brandt's at 0.23, common pipistrelle at 0.16, Natterer's at 0.11, soprano
pipistrelle at 0.08 and barbastelle at 0.04.

At your location the grid puts every one of those in range except Brandt's,
which gets 0.01, and barbastelle, which has no data there and keeps 0.5.

Multiply, renormalise, and Daubenton's is reported at 0.51. Brandt's has
effectively gone. The model was never more certain than it was a moment ago —
it simply has less competition.

## Three rules that matter more than the arithmetic

**Nothing is ever switched off.** The out-of-range weight is 0.01, not zero.
Bats stray, migrate and shift their ranges, and range maps are drawn from
[patchy records](/blog/how-openbat-draws-a-range-map/). A model that is emphatic
enough about a species can still get it named a long way outside where it is
supposed to be — which is exactly the record you would want to keep.

**"I don't know" is not "not here."** A species with no range data keeps half
weight and stays in the running, and the app says plainly that it is unconfirmed
rather than presenting a guess as a fact.

**The weights never decide whether it was a bat.** That question is settled
first, on the model's own unweighted scores. Only once those say "this is a
real, confidently identified call" do the weights get a say in *which* species
to name. If where you were standing could influence the first question, the app
would be inventing evidence out of your own expectations — you would go looking
for a species, and the app would agree with you.

## What it doesn't fix

Location weighting separates species that don't share a place. It does nothing
for species that do: UK *Myotis*, common versus soprano pipistrelle, Leisler's
versus noctule. Those are flagged as a complex instead, and the honest answer
there stays "one of these".

## Where the location goes

Nowhere. The range grid is bundled with the app, the lookup happens on the
phone, and no coordinate is sent anywhere to produce an identification. A
confidence figure marked *location-weighted* means the weighting was applied on
your device from a fix your device already had. Without a fix, no weighting is
applied at all and you see the model's raw opinion.
