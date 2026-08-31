---
title: What a Bird App Taught Us About Bats
description: The closest thing to OpenBat is not another bat project. It is Merlin Bird ID, and the way it quietly turned curious people into contributors.
excerpt: The closest model for OpenBat is not another bat project at all. It is a bird app — and the way it quietly turned curious people into contributors.
date: 2026-10-30
author: Niall Bell
tags:
  - project
  - community-science
featured: false
publish: false
---

When people ask what OpenBat is like, they usually expect me to name another bat
project. The honest answer is a bird app.

**Merlin Bird ID**, run by the Cornell Lab of Ornithology, is a free app that
tells you what bird you're looking at or listening to. It's beautifully made,
enormously popular, and completely unintimidating. And sitting behind it is
**eBird**, a serious scientific platform holding hundreds of millions of bird
records that researchers genuinely use.

The clever part is the relationship between the two. Merlin doesn't ask you to
care about science. It asks you to be curious about the bird in your garden. Some
proportion of people who arrive for that end up, months later, submitting
structured checklists to a global monitoring dataset without ever having decided
to become a citizen scientist.

That's the trick we're trying to learn.

## Three things it gets right

**The top of the funnel is genuinely free and genuinely fun.** No account
required to get value, no tutorial about data standards, no guilt. You point it
at a bird and it tells you. If you never do anything else, fine — you had a nice
moment and you liked a bird a bit more than before.

**The step up is small and optional.** Nobody is asked to become a volunteer.
They're offered a slightly more structured version of what they were already
doing, at the moment they're already interested.

**The serious platform stayed serious.** eBird didn't get dumbed down to
accommodate beginners. It kept its standards, and the easy app fed it rather
than diluting it.

<figure class="chart">
  <svg viewBox="0 0 640 220" role="img" aria-label="A comparison: Merlin feeds eBird for birds; OpenBat feeds iNaturalist and GBIF for bats.">
    <g class="chart-label">
      <rect x="20" y="30" width="180" height="60" rx="8" style="fill: var(--color-accent); opacity: 0.85"></rect>
      <text x="110" y="56" text-anchor="middle" style="fill: #111; font-weight: 700">Merlin Bird ID</text>
      <text x="110" y="76" text-anchor="middle" class="chart-label--small" style="fill: #111">easy, free, delightful</text>
      <rect x="300" y="30" width="180" height="60" rx="8" style="fill: var(--color-surface); stroke: var(--color-border)"></rect>
      <text x="390" y="56" text-anchor="middle" style="fill: var(--color-text); font-weight: 700">eBird</text>
      <text x="390" y="76" text-anchor="middle" class="chart-label--small" style="fill: var(--color-secondary)">serious, structured, huge</text>
      <rect x="20" y="130" width="180" height="60" rx="8" style="fill: var(--color-accent); opacity: 0.85"></rect>
      <text x="110" y="156" text-anchor="middle" style="fill: #111; font-weight: 700">OpenBat</text>
      <text x="110" y="176" text-anchor="middle" class="chart-label--small" style="fill: #111">easy, free, a bit weirder</text>
      <rect x="300" y="130" width="290" height="60" rx="8" style="fill: var(--color-surface); stroke: var(--color-border)"></rect>
      <text x="445" y="156" text-anchor="middle" style="fill: var(--color-text); font-weight: 700">iNaturalist → GBIF</text>
      <text x="445" y="176" text-anchor="middle" class="chart-label--small" style="fill: var(--color-secondary)">serious, structured, already exists</text>
    </g>
    <g style="stroke: var(--color-secondary)" stroke-width="2" fill="none">
      <path d="M204 60 L 294 60"></path>
      <path d="M204 160 L 294 160"></path>
    </g>
    <text x="249" y="52" text-anchor="middle" class="chart-label--small" style="fill: var(--color-muted)">feeds</text>
    <text x="249" y="152" text-anchor="middle" class="chart-label--small" style="fill: var(--color-muted)">feeds</text>
  </svg>
  <figcaption>Same structural position, different animal, and one crucial difference — see below.</figcaption>
</figure>

## Where the comparison breaks down

Three ways bats are harder, and one way they're easier.

**Harder: you need hardware.** Merlin needs a phone you already own. OpenBat
needs an ultrasonic microphone, because your phone's built-in mic physically
cannot hear the thing you're trying to hear. That's a genuine barrier and it
sits right in the middle of the funnel. It's also why we care so much about
cheap open microphone designs rather than selling our own.

**Harder: identification is less resolvable.** A good photo usually settles a
bird. A good recording often *cannot* settle a bat, because several groups
overlap in call structure to the point where nobody can separate them by sound.
An app that pretends otherwise is lying.

**Harder: fewer people are watching.** Birding has millions of participants and
a deep bench of experts. Bat acoustics has a much smaller community, which means
slower identification and fewer people to catch mistakes.

**Easier: the data is worth more.** Bird records are dense in most populated
regions; one more sighting of a common bird adds little. Bat records are
sparse almost everywhere, so
[[Why Presence Data Counts|the same marginal record moves the needle much further]].
We start from a lower baseline, which is depressing as a conservation fact and
encouraging as a project rationale.

## What we're stealing, specifically

- **Don't ask for commitment up front.** No account, no sign-up, no explanation
  of why data matters before you've heard a single bat.
- **Put the wonder first.** The moment that converts people is hearing a bat go
  over, not reading about data deficiency.
- **Don't build a new science platform.** iNaturalist and GBIF exist, work, and
  have credibility we could never manufacture. Be the on-ramp, not the
  motorway.
- **Make the contribution step almost boringly easy**, and let people do it when
  they're ready rather than when we'd like them to.

## What we're not stealing

Cornell has a research lab, decades of history, and a lot of staff. We have a
handful of people and evenings.

So we're not attempting global coverage on day one, we're not building our own
data platform, and we're not promising an identification for every recording.
The shape is the same. The scale, honestly, is not — and the projects that get
into trouble are usually the ones that copy the ambition without noticing the
institution underneath it.

Niall & the OpenBat Team 🙂
