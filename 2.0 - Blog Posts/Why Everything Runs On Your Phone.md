---
title: Why Everything Runs on Your Phone
description: Detection and identification never touch the network. That decision costs us real features, and it is still the right one for a device you take into a dark valley.
excerpt: Detection and identification never touch the network. That choice costs real features — and it is still right for a device you carry into a valley with no signal.
date: 2026-10-06
author: Niall Bell
tags:
  - dev-log
  - privacy
featured: false
publish: false
---

Every identification OpenBat makes happens on the phone in your hand. No audio,
no location and no detection is sent anywhere to produce one. There is no server
in that loop, no account, and nothing to sign into.

In fact, as the app stands today, there is no way for a recording to leave your
phone at all except by you sharing it yourself. That's worth explaining
properly, because the machinery to do it exists and is switched off — which is a
more interesting state of affairs than either "we don't do that" or "we do".

That sounds like a privacy stance, and it is one, but privacy wasn't actually
the first reason. The first reason was much more boring.

## Bats live where the signal doesn't

Think about where you go to hear bats. A river valley. A woodland edge. A field
at the end of a track. The bottom of a canyon. It is genuinely remarkable how
reliably the good bat spots and the no-signal spots are the same spots.

An app that needs to phone a server to tell you what you just heard is an app
that stops working exactly where you'd want it most. That's not a
degraded experience, it's a broken product.

So the decision made itself: whatever the app does, it has to do it with the
network turned off entirely.

<figure class="chart">
  <svg viewBox="0 0 640 250" role="img" aria-label="Two designs compared. A cloud design sends audio to a server and back. The on-device design keeps everything on the phone.">
    <text x="10" y="26" class="chart-key" style="fill: var(--color-muted)">THE USUAL WAY</text>
    <g class="chart-label">
      <rect x="10" y="40" width="120" height="50" rx="8" style="fill: var(--color-surface); stroke: var(--color-border)"></rect>
      <text x="70" y="70" text-anchor="middle" style="fill: var(--color-secondary)">your phone</text>
      <rect x="250" y="40" width="120" height="50" rx="8" style="fill: var(--color-surface); stroke: var(--color-border)"></rect>
      <text x="310" y="70" text-anchor="middle" style="fill: var(--color-secondary)">a server</text>
      <rect x="490" y="40" width="140" height="50" rx="8" style="fill: var(--color-surface); stroke: var(--color-border)"></rect>
      <text x="560" y="70" text-anchor="middle" style="fill: var(--color-secondary)">an answer, eventually</text>
      <text x="190" y="60" text-anchor="middle" class="chart-label--small" style="fill: var(--color-muted)">uploads your</text>
      <text x="190" y="76" text-anchor="middle" class="chart-label--small" style="fill: var(--color-muted)">audio and location</text>
      <text x="430" y="68" text-anchor="middle" class="chart-label--small" style="fill: var(--color-muted)">…if you have signal</text>
    </g>
    <g style="stroke: var(--color-border)" stroke-width="2" fill="none">
      <path d="M132 65 L 246 65"></path><path d="M372 65 L 486 65"></path>
    </g>
    <text x="10" y="150" class="chart-key" style="fill: var(--color-accent)">OPENBAT</text>
    <rect x="10" y="164" width="620" height="66" rx="8" style="fill: var(--color-accent); opacity: 0.18; stroke: var(--color-accent)"></rect>
    <text x="320" y="192" text-anchor="middle" class="chart-label" style="fill: var(--color-text); font-weight: 700">your phone: microphone → detection → model → answer</text>
    <text x="320" y="214" text-anchor="middle" class="chart-label chart-label--small" style="fill: var(--color-secondary)">no upload, no account, no signal required, no waiting</text>
  </svg>
  <figcaption>The right-hand end of the first diagram is where most apps quietly fail you. The second one has no such end.</figcaption>
</figure>

## What we gave up

I want to be straight about the costs, because "on-device" gets talked about
like it's free and it isn't.

**The models have to be small enough to ship.** A model that lives on a server
can be as enormous as you can afford to run. One that lives in your pocket has
to fit in the app, load quickly, and run on a phone battery without cooking it.
That constrains which models we can use.

**We can't improve it behind your back.** A cloud classifier can be swapped out
on a Tuesday afternoon and everyone gets the better version instantly. Ours
improves when you update the app, and not before.

**We learn nothing from your recordings.** Cloud apps improve by quietly
accumulating everything their users record. Nothing here is collected in the
background, and at present nothing can be collected at all. Every improvement has
to come from published research and from recordings people deliberately choose to
share. That's slower, and it's the trade I'd make every time.

**No sync.** Your recordings live on your phone, in a folder you can open in
the Files app. There's no magic backup. Export the ones you care about.

## What we got

**It works everywhere.** Airplane mode, dead zone, foreign country, basement —
identical behaviour.

**It's instant.** No round trip means the name appears a second or two after the
bat, while you're still looking up. That immediacy is most of the magic, and a
three-second network delay would kill it.

**It costs nothing to run**, which is why the app can be free without a business
model lurking behind it. There are no servers to pay for, so there's no pressure
to eventually charge you or sell something.

**There's nothing to leak.** No background collection, no location history, no
account database, no recordings arriving unasked — and today, no live address for
any of them to arrive at. The safest way to protect data is not to hold it in the
first place.

## The upload that's built and turned off

Eventually there should be a way to contribute a recording to a shared library
for researchers. That whole pipeline is written. It is also, in the version you
can install, **disabled** — the toggle in Settings is greyed out with a note
saying there's no project running yet, and the addresses it would talk to are
empty strings. Not "we don't currently collect anything". There is nowhere for it
to send anything to.

That's a deliberate way round. Building the privacy machinery first and switching
the feature on later is much safer than shipping a feature and retrofitting the
protections, and it means the design can be described now, before anyone's data
is involved:

- **Nothing would upload on its own.** A deliberate tap, every time; a retry only
  re-attempts what you already asked to send.
- **Identification runs first, on the raw audio.** The filtering below would
  weaken an ID, so it only ever happens afterwards, to a copy.
- **That copy is high-pass filtered**, cutting the low frequencies where audible
  human speech would sit. Bat calls are far above it; a conversation nearby is
  not.
- **The coordinate is fuzzed** to a coarser area, so a recording can't be traced
  to your specific garden.
- **Identifying metadata is stripped on an allowlist**, not a blocklist — so the
  failure mode of forgetting a field is a missing field, rather than one that
  quietly gets sent.
- **The file on your phone is never touched.** All of it happens to a derived
  copy.
- **Consent is versioned**, so changed wording means being asked again rather
  than carried forward onto text you never saw. Erasure mints a fresh device
  identifier, so nothing later can be linked back to what was erased.

Audio in that path would be FLAC — compressed, but losslessly, so every original
bit comes back.
[[What 384 Kilohertz Actually Means|Lossy formats appear nowhere in it]], because
what they discard is chosen for human ears and might be exactly what an
identification needs.

Until a project exists to receive them, though, your recordings go precisely as
far as you personally carry them.

## The bit that surprised me

I expected on-device to be a compromise — the version you accept because you
can't afford servers. In practice it's made the app better in ways I didn't
predict.

When identification can't call a server, there's no "we'll fix it in the
backend" — it has to be right in the thing you shipped. When there's no account,
there's no onboarding funnel, no password reset, no support inbox full of login
problems. And confining the whole upload question to one opt-in feature means
there's exactly one place where privacy questions arise, rather than them being
smeared across everything the app does.

The whole app got simpler by removing the option to be complicated. Turns out
constraints are quite good for you.

Niall & the OpenBat Team 🙂
