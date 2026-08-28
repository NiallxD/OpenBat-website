---
title: Build Your Own Bat Microphone
description: The Griff Mini is an open-source 384 kHz ultrasonic microphone you can build for about $28. Here is what to order, what it costs, and what building one involves.
excerpt: The Griff Mini is an open-source 384 kHz ultrasonic microphone you can build for about $28 a unit. Here is what to order, what it costs, and what building one involves.
date: 2026-08-27
author: Niall Bell
tags:
  - hardware
  - griff
heroImage: /static/images/griff-hero.webp
coverImage: /static/images/griff-cover.webp
featured: false
publish: true
---

OpenBat needs an ultrasonic microphone. Your phone's own mic stops at around 24 kHz and almost every bat call happens above that, so without one there is nothing to hear.

The cheapest way in by a wide margin is to build one. The **[Griff Mini](https://www.pippyg.com/griff.html)**, designed by Phil Atkin, is an open-source 384 kHz USB microphone that costs around **$20 a unit in parts**, against several hundred for a commercial detector. It plugs straight into a phone and OpenBat treats it as a normal USB microphone.

Every price below is in Canadian dollars, and assumes a batch of five — which is the sensible number to make, for reasons the table makes obvious.

> [!tip] Part of a bat or nature group? Build a batch.
> The boards arrive in fives, the hotplate and stencil get bought once, and the whole thing takes an afternoon. Five people splitting one order each go home with a working detector for under $30 — and the group keeps the kit for the next five people who want one.

This is a summary of Phil's own instructions, not a replacement for them. **[The Griff Mini project page on PCBWay](https://www.pcbway.com/project/shareproject/Griff_Mini_d4d7cbaa.html)** is the authoritative source, I'm just repeating them here in case anyone landed on OpenBat trying to learn about detectors.

One thing about the photo at the top: that green case is a 3D print of our own and **not part of the build**. Nothing below needs it, and none of the prices include it. A finished Griff is a bare board that works perfectly well as it is.

## Before you start: this is a surface-mount build

Be honest with yourself about this bit. The Griff Mini is not a solder-a-few-wires kit. It is a small board of surface-mount components, including a MEMS microphone a couple of millimetres across, and the intended method is:

1. Lay solder paste through a stencil.
2. Place the components with tweezers.
3. Reflow the whole board on a hotplate.

Phil reckons **about four minutes of paste and placement, then four minutes on the hotplate**, per board, and there's [a video of him doing it](https://www.youtube.com/watch?v=qv38JZPgvKo). That speed assumes you already own a hotplate and have done this before.

If you haven't, it is a very learnable skill and not the black art it looks like — there's a walkthrough at the foot of this post. The other option is to find a makerspace or repair café with reflow gear, or to build alongside someone who has done it before.

There is one genuinely fiddly step to know about: the microphone element has an acoustic hole in it, and solder paste getting into that hole ruins it.

## What to order

Three orders, from three places, none of them urgent. Order everything at once.

| Item | Order from | Cost |
|---|---|---|
| 5 × bare PCB | [Griff Mini on PCBWay](https://www.pcbway.com/project/shareproject/Griff_Mini_d4d7cbaa.html) | $5 |
| Solder paste stencil, **no frame** | added manually to the same PCBWay order | $15 |
| PCBWay shipping | | $25 |
| Components for 5 boards | [DigiKey shared list](https://www.digikey.co.uk/en/mylists/list/HEJJQAEWTN) | $60 inc. shipping |
| 5 × Raspberry Pi Pico | [AliExpress](https://www.aliexpress.com/item/1005007525241877.html) | $25 |
| Lead-free solder paste | [Amazon](https://www.amazon.ca/dp/B0FNR4N7D3) | $12 |
| **Total, five microphones** | *excludes the hotplate and cable below* | **$142** |

That's about **$28 each** for the microphones themselves, and the shape of it is the reason to build five rather than one: the boards are almost free, while the stencil, the paste and the shipping are flat costs whether you make one microphone or ten. The stencil and the tub of paste both outlast a single batch, so a second run is nearer **$23 a unit** — and the parts alone are about **$20**.

On top of that come the things you buy once rather than per board, and which
aren't in the total above — a cable to get the finished microphone into your
phone, and a hotplate if you haven't got one:

| Item | Order from | Cost |
|---|---|---|
| USB-C to micro-USB cable | [AliExpress](https://www.aliexpress.com/item/1005008423647623.html) | $3.50 |
| Lightning OTG adapter — **only for a Lightning iPhone** | [AliExpress](https://www.aliexpress.com/item/1005005713313657.html) | $3.50 |
| Hotplate — **only if you don't have reflow gear** | [Amazon](https://www.amazon.ca/dp/B0CC62TP4L) | $57 |

A few things that will otherwise cost you an order:

- **Order the stencil as "no frame".** A framed stencil is expensive to ship
  and you don't need one. **You must add it to the order manually** — it isn't
  included by default.
- **Don't tick assembly.** PCBWay will decline the order; assembly isn't
  authorised for this project.
- **Get the micro-USB Pico, not the USB-C one.** The USB-C clones don't work
  here. A genuine Pico is the safe choice and the clones save around $4 each. If you order the clones, don't forget to remove them from the DigiKey order.

The DigiKey link is a list Phil maintains, which is the thing to order from, it stays current in a way a parts table copied into a blog post would not.

## Flashing the firmware

The board is built around the Raspberry Pi Pico, which does the digitising and
presents the whole thing to your phone as an ordinary USB microphone. Once the
board is assembled, it needs Phil's firmware, which is what makes it a 384 kHz
microphone rather than a Pico.

1. Download **`griff.uf2`** from [the Griff page](https://www.pippyg.com/griff.html) (it's about 80 KB).
2. Hold down the white button on the back of the board.
3. With the button held, plug the board into a computer with a USB cable.
4. It appears as a drive called **RPI-RP2**.
5. Drag `griff.uf2` onto that drive. The board reboots as a microphone.

That's the whole process, and it's the same trick used to flash any Pico. You
can redo it later if the firmware is updated.

## Plugging it into a phone

The board has a **micro-USB** socket, so what you need between it and your
phone depends on which iPhone you have:

- **USB-C iPhone** — a plain USB-C to micro-USB cable is all it takes.
- **Lightning iPhone** — you need a **Lightning OTG adapter** (the kind that
  carries data and can host a USB device), not a plain charging adapter. A
  charge-only one will do nothing at all.

Then open OpenBat, and it should appear as an input running at 384 kHz. Our
[Help page](/help/) covers what to do from there.

## You can't sell them

Phil's terms are simple: Griffs are not to be sold. He makes no money from the design and asks that builders don't either.

Since the boards come in fives, the obvious way round it is to find four other people, split the order, and build them together in an afternoon. Everyone pays their share, everyone goes home with a microphone, and nobody has sold anything.

## Is it worth it?

If you already have reflow gear or access to it, obviously yes — this is a $28 instrument doing a job commercial hardware charges several hundred for.

If you don't, be realistic about what you're actually buying. A hotplate is
$57 and the microphones are $28 each, so on a first solo build the equipment
costs twice as much as the thing you're making. That is an argument for scale
rather than against building: the hotplate is bought once and never again, five
boards cost barely more than one, and splitting a batch turns an awkward solo
purchase into an afternoon a bat group can repeat every time someone new wants
a microphone.

## A first-timer's guide to surface-mount

If you have only ever soldered wires and through-hole parts, this is a
different activity, and an easier one than it looks. You are not soldering
joints one at a time. You are printing glue-like solder onto the board,
dropping parts into it, and melting the lot at once.

Here is the whole process on a Griff Mini.

### 1. Know what goes where

You start with a bare board. Everything you need is printed on it.

<div class="image-pair">
<figure class="image-float-right">
<img src="/static/images/griff-bare-board.webp" alt="A bare green Griff Mini circuit board photographed from above, with silver pads and the component values printed beside them in white." loading="lazy"><figcaption>The bare board as it arrives. The silver rectangles are pads, and the white text beside each one is the value that belongs there.</figcaption></figure>
<figure class="image-float-right">
<img src="/static/images/griff-board-annotated.webp" alt="The same board with every pad group outlined and colour-coded: 47 kΩ, 470 Ω and 100 Ω resistors, 47u and 0.1u capacitors, the op-amp, MEMS microphone, Raspberry Pi Pico, and the brooch pin pads." loading="lazy"><figcaption>The same board, colour-coded. Worth opening full size and keeping on a second screen while you place parts — it is the map this whole step is about.</figcaption></figure>
</div>

Lay the components out in front of you and identify them before you start,
because once there is paste on the board you don't want to be squinting at a
reel.

The board tells you most of it: the white text beside each pad is the value
that belongs there. Resistors carry their value as a code, so **4702** means
470 followed by two zeros — 47,000 Ω, or **47 kΩ**, matching the pads marked
`47K`, and **471** is 470 Ω. Capacitors are almost always blank, so keep them
in their strips and label them as you go.

The **two long rows** in the middle are where the Pico sits, and the
**square-and-circle pads** top and bottom are for brooch pins — Griff was
designed to be worn, and a pin soldered there turns it into a badge you can
clip to a jacket. Pins are cheap and sold in bags of fifty, but they are
**entirely optional**: leave those pads empty and the microphone works exactly
the same.

> [!note] The pad marked FERRITE
> There is no ferrite bead in the parts list. The **100 Ω resistor** is what
> fits that pad, and it's what went on ours — worked out at the bench rather
> than read anywhere, so treat it as what we did rather than gospel.

### 2. Build a jig to hold the board

This is easily missed and isn't well covered in other guides, and it makes the difference between a clean print and a smeared one. The board is 1.6 mm thick and weighs nothing — if it can slide even slightly while you drag paste across the stencil, the
print is ruined.

The fix costs nothing. Your PCBWay order arrives with offcuts, and they are
exactly the same thickness as the board:

<div class="image-pair">
<figure class="image-float-right">
<img src="/static/images/griff-jig-empty.webp" alt="Five offcut PCB panels taped and glued to a piece of hardboard, arranged around an empty board-shaped gap, with the steel stencil resting beside them." loading="lazy"><figcaption>The jig itself: offcuts fixed down around a board-shaped gap. Build it once and every board after that drops straight in. My base board was warped so I added a thin piece of metal to lift the blank up a tiny bit for more precise stencilling.</figcaption></figure>
<figure class="image-float-right">
<img src="/static/images/griff-jig.webp" alt="A Griff Mini board sitting in the gap in the middle of the jig, boxed in on all four sides by offcuts of the same thickness." loading="lazy"><figcaption>With a board in it. Same thickness all round, so the stencil lies dead flat across the whole area instead of tipping over an edge. This should leave a thin layer of solder paste on the board.</figcaption></figure>
</div>

Arrange them around a board so it is trapped on all four sides, then fix them
down — hot glue, superglue or tape all work. Fix only the surround, never the
board: what you are making is a board-shaped hole to drop each one into, so
you can lift it out after pasting and put the next one in.

### 3. Paste

Lay the stencil over the board and line it up so every pad sits centred in its
aperture. Take your time here: it's the one part of the process where accuracy
genuinely matters.

<div class="image-pair">
<figure class="image-float-right">
<img src="/static/images/griff-stencil-align.webp" alt="A hand holding down the steel stencil over the jig while taping one edge, with the board's pads visible through the stencil apertures." loading="lazy"><figcaption>Line it up, then tape one edge down as a hinge — that way you can lift and re-check without losing the alignment.</figcaption></figure>
<figure class="image-float-right">
<img src="/static/images/griff-stencil-ready.webp" alt="The stencil taped flat over the jig on all sides, sitting level and ready for solder paste." loading="lazy"><figcaption>Taped down and sitting flat. Ready to paste.</figcaption></figure>
</div>

Now drag solder paste across the stencil with a plastic card or squeegee in
**one firm pass**, pressing down rather than scooping.

Two things matter more than technique:

- **Not too much paste.** A thin, even fill of each aperture is right. Excess
  is what causes bridges between pads.
- **Lift the stencil straight up**, not sideways. Sideways smears the print
  you just made.

If the print comes out badly, wipe the board with isopropyl alcohol and start
again. It costs you two minutes and nothing else.

### 4. Place the parts

Now put the components onto the wet paste with fine tweezers.

<div class="image-pair">
<figure class="image-float-right">
<img src="/static/images/griff-placing.webp" alt="Fine-tipped tweezers lowering a tiny surface-mount capacitor onto a pasted pad on the Griff Mini board." loading="lazy"><figcaption>Tweezers, good light and a steady surface. The parts are small but the paste is sticky, which does most of the work of holding them.</figcaption></figure>
<figure class="image-float-right">
<img src="/static/images/griff-placed.webp" alt="Close-up of four placed components on the board: two capacitors and two resistors marked 4702, sitting on their pads beside the printed values 47u and 47K." loading="lazy"><figcaption>Placed and ready for the hotplate. The <code>4702</code> markings are the 47 kΩ resistors, on the pads labelled <code>47K</code>.</figcaption></figure>
</div>

You do not need to be precise. Solder paste is tacky enough to hold a part
where you drop it, and — the part that surprises everyone the first time —
surface tension pulls slightly crooked parts **straight** as the solder melts.
Close is genuinely good enough.

Two exceptions to "close is fine":

- **Orientation matters for anything with a pin 1** — the op-amp and the
  microphone. Match the marking on the part to the marking on the board.
  These resistors and capacitors can go either way round.
- **Keep paste out of the microphone's acoustic hole.** It's the small opening
  in the top of the mic package, and it is the one mistake on this board that
  can't be fixed after reflow.

### 5. Reflow

**It all reflows in one pass.** The Pico goes on like any other component,
sitting over its two rows of pads, and the whole board — passives, op-amp,
microphone and Pico — goes onto the hotplate together. There is no second
heating and nothing to hand-solder afterwards.

<div class="image-pair">
<figure class="image-float-right">
<img src="/static/images/griff-hotplate.webp" alt="The assembled Griff Mini board, with a Raspberry Pi Pico sitting on its pads, on the steel bed of a temperature-controlled hotplate." loading="lazy"><figcaption>Everything in place on the plate — surface-mount parts, and the Pico over its two rows of pads.</figcaption></figure>
<figure class="image-float-right">
<img src="/static/images/griff-hotplate-wide.webp" alt="The finished board cooling on the hotplate, with the jig and its offcut PCBs on the bench behind." loading="lazy"><figcaption>Both the board and the plate stay hot long after it's switched off — that steel bed is the thing that catches people out.</figcaption></figure>
</div>

> [!warning] Ventilation
> Solder paste gives off flux fumes as it heats, and they are an irritant you
> don't want a lungful of. Open a window, put a fan behind you rather than in
> front, and don't lean over the plate to watch. This is the one genuine
> hazard in the whole build.

Bring the plate up to temperature and **watch the board, not the clock**. The
paste sits dull grey for a while, then changes all at once: it turns shiny and
liquid, and the parts visibly twitch and settle as surface tension pulls them
square onto their pads.

A board that isn't sitting perfectly flat heats unevenly, and you'll see it:
one corner goes shiny while another is still dull. Press it gently down on
**two opposite corners** to bring the whole underside into contact with the
plate. Light pressure is all it needs — you are seating it, not clamping it.

> [!warning] Never your fingers
> The board and everything on it are at soldering temperature. Use a metal
> tool — the probes that come with most hotplate kits, a solder pick, tweezers,
> anything steel with a handle. Do not test how hot it is by touch, and
> remember the plate itself stays dangerous for a long time after it's off.

The rule is to wait until **every** part has done that. Different parts reach
temperature at different times — the big ones and anything under the Pico lag
behind the small passives — so give it a few seconds after the last one goes
shiny before you call it done. Taking the board off early is the most common
way to get a dry joint.

If something hasn't settled while the solder is still liquid, **nudge it**.
Tweezers, a gentle push towards its pads, and it will usually snap into place
on its own. That is a normal part of the process, not a repair.

Then power the plate down and leave the board alone. Don't quench it, don't
pick parts off, and don't move it until it's cool — the solder stays liquid
for a while after the heat is off, and a knock at that point will shift
everything you just placed.

### 6. Inspect

Look over the cooled board — ideally with a magnifier, or a phone camera
zoomed in. You are checking for two things: **bridges**, where solder has run
between two adjacent pads, and **dry joints**, where a pad looks dull or a
part hasn't wetted properly. A bridge is fixed with a soldering iron and some
braid; a dry joint usually just wants reheating.

Then flash the firmware as described above, and **that's a finished
microphone** — plug it in and it detects bats. The printed case in the photo
at the top of this post is something we added afterwards to make ours
pocketable and a bit less fragile, and it's entirely optional.

### If it doesn't work

Most first boards do work. If yours doesn't:

- **Nothing at all on USB** — suspect the Pico's rows of joints first, then
  check the board for bridges.
- **It appears but is silent, or very quiet** — suspect the microphone: paste
  in the acoustic hole, or a poor joint under the package.
- **It works but sounds wrong** — check components against the silkscreen. A
  47 kΩ where a 470 Ω belongs is easy to do and easy to miss.

And this is the real reason to make five. The first board is where you learn
the paste, the placement and the hotplate; boards two to five come out clean,
and even if you write one off entirely you still go home with four working
microphones.
