---
title: White-Nose Syndrome
description: The fungus that has killed millions of North American bats — what it is, why waking up too often is fatal, and why it turned bat monitoring from a nice idea into an urgent one.
excerpt: The fungus that has killed millions of North American bats — what it is, why waking up too often is fatal, and why it turned bat monitoring from a nice idea into an urgent one.
date: 2026-08-27
author: Niall Bell
tags:
  - bats
  - conservation
heroImage: /static/images/little_brown_bat_wns.webp
coverImage: /static/images/little_brown_bat_wns.webp
featured: false
publish: true
---

In the winter of 2006, a caver photographed hibernating bats near Albany, New
York, with white fuzz on their muzzles. Within a decade the fungus in that
photograph had killed bats across most of eastern North America and reached the
Pacific coast.

The organism is *Pseudogymnoascus destructans* — cold-loving, and perfectly
suited to a hibernating bat, which spends the winter at cave temperature with
its immune system all but switched off. It grows on exposed skin: muzzle, ears
and the thin membrane of the wings. The white bloom that gave the disease its
name is the least of the problem.

## It kills by arithmetic

The fungus is not a poison. What it does is interrupt a very tight energy
budget.

A hibernating bat has to cross the entire winter on fat it laid down in autumn,
with no possibility of topping up. It doesn't sleep straight through — it
rouses periodically, and each arousal is enormously expensive, burning in a few
hours what torpor would have used over days. A healthy bat can afford a handful
of them.

An infected bat rouses far more often. The infection irritates and damages the
wing membrane, upsets its water balance, and the animal wakes to deal with it,
over and over.

{% chart {
  type: "line",
  key: "WHY WAKING UP TOO OFTEN IS FATAL, EVEN THOUGH THE FUNGUS ITSELF IS NOT",
  yKey: "FAT RESERVE",
  labels: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr"],
  caption: "Illustrative — a drawing of the mechanism rather than measured data. The steps are arousals. Nothing about the fungus needs to be directly lethal for the outcome to be.",
  alt: "A line chart of fat reserve across a winter: a healthy bat's reserve steps down slowly and still has fuel in spring, while an infected bat's steps down far more often and hits empty in late February.",
  height: 380,
  series: [
    { name: "A healthy winter — a bat rouses now and then", data: [100, 92, 85, 76, 66, 57, 44], stepped: true },
    { name: "With the infection — it rouses far more often", data: [100, 80, 58, 36, 14, 0, 0], stepped: true, style: "secondary" }
  ],
  bands: [
    { from: "Mar", to: "Apr", text: "spring — insects return", style: "muted" }
  ],
  callouts: [
    { x: "Dec", y: 92, text: "each step down is one arousal: a few days' worth of fat, spent in hours", style: "muted", arrowTo: { x: "Dec", y: 60 } },
    { x: "Feb", y: 30, text: "reserves gone, weeks before there is anything to eat", arrowTo: { x: "Mar", y: 2 } }
  ]
} %}

The reserve runs out weeks before there is anything to eat. Bats leave the cave
in midwinter looking for insects that don't exist yet — which is why one of the
signs of the disease is bats flying in daylight, in the snow, in February.

## What it has cost

Some hibernation sites lost more than nine bats in ten. The little brown bat,
the northern long-eared bat and the tricolored bat have been hit hardest; total
deaths run into the millions. In Canada, three species were listed as
endangered in 2014 as an emergency response — including the little brown bat,
which had been one of the most common mammals on the continent.

It matters beyond the bats themselves. An insectivorous bat eats a substantial
fraction of its body weight in insects every night, including agricultural
pests, and removing most of them from a landscape is not a neutral event.

## Where it came from, and how it travels

*P. destructans* is native to Eurasia. European bats carry it and mostly
survive — the sign of a long shared history. North American bats had no such
history, which is what a novel pathogen in a naive population looks like.

It almost certainly crossed the Atlantic with people. The fungus persists in
cave sediment, and its spores travel perfectly well on boots, clothing and
caving equipment. It is not a risk to human health, and that is precisely why
the human role is easy to underestimate: you can move it a hundred miles
without being affected by it in the slightest.

Which makes the practical advice unglamorous but real. Observe cave and mine
closures. Decontaminate gear between sites. And don't disturb hibernating bats
— an arousal you cause costs the animal exactly the same fat as one the fungus
causes.

## Why monitoring stopped being optional

Here is the part that connects to everything else on this blog.

A collapse is only visible against a baseline. Where good records existed
before the disease arrived, the decline could be measured, species could be
listed, and protection could follow. Where they didn't, a population can
disappear and leave behind nothing that proves it was ever there.

Most of the world is in the second category. The disease is still spreading,
and every region it has not reached yet is a region where
[[The Gaps in Bat Data|the useful work is happening now]] — recording what is
present, in ordinary places, before anything happens to it. That is the
opposite of dramatic and it is exactly what is needed.

Acoustic monitoring is the practical way to do it at scale: it doesn't require
handling bats, doesn't require entering a roost, and can be done by people who
are not licensed bat workers. A recording from a garden or a woodland edge, with
a date and a location on it, is a small brick in exactly the baseline that
turned out to matter so much in New York.

There is some hope in the story. Certain little brown bat populations are
persisting where they were expected to vanish, and work on treatments continues.
But recovery in a mammal that raises roughly one pup a year is measured in
decades, and it can only be tracked by people who keep looking. If you're
somewhere the disease hasn't arrived, the most valuable thing you can do is
[[Adding a Bat to the Field Guide|write down what's there]] while it still is.

---

**Header Photograph:** U.S. Fish and Wildlife Service Headquarters, Public domain, via Wikimedia Commons