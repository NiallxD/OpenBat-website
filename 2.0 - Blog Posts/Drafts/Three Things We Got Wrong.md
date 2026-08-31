---
title: Three Things We Got Wrong
description: A pulse detector that counted echoes, a tutorial shown at the worst possible moment, and a screen full of numbers nobody needed yet.
excerpt: A pulse detector that counted echoes as extra bats, a tutorial shown at the worst possible moment, and a screen full of numbers nobody needed yet.
date: 2027-01-20
author: Niall Bell
tags:
  - dev-log
featured: false
publish: false
---

Blogs about building things tend to describe the version that worked. Less
useful, and less honest, than describing the versions that didn't.

Here are three mistakes that shaped OpenBat, all of which seemed perfectly
reasonable at the time.

## 1. The detector counted the echoes

The pulse detector's job is to notice when a call happens. Early on, it noticed
rather too much.

Two separate problems, pulling in opposite directions.

**Echoes arriving as extra bats.** A bat calls, and a few milliseconds later
that call comes back off a wall, a tree, or the ground. To a detector watching
for loud, high-pitched sounds, that echo looks like another call. So a single
pass would log a suspiciously large number of detections, and busy-looking
nights turned out to be one bat next to a fence.

The fix is a hold-off: after triggering, ignore anything for a short window. The
number matters, and it fails in both directions — too short and the echoes come
back, too long and you drop real calls, because bats call several times a second.

The first value was 150 ms, chosen by reasoning rather than measurement. Then a
night of field recordings got checked properly, and the median gap between
genuine calls turned out to be about **79 ms** — so the setting had been silently
throwing away more than half of every normal pass, starving both the pulse-rate
readout and the classifier. It went to 50 ms, and a later night of tuning took it
to 30 ms, where amplitude does the rest of the work: an echo comes back much
quieter than the call that made it.

**One call arriving as three.** The opposite failure, and more embarrassing. FM
calls have quiet moments in the middle — the amplitude dips partway through the
sweep. The detector saw loud, quiet, loud, quiet, loud, and dutifully logged
three calls.

The fix is a tolerance: quiet patches shorter than a few milliseconds stay part
of the same call.

The lesson underneath both: **the thresholds that matter came from measuring real
recordings, not from reasoning about what ought to work.** That's a habit now —
the shipped defaults were re-based wholesale after one night in the field, with
the settings dumped to a file and the differences folded back into the code, so a
fresh install starts where that evening finished rather than at somebody's
original estimate.

Every one of those numbers is still adjustable in the app, because the right
value on a windy clifftop isn't the right value in a wood.

## 2. We explained echolocation before anyone had heard a bat

The app used to include a proper explanation up front: what echolocation is, what
the listening modes do to the sound, why calibrating the microphone matters. Good
material, carefully written.

It was shown during setup. Before the microphone was plugged in. Before the user
had heard anything.

Nobody read it, and I don't blame them. At that moment the user has one question
— *does this work?* — and answering a different question, however well, is just
an obstacle between them and the thing they came for.

So it moved. There are now two tours, both available from an **Info & Tour**
screen rather than shoved in front of you: a guided one that dims the screen and
points at one control at a time *on your own detector, with your own audio
running*, and a reading one for the concepts.

Same content. Massively more useful, because it arrives when there's something to
attach it to. The guided tour is also offered by a small button that appears
shortly after your first run and then waits patiently until you've been through
it.

**The lesson**: explanation is only valuable when the reader already has the
question. Front-loading it feels thorough and behaves like an obstacle.

## 3. We showed everyone the cockpit

The detector screen can display a lot: peak frequency, bandwidth, duration,
pulse rate, a zoomable close-up of the pulse, timeline controls, palette
controls, frequency band controls, draggable history.

All of that is genuinely useful. It is also, on your first night, in the dark,
slightly cold, waiting for a bat, completely overwhelming.

So there's now a **simplified view** by default: species identified, input level,
spectrogram. That's most of what a first night needs and it stays readable when
you're outside and your hands are cold. **Advanced mode** is one switch away, you
get asked which you'd prefer during setup, and switching keeps everything you've
adjusted.

What surprised me was that experienced users use simplified mode too — not
because they can't handle the numbers, but because on a walk, most of the time,
they don't want them.

**The lesson**: showing everything you built is a form of laziness dressed up as
generosity. Deciding what someone needs *right now* is the actual work.

## The common thread

All three mistakes are the same mistake wearing different hats: building for the
person who already understands the thing.

That person — me, in each case — knows what an echo looks like, wants the
explanation up front, and can read a screen full of numbers at a glance. They're
also the one user who didn't need the app built carefully, because they'd have
managed either way.

The fixes weren't clever. They were mostly *removing* things, or moving them
somewhere they'd be wanted later. Which is, I suspect, what most product work
actually is once the exciting bit is finished.

> [!note] Still on the list
> None of this is finished. If something in the app makes no sense to you, that's
> useful information and I'd genuinely like to hear it — [get in
> touch](/contact/). "I couldn't work out what this screen was for" is one of the
> most valuable messages we get.

Niall & the OpenBat Team 🙂
