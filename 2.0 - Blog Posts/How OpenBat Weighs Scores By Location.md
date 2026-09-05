---
title: How OpenBat Weighs Scores By Location
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

As briefly discussed in [[The Models OpenBat Uses]], autoID models, aka classifiers, do not know where they are. This is important because not all the species a model can classify will be found in every area of its region. Show a classifier for North America a recording of a bat from the UK and it will happily offer you a species ID. It just doesn’t know that all of its classifiers, species, are not feasible.

OpenBat gives the classifiers that context. This a short version of species priors covered, in detail, in the post [[How OpenBat Decides What It Heard]].

## The priors

Each species the classifier can name starts neutral. This means all species are equally likely. Once the phone receives a location fix, OpenBat compares your location with known range maps for each species in classifiers list to see which ones are actually found where you are. This is the same range map found in [[How OpenBat Draws a Range Map|the field guide]] and gives
each species one of three weights:

- **1.0** - The species has been recorded where you are right now.
- **0.5** - The species has not been observed where you are right now, but has nearby.
- **0.01** - The species has not been recoded anywhere near where you are right now.

When the classifier is passed a bat pulse, it assigns it a probability for each species in its classifier list. This means every pulse is given a score for every species it knows. These scores all add up to 1 and are known as the raw scores.

Each species’ score is then multiplied by the weight given to it. A weight of 1.0 makes no difference, 0.5 reduces it by half, and 0.1 pulls the score down to near-zero. The weighted scores are then normalised so that they sum to 1, or 100%. This normalisation has the effect of increasing some scores because rival species are effectively removed from the equation so each remaining species takes a larger share of the percentage.

## A worked example

Say the classifier hears one pulse in the UK and reports Daubenton's at 0.38,
Brandt's at 0.23, common pipistrelle at 0.16, Natterer's at 0.11, soprano
pipistrelle at 0.08 and barbastelle at 0.04.

At your location the grid puts every one of those in range except Brandt's,
which gets 0.01, and barbastelle, which has no data there and keeps 0.5.

Multiply, renormalise, and Daubenton's is reported at 0.51. Brandt's has
effectively gone. The model was never more certain than it was a moment ago, it simply has less competition.

## Three rules that matter more than the arithmetic

**Nothing is ever switched off.** The out-of-range weight is 0.01, not zero. Bats stray, migrate and shift their ranges, and range maps are drawn from [patchy records](/blog/how-openbat-draws-a-range-map/). A model that is confident enough about a species can still get it named a long way outside where it is supposed to be, which is exactly the record you would want to keep.

**"I don't know" is not "not here."** A species with no range data keeps half weight and stays in the running, and the app says plainly that it is unconfirmed rather than presenting a guess as a fact.

**The weights never decide whether it was a bat.** That question is settled first, on the model's own unweighted scores. Only once those say "this is a real, confidently identified call" do the weights get a say in *which* species to name.

## What it doesn't fix

Location weighting separates species that don't share a place. It does nothing for species that do: UK *Myotis*, common versus soprano pipistrelle, Leisler's versus noctule. Those are flagged as a complex instead, and the honest answer there stays "one of these".

## Where the location goes

Nowhere. The range grid is bundled with the app, the lookup happens on the phone, and no coordinate is sent anywhere to produce an identification. A confidence figure marked *location-weighted* means the weighting was applied on your device from a fix your device already had. Without a fix, no weighting is applied at all and you see the model's raw opinion.
