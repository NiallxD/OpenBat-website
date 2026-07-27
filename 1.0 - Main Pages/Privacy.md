---
title: Privacy
description: What data this site and the OpenBat software collect.
permalink: /privacy/
publish: true
---

# How OpenBat protects your privacy

OpenBat is a bat detector. It records ultrasound, works out which species is calling and, if you want, lets you contribute recordings to research.

Recording anything with a microphone raises obvious questions. This page answers them directly.

## Nothing leaves your phone unless you send it

The app records and identifies species entirely on your device. There's no background upload, no sync, no "phoning home."

If you never tap to contribute a recording, we never see it. It stays in your storage and, if you use iCloud, your own iCloud account — which we have no access to.

**There is no automatic upload.** Not a setting that's off by default — no setting at all. The app has no code that can send a recording without you choosing it, one recording at a time.

## What you keep and what you send are different files

When you do contribute, we don't get your recording. The app builds a separate, stripped-down copy and sends that. Your original never leaves the phone and is never altered.

Before that copy is sent, on your phone:

**Every identifier is removed.** No device ID, no account, no name, no filename, no session label. There's no "recordist" field — the app doesn't have one.

**The location is rounded** to a grid of about 100 metres. Everyone in the same square gets the same coordinate.

**The time is rounded** down to the nearest five minutes.

**Human speech is filtered out.** An irreversible filter strips the low frequencies voices occupy. Bats call far above that range, so the calls themselves are untouched — but conversation is gone before the file is sent.

**Everything else is discarded.** Only a short list of scientific fields survives: species, confidence, length, sample rate, microphone model, app version. Anything not on that list is dropped by default, including fields added in future.

**The file gets a random name** that isn't derived from anything, and your phone doesn't keep a copy of it.

## The honest consequence

Because nothing connects a contributed recording to you, nobody can trace one back. That includes us.

Which means: **once you contribute a recording, we can't delete it, because we can't find it.**

That isn't a policy we could choose to relax. There's no hidden lookup table, no internal process, no "ask nicely and we'll check." The information needed to answer *"which of these came from this person"* doesn't exist anywhere.

It's a genuine trade-off and we'd rather you knew about it before you tap than after. The app tells you the same thing on the consent screen.

## Where 100 metres helps, and where it doesn't

We'd rather be straight about this than let a number do work it can't.

In a town, a 100-metre square holds a lot of buildings, plenty of cover. In open countryside it might hold one property, and rounding conceals very little.

If you're recording somewhere you'd rather not have associated even roughly with a contribution, decide before you send it. Everything stays on your phone by default, so there's no rush.

## About other people

Most bat recording happens away from home: footpaths, parks, survey routes. So the location on a contribution usually describes somewhere you were passing, not where you live. Sometimes that's near a house belonging to someone who never agreed to anything.

The speech filter protects them as much as you. A conversation indoors (why are you looking for bats indoors???), or in a garden you walk past, doesn't survive it.

Beyond that, we ask you to use the same judgement you'd apply to any recording made in a public place.

## What we do keep

One thing: a record that your device agreed to contribute.

That's a device identifier the app generates, which version of the terms you agreed to, whether consent is currently on or off, and the date and hour you decided. Not the minute or second, the hour is enough to show you agreed, and being vaguer makes it harder to line up against anything else.

It exists so you can withdraw. It's stored in your phone's secure keychain, stays on that physical device rather than following your Apple account, and is never attached to anything you contribute.

It is not an advertising identifier. There are no advertising networks, no analytics SDKs, and no tracking of any kind in this app.

You can delete that record from Settings whenever you like. It happens immediately, no queue, no review, no email. Your device also gets a fresh identifier, so nothing afterwards connects to it.

We are designing privacy IN, not designing risk OUT.

## What contributions are used for

Building a reference library of bat calls, training species-identification models, and supporting conservation research.

They may be published in open datasets, and may be licensed (this means sold) to ecological consultancies and researchers to help fund the project. Since they contain no personal data, nothing personal appears in anything published, trained on, or licensed.

They're never put on a public live map, and never used or sold for anything unrelated to bats.

## The short version

|                                            |                                    |
| ------------------------------------------ | ---------------------------------- |
| Recordings you don't contribute            | Never leave your phone             |
| Automatic uploads                          | Don't exist                        |
| Identifiers on contributions               | None                               |
| Location on contributions                  | Rounded to ~100 m, always          |
| Time on contributions                      | Rounded to 5 minutes, always       |
| Human speech in contributions              | Filtered out, irreversibly         |
| Can you be identified from a contribution? | No — by us or anyone else          |
| Can we delete a contribution on request?   | No, for the same reason            |
| Personal data we hold                      | A consent record, deletable in-app |
| Trackers, ads, analytics                   | None                               |

## Questions

privacy@openbat.app — that reaches Niall Bell, who created this app and is responsible for privacy at OpenBat (which is just me). Trust me, I went far down this rabbit-hole in order to protect your privacy, it's important to me!

The full [Privacy Policy](https://openbat.app/privacy-policy) has the formal detail, including your legal rights and who hosts the service.