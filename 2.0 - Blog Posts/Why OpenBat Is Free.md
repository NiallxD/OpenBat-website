---
title: Why OpenBat Is Free, and How That Stays True
description: There is no business model, no investor, and no plan to add one. Here is what actually pays for this, and what would have to change before anything did.
excerpt: There is no business model, no investor and no plan to add one. Here is what actually pays for this, and what would have to change before that did.
date: 2026-12-08
author: Niall Bell
tags:
  - project
  - dev-log
featured: false
publish: false
---

Free apps make people suspicious, and they're right to be. The usual answers are "we sell your data", "we'll charge later", or "an investor is funding growth until they need a return". All three eventually change the product.

So here's the honest accounting for OpenBat.

## What it costs to run

Almost nothing, and that's by design.

**Nothing the app does for you needs a server.** Detection, identification, recording, measurement — all of it happens on your phone. There's no per-user compute bill, no account database, and an extra thousand users who never contribute a recording cost us essentially nothing.

**There's no data pipeline either.** We don't collect anything in the background. No analytics service, no crash aggregator watching your usage, no infrastructure sitting between you and the bats. There is a contribution feature written and waiting for a project to contribute *to*, and until there is one it's switched off with nothing behind it — so it costs nothing to run as well.

**The models are somebody else's work**, published openly. We didn't fund the research and we don't pay to use it.

**The website is static files.** It's a folder of HTML on free hosting.

What's left is a developer account, a domain, and time. The time is the real cost, and it's a donation on my part to the project.

## Why free matters more than it looks

The whole project depends on people trying it who weren't looking for it.

Somebody hears about bats, wonders idly whether they could listen to some, and downloads an app. That person is not going to weigh up a purchase, read reviews, or think about whether they're "into" this. A price at that moment — any price — converts a five-second impulse into a decision, and most people don't make the decision.

Then the funnel goes: curious download → hears a bat → gets interested → contributes a record. Charge at the top and you don't get a smaller version of that funnel. You get almost none of it, because the people it's designed for haven't decided they care yet.

The microphone is already a barrier, and a real one. Adding a second barrier in front of it would be daft.

## What we won't do

Worth writing down in public so it can be held against us:

**We won't sell data.** There isn't any to sell — recordings and location stay on your device — and building a collection in order to sell it would betray the entire premise.

**We won't put identification behind a paywall.** That's the capability that makes the app worth having, and paywalling it would reinvent exactly the barrier the project exists to remove. We can't even do this if we wanted to, licensing agreements forbid it.

One of the identification models the app ships, BatDetect2, is licensed for **non-commercial use only**. Charging for the app, or bolting on a subscription or in-app purchase, would breach that licence. So the app cannot be monetised while it uses that model — not "we've decided not to", *cannot*.

That constraint was chosen deliberately, incidentally. An alternative model was considered and rejected on licensing, and the licence we accepted instead is the one that forecloses charging. Given the choice between a business model and the model that identifies bats, the bats won.

**We won't add tracking.** No analytics, no cookies on the site, no "anonymous usage statistics" that turn out not to be.

**We won't lock your recordings in.** Plain WAV, standard metadata, in a folder you can open. If you leave, your data leaves with you.

This is the **Open** in OpenBat.

## What might change, honestly

I'm not going to promise that nothing ever costs anything, because I don't know what the next five years look like. So here's the shape of what could plausibly change, and what wouldn't.

**Things that might one day need funding:** an Android version, a serious expansion of guide coverage with paid review capacity, or hosting if a future feature genuinely requires a server — the iNaturalist submission helper is the one candidate there, and even that we're trying to build without holding anything.

**Where that funding would come from, in order of preference:** grants, institutional partnership, or donations. All three are compatible with the app staying free and untracked. An investor expecting a return on user growth is not, which is why that route isn't on the list.

**What would stay true regardless:** on-device processing, no tracking, open data, standard file formats, and the app itself free to download and use.

## The insurance policy

Here's the part that makes all of the above less dependent on my good intentions.

The field guide data is openly licensed and lives in a public repository. The models are published research. The hardware design is open. The output format is a standard the bat world already uses.

If I got hit by a bus, or lost interest, or turned out to be a wrong'un, none of that would be locked up with me. Somebody else could pick up the pieces and carry on — and your recordings, sitting in plain WAV files on your own phone, wouldn't care either way.

That's a better guarantee than any promise I could make in a blog post, which is precisely why it was built that way.

> [!note] The one thing that isn't free
> The microphone. We don't make it, don't sell it, and don't take a cut of
> anyone who does. It's around thirty dollars if you or a friend can solder, more
> if you'd rather buy one built. That's the honest total cost of getting into
> this hobby.

Niall & the OpenBat Team 🙂
