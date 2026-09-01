---
title: Adding a Bat to the Field Guide
description: The field guide inside OpenBat is written by the people who use it. Here is what an entry holds, how to add one without touching any code, and what happens after you press submit.
excerpt: The field guide inside OpenBat is written by the people who use it — here is what an entry holds, how to add one without touching any code, and what happens after you press submit.
date: 2026-08-27
author: Niall Bell
tags:
  - field-guide
  - contributing
heroImage: /static/images/field-guide-hero.webp
coverImage: /static/images/field-guide-hero.webp
featured: false
publish: true
---

There are more than 1,400 bat species in the world. OpenBat's field guide
currently describes nineteen of them, across twenty-one regions.

That gap is not going to be closed by the people who build the app. It closes
one entry at a time, written by people who already know a bat well — the
species you survey every summer, the one whose calls you can pick out of a
recording by eye, the one nobody has written up properly.

This is how to add one.

## What an entry is

Every species in the guide is one record with four required fields: an id, a
common name, a scientific name, and the regions it lives in. Everything else is
optional, and the editor tells you how much of each section you have filled in
as you go.

<figure>
  <a href="/static/images/guide-editor-entry.webp"><img src="/static/images/guide-editor-entry.webp" alt="The field guide editor with the pallid bat open, every section collapsed: identity, regions, summary, photo, measurements, morphology, echolocation, conservation, habits, references, contributors and submit for review, each with a chip showing how many of its fields are filled in." loading="lazy"></a>
  <figcaption>One entry, open in the editor with its sections closed. Each chip says how much of that section is filled in — and this bat still has no photo. Contributors is where you add your name; submit is the last step.</figcaption>
</figure>

The app only draws a section if there is something to put in it, so a
half-filled entry renders as a shorter page rather than a page of empty boxes.
That matters more than it sounds: **you do not have to know everything about a
bat to contribute to its entry.** If all you have is a set of echolocation
parameters you trust, add those. If all you have is a good photograph and its
licence, add that. Someone else fills in the roosting behaviour next month.

The parts that tend to be missing, and are worth the most:

- **Echolocation** — call type, peak and characteristic frequency, duration,
  and free-text notes on what it's confusable with. This is the section people
  in the field actually read.
- **A real photograph.** An entry without one falls back to a live Wikipedia
  lookup, which can return the wrong species or nothing at all. A proper
  `imageURL` fixes that for good.
- **References.** What you'd hand someone who asked "how do you know that?"
- **Regional detail** — local conservation status, habits that differ from the
  textbook description of the species elsewhere.

## The editor

The easiest way in is the [[Guide Editor|field guide editor]] on this site. It
loads the current guide, gives you ordinary form fields, and writes the file
correctly for you.

1. Find your species, or add a new one.
2. Fill in what you know.
3. Put your name under Contributors.
4. Submit.

<figure>
  <a href="/static/images/guide-editor-list.webp"><img src="/static/images/guide-editor-list.webp" alt="The editor's species list: a header showing the guide was loaded from GitHub with 19 species and 21 regions, a search box, an add-a-new-species button, and rows of bats — some marked with an orange dot — with their scientific names and region counts." loading="lazy"></a>
  <figcaption>The guide is fetched live when the page opens, so you are always editing the current version. An orange dot marks an entry with fields still empty, which is as good a shortlist as any of where to start.</figcaption>
</figure>

**No GitHub account, and no JSON.** The editor also keeps a local draft as you
type, so a closed tab or a flat battery doesn't cost you an evening's writing.
That draft lives on your own device, is offered back rather than silently
reapplied, and is cleared when you submit.

## What happens after you press submit

<figure>
  <a href="/static/images/guide-journey.webp"><img src="/static/images/guide-journey.webp" alt="Five steps: you fill in the form, a pull request is opened for you, automatic checks run, a person reviews it, and once merged every app picks it up at next launch." loading="lazy"></a>
  <figcaption>Nothing you submit is applied straight to the guide. The review is the gate.</figcaption>
</figure>

Your submission becomes a pull request on the field guide repository, opened on
your behalf. When you click submit, some automated checks run first, to catch and major errors: the required fields are there, the regions you picked exist, an image has a credit with it, links are sound. Then it heads off to the OpenBat team to review. 

> We rely on the community to make this field guide what it is. From time to time we may tweak an entry, or reject it altogether. In the spirit of good privacy we don't collect your contact details so we can't let you know, but we will add a comment to the pull request on GitHub. If we make a tweak (typo) we will add a note to the contribution comment. If you notice your change didn't go live, [get in touch!](mailto:hello@openbat.app).

Once it's merged, every copy of the app picks it up the next time it launches.
No app update, no waiting for a release — the guide is downloaded, not built in.

## Two rules worth reading first

Both exist so that everything in the guide can be passed on to the next person
who wants to use it.

**Photographs must be Creative Commons or public domain**, with the credit the
licence asks for. Wikimedia Commons is the easiest source — the licence and the
exact attribution are written on each file's page. Link the image file itself
rather than the page it sits on, and set the credit whenever you set an image.
Not a photo from a search engine, a stock site, or social media unless it
carries a clear licence of its own.

**Write in your own words.** Read your sources, then write the entry from what
you learned rather than from the source's sentences. Cite what you used in
`references` — that's what the field is for, and it's expected either way — but
a citation says where a fact came from; it isn't permission to reuse the prose
that stated it. Technical terms and measurements are obviously exempt: "peak
frequency ~55 kHz" reads the same however it's written.

## Your name stays on it

Every entry carries a list of contributors, shown on the species page in the
app. The first name is the person who created it; everyone who edits it
afterwards is added below.

That list can only be added to. An edit that rewrites, reorders or removes
someone else's credit is rejected automatically, because those entries are a
record of other people's work.

## The licence

The guide data is published under **CC BY-NC 4.0**: anyone may reuse it,
non-commercially, with credit. Commercial reuse needs permission. By submitting
an entry you're releasing your contribution under the same terms — which is
what makes it usable by everyone who installs the app, and by researchers and
other projects afterwards.

## Where to start

Two good first contributions, and neither of them is a big job.

**Add a bat that lives near you.** If a species isn't in the guide at all, it is
invisible — nobody can correct it, illustrate it or argue with it. Getting it
onto the list is the contribution. A name, a scientific name and the regions it
lives in is a real entry, and everything after that can arrive later, from you
or from someone else.

**Or fill a gap in one that's already there.** Open [[Guide Editor|the editor]],
look for the orange dots, and add the one thing missing from a bat you know —
a photo with its credit, a set of echolocation parameters, a reference, a local
status that differs from the textbook.

If you'd rather work in the file directly, the guide and a full description of
every field live in the
[field guide repository](https://github.com/NiallxD/OpenBat-FieldGuide), and
pull requests are welcome there too.

So that's it! That's all there is to it! The OpenBat team are excited to see all the contributions from passionate folk around the world.