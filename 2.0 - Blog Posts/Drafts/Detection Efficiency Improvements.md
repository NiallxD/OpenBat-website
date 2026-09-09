---
title: Detection Efficiency Improvements
description: One line. Used for the meta description, the social preview, and the card if no excerpt is set.
excerpt: Optional. Two sentences at most — this is the card text on /blog/.
date: 2026-01-01
author: Niall Bell
tags:
  - hardware
  - field-guide
coverImage: /static/images/some-image.webp
featured: false
priority:
publish: false
---
**The problem:** The app was missing a lot of bat calls, and different phones/tablets disagreed on which bat they'd heard

  — the older iPad in particular was basically deaf to fast-calling bats.


  **What they thought was wrong (and wasn't):** At first it looked like the app just couldn't keep up while it was busy

  identifying one call, so it missed the next one arriving. They tried fixing that by letting "listen" and "identify"

  happen at the same time instead of one after another. It made zero difference — a good clue they were solving the

  wrong problem.

  

  **What was actually wrong, found by adding a stopwatch to every step:**

  

  1. After hearing a call, the app paused to grab a bit of trailing audio — but it was pausing for as long as the

     _slowest_ possible detection method needed, even when using a much faster one. Like waiting for the slowest kid in

     class to finish a test before starting the next one, regardless of who's actually taking it. Fixed to wait only as

     long as the method actually in use needs.

  2. The app was also drawing a detailed picture of every single call, even most of the ones nobody would ever look at,

     and that drawing was slow enough to bottleneck everything else. Fixed by only drawing the picture when it's

     actually going to be shown, and by drawing it at half the detail (which turned out to look just as good to the

     eye).

  

  Those two fixes together are what took missed calls from about 68% down to 9%.

  

  **Two more bugs found along the way:**

  

  3. The app judged how "clean" a call looked using a measuring stick that unfairly punished longer calls — so certain

     bat species (the ones with longer calls) basically never got shown, even though they'd been correctly identified.

     Fixed the measuring stick.

  4. The picture shown for a call was cropped too tight, so longer calls got cut off the edge of the image. Fixed to

     size the crop to the actual call.

  5. Separately, the app used to lump several seconds of sound together and report "the bat" based on whatever was heard

     most in that chunk — so on a recording with several bat species mixed in, it would just report whichever one

     happened to get caught most, and that answer could flip between runs even though the audio never changed. Fixed by

     closing out a "listening window" sooner (so different bats don't get blended together), and by having the app say

     "not sure" when two candidates are too close, instead of guessing.