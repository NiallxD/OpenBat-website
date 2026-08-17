---
title: Privacy Policy
description: What data this site and the OpenBat software collect.
permalink: /privacy-policy
publish: true
---
# Privacy Policy

Last revised: 2026-08-07

## The short version

OpenBat records bats and identifies species entirely on your phone. Nothing you record is ever sent to us — there is no account, no upload, and no server of ours that your recordings, location, or audio ever reach.

The app does talk to a few public, third-party reference APIs (species data, images) to help identify what you've recorded. One of those sends your approximate current location as part of a lookup query. None of it is tied to your identity, and none of it is collected or stored by us.

---

## 1. Who we are

OpenBat is developed by **Niall Bell**. OpenBat is not a registered entity.

For privacy questions, contact privacy@openbat.app.

## 2. What stays on your phone

Recordings, sessions, and species identifications are stored locally on your device. Species identification runs entirely on-device — nothing is sent anywhere to work out what you recorded.

**Your location never leaves your phone.** It is used on-device to tag detections, to suggest the right species model for your region, to work out which species are plausible where you are, to name a session after the place it happened, and to calculate your local sunset and sunrise for the detector's sun clock. Earlier versions sent an approximate position to GBIF for that species lookup; that no longer happens — the range data now ships inside the app.

**OpenBat does not record a GPS track.** Sessions used to record a continuous course while detecting. That was removed: each detection already carries a coordinate and a timestamp, so a track can be rebuilt from your own exported data without the app keeping a second, denser record of your movements. The app never requests "Always" location access and never uses location in the background.

If you enable iCloud sync in Settings, your recordings and sessions are backed up to **your own** iCloud account under Apple's terms. We have no access to it.

## 3. What the app sends elsewhere, and why

OpenBat queries a small number of public, third-party reference services to show you information about species — it does not send them anything that identifies you:

| Service | What's sent | Why |
|---|---|---|
| Wikipedia | A species name | To fetch a reference image |
| GitHub | Nothing (static file download) | To fetch the built-in species guide and species range data |

These are ordinary, read-only lookups against public reference data — the same kind of request any app makes to show you information from the internet. No device identifier, account, or recording is ever attached to them, and we don't operate or control these services.

## 4. Newsletter

If you sign up for the OpenBat newsletter, you'll be taken to a Google Form, hosted by Google, outside this site. It asks for your email address only.

Responses go into a Google Sheet in Niall's personal Google Drive — subject to Google's own privacy terms, not ours. Your email is used only to send you the newsletter, is never shared or sold, and you can ask to be removed at any time by emailing privacy@openbat.app.

## 5. What we don't do

- We don't operate a server that receives your recordings, location, or audio.
- We don't have accounts, sign-in, or device identifiers tied to you.
- We don't use analytics, crash reporting, advertising, or tracking SDKs of any kind.
- Outside of the newsletter form above, we don't collect, sell, or share anything.

## 6. Children

OpenBat is not directed at children under 13, and we do not knowingly collect personal data from anyone, regardless of age.

## 7. Changes

If this changes — for example, if a future version of the app adds a way to contribute recordings to research — we'll update this notice first and be explicit about what's new.

---

*Questions: privacy@openbat.app*
