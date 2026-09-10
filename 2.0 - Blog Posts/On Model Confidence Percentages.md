---
title: On Model Confidence Percentages
description: The models used in OpenBat sometimes offer very high confidence values, why? How? and what do the confidence values actually mean?
excerpt: The models used in OpenBat sometimes offer very high confidence values, why? How? and what do the confidence values actually mean?
date: 2026-09-01
author: Niall Bell
tags:
  - auto-id
  - dev-log
  - ml
coverImage: /static/images/id_numbers.webp
heroImage: /static/images/id_numbers.webp
tileHero: true
featured: false
priority:
publish: true
---
Neural networks are complicated, and I will openly admit that it's not my area of expertise. However, I have built a lot of machinery around such models and therefore I do have some things to say.

This post addresses a simple question with a complicated answer:

*"The app suggested an identification on this bat with a confidence of 99%. Does this mean the app is 99% sure it is correct?"*

The simple answer is no, that 99% is not confidence. The long answer is a little more complicated.

There is a short version at the bottom, but I recommend grabbing a cuppa and working through this!

## How do neural networks predict things?

<figure class="image-float-right" style="width:40%">
	<a href="/static/images/yuma-myotis-suspected-call.webp"><img src="/static/images/yuma-myotis-suspected-call.webp" alt="A screenshot of what is suspected to be a yuma myotis echolocation call spectrogram.." loading="lazy"></a>
	  <figcaption>A screenshot from the app's playback view of a bat recorded with OpenBat. Bat echolocation pulses can be visualised this way in order to analyse their properties. The calls sweep through a range of frequencies and last only a few milliseconds per pulse. This spectrogram has the silence between calls removed to fit more on screen.</figcaption>
</figure>

I'm not going to go into too much detail here, the topic has been covered extensively online, and far better than I can manage. In short neural networks, also called machine  devlearning models and classifiers, are trained on a known dataset and then fed unknown data to predict a classification. In our case, bat echolocation calls.

I'm glossing over LOTS of detail here, but once a call has been passed into the network and processed it will output a number of scores. Let's say a network can classify three species of bat. We feed in a bat call and the model spits out three numbers: species 1 = 8.0, species 2 = 6.0, species 3 = 3.0. These scores are then run through a calculation called a **softmax** function. This is where the crazy high percentages come from.

## What is softmax?

Softmax is a mathematical function that turns a set of raw scores, 8.0, 6.0, and 3.0, into percentages that add up to 100%. It does this by raising a fixed number (*e* = 2.71828) to the power of each score before dividing, and because that growth is exponential, the gaps between the scores get stretched wide open.

Those three scores above: 8.0, 6.0 and 3.0, come out of softmax as **88%, 12% and 1%**. A two-point lead became a landslide. Widen the lead from two points to five and the winner is on 99%.

This is deliberate. It exists to push a model off the fence and into a decision rather than leaving it forever undecided. But this introduces three consequences which matter greatly to anyone looking at the output!

### It is a share-out, not a probability

The percentages must always add to 100. Every call that goes in gets 100% divided up between the species the model knows, and the winner is whichever one got the biggest slice. The number tells you ***how far ahead the winner finished***. It does not tell you how likely the answer is to be correct.

### A small difference in evidence can result in a huge lead

Because of that exponential growth, "just ahead" and "miles ahead" look almost identical by the time they reach you. 99% is not a rare, exceptional event. It is routine, and it is a much weaker statement than it looks.

### The percentage hides the question most people care about

This one took me a while to appreciate. Add the same amount to every single raw score and the percentages don't move at all. Only the *differences* between them survive the calculation. The overall strength of the evidence, "did any of this actually look like a bat?", is mathematically thrown away.

It's important to understand, the model has no way to say *"none of these fit very well...I don't know what I'm hearing."* The model doesn't have the words to say this. A car door, a moth, a dog barking, or a species the model has never encountered still gets carved up into a share of 100%, even though none might be right.

## Models are trained to sound certain

Softmax explains the mechanism. Training explains the habit.

Every recording the model learned from had exactly one correct answer attached. When in training, if the model says 70% for the right species, it is still marked as an error. The model is told to do better which nudges it towards 100%. Imagine writing a bunch of essays and always getting 50% marks, and then learning that you can use words which impress the marker to increase your score, you will keep doing it even though it's not improving the overall quality of your essays. Essentially in terms of the model, saying "I'm not sure" is not good enough and it gets penalised for it. Kinda sad if you can anthropomorphise computer code!

Anyway, the model ultimately learned **not** to be unsure. This isn't unique to bats, it's a well-documented property of modern neural networks. The bigger and more accurate they've got, the more overconfident they've become. I'm sure you're all too familiar with this if ChatGPT or similar has confidently told you that there are five letter 'r's in 'strawberry'.

## The Myotis problem

Now put those two things together, that is 'what softmax does to small differences in scores', and 'how the model was trained to never be unsure', then point them at a genus like *Myotis*. It gets crazy.

The model OpenBat uses in North America knows 31 classes: 30 North American bat species plus a "noise" class, i.e., not a bat. **Thirteen of those thirty species are Myotis.** Several of them produce calls that are genuinely inseparable. Not "difficult", not "requires an expert", but overlapping to the point where the information needed to tell them apart is simply not present in the recording.

When passed one of these similar calls during training, which for all intents and purposes are the same but with different names, the model was still forced to pick one or the other, confidently. It was marked wrong every time it wavered. Think "mixed signals"...

There is only one way to satisfy a demand like that: latch onto whatever *else* happened to differ between the training files. You know like when you can't tell if your boss is mad at you so you start looking back to find something...ANYTHING...which might give you an edge in figuring out if it was you or just that they are having a bad week. In bats, the recording site, equipment used, background noise, the particular roost the bats were caught at, or even the temperature. These are all real, learnable patterns, and they will confidently separate two species in the training set. They just won't work in your garden.

This is my honest suspicion about a chunk of the very high Myotis confidences: the model isn't identifying the bat. It's identifying you and me!

## And then the app makes it worse

I own this part, because it's my code doing it. But I think it's the right thing to do.

OpenBat knows roughly which species occur where you are, we use the best available data from open sources, and it uses that to figure out if a bat should be there. Species that don't live near you get their raw scores pushed down. But the percentages then have to be rebalanced so they add to 100 again, and that means the down-weighted species' share gets handed to whoever is left. This balloons the remaining scores.

So a Myotis on 60%, once its lookalike has been ruled out as being 1,000 miles from home, becomes a Myotis on 99%. Not one scrap of new acoustic evidence arrived to nudge the figure. The number went up because the competition were kicked out of the game. 

I deliberated over this for a while. In the end I decided it was the right thing to do. It is more harmful for the app to suggest a species which has never been seen where you are, than to over confidently suggest one which is known to be there.

## So which number should you care about?

Here's what reframed it for me. The question everyone actually wants answered is:

*"When the app says hoary bat, how often is it right?"*

That's a real, answerable, and measurable question. It just can't be answered by the model's own output, it has to be measured by testing the model against recordings where the species is already known. And would you know it, scientists who train these models do exactly that and they publish the results.

<figure class="image-float-right" style="width:50%">
  <a href="/static/images/id_numbers.webp"><img src="/static/images/id_numbers.webp" alt="A screenshot of the ID panel in the app showing annotations for what each percentage number means." loading="lazy"></a>
  <figcaption>A screenshot from the app's AutoID section. 1) The model precision for this species. When the model is shown a recording of this species, how often does it predict it correctly? 2) Prior softmax score for the winner and runner-up. How close were the raw model scores? Close = less sure, far apart = more sure. <strong>Tap each percentage in-app to learn more. Only visible in Advanced view mode.</strong></figcaption>
</figure>

The word for it is **precision**: of all the times the model said hoary bat, what fraction of those recordings were genuinely hoary bats?

The interesting part is where precision and the confidence percentage disagree. Little brown bat is a good example: it's the bucket that everything ambiguous falls into. Long-legged myotis leaks into it. Western small-footed myotis leaks into it. Two thirds of all cave bat calls in the published validation set were labelled little brown bat, visible in the confusion matrix. So while its individual confidences look healthy, its actual track record is visibly worse than the tidier species like grey bat or canyon bat.

That gap is precisely what a confidence percentage cannot show you.

## What OpenBat does about it

Three things:

**It shows the track record, precision, alongside the percentage.** Under each identification you'll see a line reading *"Precision: 95%"*, with the explanation of what that means behind the ⓘ beside it. It's the same figure for every hoary bat you ever record, because it describes the model's performance, not your particular recording. Two numbers answering two different questions: one is how clearly this call beat the alternatives (the softmax percentage), the other is how much value that verdict holds (the precision or track record).

I've been deliberately conservative with these. Species that were tested on only a handful of recordings show no figure at all. Where a species was tested on fewer than thirty recordings, we don't hold that as strong evidence and show nothing, it could have been a fluke. The figures that clear that bar are shown exactly as published, unrounded — a species on 82% and a species on 98% are genuinely different propositions, and smoothing them together would hide the one thing the table is for.

**It shows the runner-up.** If the model's second choice is a sister species sitting close behind, that's the most useful thing on the screen. A 95% with nothing near it, and a 55% with a contender two points behind, are entirely different findings. Remember how those small differences in raw scores made a huge difference after the softmax function? well if those softmax percentages come out close, you know the model outputs were damn close!

**It refuses to name things.** Before any species is reported, OpenBat checks whether there was enough raw evidence to name anything at all, and returns "No ID" when there wasn't. On one evening's recording in Squamish, 35 passes came back No ID. Nine of those had cleared the evidence gate comfortably, one at 0.946 across 19 separate pulses. That's not the model failing, it's saying *"definitely a bat, definitely one of these two, don't make me choose."*

## The short version

I said it was complicated...

The percentage ranks the margin between raw scores. It tells you how clearly this call beat the other species on the list, on a scale where the total must always come to 100%. It is not the probability that the identification is correct, it cannot say "none of these fit", and it climbs when species are ruled out without any new evidence arriving.

If you want to know whether to trust an ID: look at what the second-place species was, look at the track record for the species being claimed, and treat every Myotis with the suspicion it has earned.

And, as ever, an automated identification is a suggestion and a learning tool, not a record. The value of these tools is in narrowing down what to look at, not in settling what you heard.

## Appendix: precision by species

The figures OpenBat shows for the North American model, exactly as published. All of them come from the model's authors, who tested it against recordings of bats that had already been identified.

<figure class="table-pair">

<div class="table-pair-grid">

| Species                     | Precision |
| --------------------------- | --------- |
| Gray bat                    | 100%      |
| Townsend's big-eared bat    | 100%      |
| Canyon bat                  | 98%       |
| Fringed myotis              | 98%       |
| Indiana bat                 | 98%       |
| California myotis           | 97%       |
| Tri-coloured bat            | 96%       |
| Northern yellow bat         | 95%       |
| Western small-footed myotis | 95%       |
| Hoary bat                   | 94%       |
| Yuma myotis                 | 94%       |
| Silver-haired bat           | 93%       |
| Northern myotis             | 92%       |
| Brazilian free-tailed bat   | 91%       |
| Little brown bat            | 89%       |

| Species                     | Precision |
| --------------------------- | --------- |
| Long-eared myotis           | 89%       |
| Seminole bat                | 89%       |
| Eastern red bat             | 88%       |
| Spotted bat                 | 88%       |
| Eastern small-footed myotis | 86%       |
| Evening bat                 | 86%       |
| Big brown bat               | 85%       |
| Long-legged myotis          | 82%       |
| Allen's big-eared bat       | not shown |
| Big free-tailed bat         | not shown |
| Cave bat                    | not shown |
| Greater bonneted bat        | not shown |
| Pallid bat                  | not shown |
| Southeastern myotis         | not shown |
| Western red bat             | not shown |

</div>

<figcaption>Precision by species for the North American model, as published by its authors. Highest first; the seven marked <em>not shown</em> were tested on too few recordings to report. Note: those which say '100%' are a product of a low sample size and coincidence. Given enough samples the prevision would likely reduce.</figcaption>
</figure>


The seven marked *not shown* were each tested on fewer than thirty recordings — three of them on fewer than ten. Those same three score a perfect 100% in the paper, which is exactly why they are hidden: at that sample size it means very little. The noise class is left out of the table entirely, being not a bat.

<details>
<summary>Sources</summary>

- [https://doi.org/10.1111/1365-2664.14280](https://doi.org/10.1111/1365-2664.14280) — Khalighifar, A. et al. (2022) 'NABat ML: utilizing deep learning to enable crowdsourced development of automated, scalable solutions for documenting North American bat populations', *Journal of Applied Ecology*, 59(11), pp. 2849–2862. Precision figures are the audio-file-level column of Table S2; the confusion matrix is Figure 4.

</details>
