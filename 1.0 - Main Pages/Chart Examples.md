---
title: Chart Examples
description: Every option the chart shortcode supports, rendered next to the code that made it.
permalink: /chart-examples/
cards: false
publish: true
noindex: true
---

Every shape `{% raw %}{% chart %}{% endraw %}` can draw, rendered above the code that made
it. Copy a block, change the numbers, done.

Two rules that apply to all of them:

- **Never write a colour.** The runtime reads `--color-accent`,
  `--color-secondary`, `--color-muted` and `--color-border` off `:root`, so
  every chart follows the theme toggle. `style: "secondary"` and
  `style: "muted"` are how you drop a row back.
- **No backslash escapes.** Nunjucks takes `–` literally — paste the real
  character.

## Bars from zero

The default, and most of them. `note` is the text beside the bar, `highlight`
marks the row the figure exists to make.

{% chart {
  key: "HOW FAR AWAY A DETECTOR HEARS EACH ONE, IN METRES",
  caption: "A caption sits under the figure.",
  bars: [
    { label: "Noctule", value: 100, note: "100 m" },
    { label: "Serotine", value: 40, note: "40 m" },
    { label: "Common pipistrelle", value: 25, note: "25 m" },
    { label: "Brown long-eared", value: 6, note: "6 m", highlight: true }
  ]
} %}

{% raw %}
```
{% chart {
  key: "HOW FAR AWAY A DETECTOR HEARS EACH ONE, IN METRES",
  caption: "A caption sits under the figure.",
  bars: [
    { label: "Noctule", value: 100, note: "100 m" },
    { label: "Serotine", value: 40, note: "40 m" },
    { label: "Common pipistrelle", value: 25, note: "25 m" },
    { label: "Brown long-eared", value: 6, note: "6 m", highlight: true }
  ]
} %}
```
{% endraw %}

`{% raw %}{% barChart %}{% endraw %}` is the same shortcode under its original
name, kept because bars are most of them.

## Floating bars — a range

`from`/`to` instead of `value`. Use this whenever the figure is a *range*:
drawing "70 to 100" from zero says something quite different.

{% chart {
  key: "PEAK FREQUENCY, KILOHERTZ",
  caption: "Overlapping ranges are the whole point — a floating bar shows the overlap, a bar from zero hides it.",
  bars: [
    { label: "Common pipistrelle", from: 43, to: 49, note: "43–49" },
    { label: "Soprano pipistrelle", from: 53, to: 59, note: "53–59" },
    { label: "Nathusius' pipistrelle", from: 36, to: 42, note: "36–42" },
    { label: "Noctule", from: 18, to: 26, note: "18–26", highlight: true }
  ]
} %}

{% raw %}
```
{% chart {
  key: "PEAK FREQUENCY, KILOHERTZ",
  caption: "Overlapping ranges are the whole point.",
  bars: [
    { label: "Common pipistrelle", from: 43, to: 49, note: "43–49" },
    { label: "Soprano pipistrelle", from: 53, to: 59, note: "53–59" },
    { label: "Nathusius' pipistrelle", from: 36, to: 42, note: "36–42" },
    { label: "Noctule", from: 18, to: 26, note: "18–26", highlight: true }
  ]
} %}
```
{% endraw %}

## Styles, and the very small number

`style: "secondary"` and `style: "muted"` push a row back. `minBarLength` keeps
a true-but-tiny value visible as a sliver rather than rounding it to nothing —
that behaviour is automatic, and it is why the rabid-bats row below is still
there at all.

{% chart {
  key: "DEATHS PER YEAR IN THE US — EVERY BAR TO THE SAME SCALE",
  caption: "Set `note` yourself when the printed figure is not the drawn one.",
  bars: [
    { label: "Wildlife-vehicle collisions", value: 440, note: "440+" },
    { label: "Lightning strikes", value: 43, style: "secondary" },
    { label: "Dog attacks", value: 19, style: "muted" },
    { label: "Rabid bats", value: 3, note: "1–3", highlight: true }
  ]
} %}

{% raw %}
```
{% chart {
  key: "DEATHS PER YEAR IN THE US — EVERY BAR TO THE SAME SCALE",
  bars: [
    { label: "Wildlife-vehicle collisions", value: 440, note: "440+" },
    { label: "Lightning strikes", value: 43, style: "secondary" },
    { label: "Dog attacks", value: 19, style: "muted" },
    { label: "Rabid bats", value: 3, note: "1–3", highlight: true }
  ]
} %}
```
{% endraw %}

## Vertical bars

`vertical: true`. For when the category is an ordinal the reader scans left to
right — pulse 1 to 8, a month, a step in a sequence. Species names and other
long labels want the default sideways bars, where there is room for them.

Note the axis names swap with the orientation: on a vertical chart the value
axis is y, so `yTicks` and `max` apply to it and a threshold is `axis: "y"`.

{% chart {
  key: "PULSE",
  yKey: "MODEL'S OWN CONFIDENCE",
  vertical: true,
  yTicks: true,
  max: 1,
  caption: "No single pulse has to clear the line — the average of them does.",
  bars: [
    { label: "1", value: 0.44, note: "" },
    { label: "2", value: 0.71, note: "" },
    { label: "3", value: 0.83, note: "" },
    { label: "4", value: 0.75, note: "" },
    { label: "5", value: 0.88, note: "" },
    { label: "6", value: 0.62, note: "" },
    { label: "7", value: 0.69, note: "" },
    { label: "8", value: 0.41, note: "" }
  ],
  lines: [
    { at: 0.57, axis: "y", text: "no-ID line 0.57", style: "muted", position: "start" },
    { at: 0.67, axis: "y", text: "mean 0.67 — the pass gets a name", dashed: false, position: "start" }
  ]
} %}

{% raw %}
```
{% chart {
  key: "PULSE",
  yKey: "MODEL'S OWN CONFIDENCE",
  vertical: true,
  yTicks: true,
  max: 1,
  bars: [
    { label: "1", value: 0.44, note: "" },
    { label: "2", value: 0.71, note: "" }
  ],
  lines: [
    { at: 0.57, axis: "y", text: "no-ID line 0.57", style: "muted", position: "start" },
    { at: 0.67, axis: "y", text: "mean 0.67 — the pass gets a name", dashed: false, position: "start" }
  ]
} %}
```
{% endraw %}

## Lines

`type: "line"`, with `labels` for the x axis and one or more `series`.

**`yTicks` is off by default and that is deliberate.** Several of these figures
are shapes rather than measurements — a season, a night, a trade-off. Numbers
on the axis would invite reading values nobody claimed. Turn them on with
`yTicks: true` only when the numbers are real.

{% chart {
  type: "line",
  key: "HOURS AFTER SUNSET",
  yKey: "BAT PASSES",
  labels: ["0", "1", "2", "3", "4", "5", "6", "7", "8"],
  caption: "A shape, not a measurement — so the y axis carries no numbers.",
  series: [
    { name: "Common pipistrelle", data: [2, 38, 30, 18, 14, 12, 16, 24, 9] },
    { name: "Noctule", data: [12, 26, 12, 6, 4, 3, 4, 7, 3], style: "secondary" }
  ],
  marks: [{ at: "1", text: "peak emergence" }]
} %}

{% raw %}
```
{% chart {
  type: "line",
  key: "HOURS AFTER SUNSET",
  yKey: "BAT PASSES",
  labels: ["0", "1", "2", "3", "4", "5", "6", "7", "8"],
  series: [
    { name: "Common pipistrelle", data: [2, 38, 30, 18, 14, 12, 16, 24, 9] },
    { name: "Noctule", data: [12, 26, 12, 6, 4, 3, 4, 7, 3], style: "secondary" }
  ],
  marks: [{ at: "1", text: "peak emergence" }]
} %}
```
{% endraw %}

### Series options

`dashed: true` for a dashed line, `fill: true` to shade to the baseline,
`curve: false` for straight segments, `points: true` to mark each value, and
`legend: false` to drop the key when the lines are labelled some other way.

{% chart {
  type: "line",
  key: "MONTH",
  labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"],
  yTicks: true,
  caption: "fill, dashed, points and curve: false, all on one figure.",
  series: [
    { name: "Recorded", data: [10, 34, 58, 72, 65, 40, 14], fill: true },
    { name: "Expected", data: [14, 30, 55, 70, 68, 45, 18], dashed: true, style: "muted" },
    { name: "Surveys", data: [3, 7, 12, 15, 13, 9, 4], style: "secondary", curve: false, points: true }
  ]
} %}

{% raw %}
```
{% chart {
  type: "line",
  key: "MONTH",
  labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"],
  yTicks: true,
  series: [
    { name: "Recorded", data: [10, 34, 58, 72, 65, 40, 14], fill: true },
    { name: "Expected", data: [14, 30, 55, 70, 68, 45, 18], dashed: true, style: "muted" },
    { name: "Surveys", data: [3, 7, 12, 15, 13, 9, 4], style: "secondary", curve: false, points: true }
  ]
} %}
```
{% endraw %}

### Stepped lines

`stepped: true`. A step is a thing that happened at a moment — an arousal, a
threshold crossing. Smoothing it would draw a gradual change the data does not
claim.

{% chart {
  type: "line",
  key: "MONTH",
  yKey: "FAT RESERVE",
  labels: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr"],
  caption: "Each step down is one arousal: a few days' worth of fat, spent in hours.",
  series: [
    { name: "A healthy winter", data: [100, 92, 86, 78, 70, 60, 48], stepped: true },
    { name: "With the infection", data: [100, 84, 64, 44, 22, 2, 0], stepped: true, style: "secondary" }
  ]
} %}

{% raw %}
```
{% chart {
  type: "line",
  key: "MONTH",
  yKey: "FAT RESERVE",
  labels: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr"],
  series: [
    { name: "A healthy winter", data: [100, 92, 86, 78, 70, 60, 48], stepped: true },
    { name: "With the infection", data: [100, 84, 64, 44, 22, 2, 0], stepped: true, style: "secondary" }
  ]
} %}
```
{% endraw %}

## Scatter

`type: "scatter"`, with `{x, y}` data. `line: true` joins the points,
`points: true` is implied.

{% chart {
  type: "scatter",
  key: "CALL DURATION, MILLISECONDS",
  yKey: "PEAK FREQUENCY, KILOHERTZ",
  yTicks: true,
  caption: "Two species that overlap on either axis alone, and separate on both together.",
  series: [
    { name: "Common pipistrelle", data: [
      { x: 5.2, y: 45 }, { x: 6.1, y: 46 }, { x: 5.8, y: 44 },
      { x: 6.9, y: 47 }, { x: 4.9, y: 45 }, { x: 6.4, y: 43 }
    ] },
    { name: "Soprano pipistrelle", data: [
      { x: 4.8, y: 55 }, { x: 5.5, y: 56 }, { x: 5.1, y: 54 },
      { x: 6.2, y: 57 }, { x: 4.4, y: 55 }, { x: 5.9, y: 58 }
    ], style: "secondary" }
  ],
  marks: [{ at: 6, text: "6 ms" }]
} %}

{% raw %}
```
{% chart {
  type: "scatter",
  key: "CALL DURATION, MILLISECONDS",
  yKey: "PEAK FREQUENCY, KILOHERTZ",
  yTicks: true,
  series: [
    { name: "Common pipistrelle", data: [
      { x: 5.2, y: 45 }, { x: 6.1, y: 46 }, { x: 5.8, y: 44 }
    ] },
    { name: "Soprano pipistrelle", data: [
      { x: 4.8, y: 55 }, { x: 5.5, y: 56 }, { x: 5.1, y: 54 }
    ], style: "secondary" }
  ],
  marks: [{ at: 6, text: "6 ms" }]
} %}
```
{% endraw %}

## Annotations

Four kinds, and they work on bars, lines and scatters alike.

### marks — a labelled vertical

The original, and still the shortest thing to type when you want one dashed
vertical. `at` is a category label on a line chart, a number on a scatter. Keep
them away from the plot edges, where the label has nowhere to go.

{% raw %}
```
marks: [{ at: "Mar", text: "sunset" }]
```
{% endraw %}

### lines — a reference line on either axis

What `marks` cannot do: a horizontal one. `axis: "y"` for horizontal,
`axis: "x"` (the default) for vertical, `dashed: false` for a solid rule, and
`position: "start" | "center" | "end"` to move the label along the line when
two of them would otherwise collide.

{% chart {
  type: "line",
  key: "NIGHT",
  yKey: "CONFIDENCE",
  labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
  yTicks: true,
  max: 1,
  caption: "A horizontal threshold, and a vertical one, on the same figure.",
  series: [
    { name: "Nightly mean", data: [0.42, 0.51, 0.49, 0.63, 0.71, 0.58, 0.66, 0.74, 0.69, 0.77] }
  ],
  lines: [
    { at: 0.57, axis: "y", text: "no-ID line 0.57", style: "muted" },
    { at: "5", text: "microphone replaced", style: "secondary", position: "start" }
  ]
} %}

{% raw %}
```
lines: [
  { at: 0.57, axis: "y", text: "no-ID line 0.57", style: "muted" },
  { at: "5", text: "microphone replaced", style: "secondary", position: "start" }
]
```
{% endraw %}

### bands — a shaded region

`from`/`to` on either axis. For a season, a tolerance window, a hold-off — a
region that means something rather than a line that does.

{% chart {
  type: "line",
  key: "MONTH",
  yKey: "ACTIVITY",
  labels: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May"],
  caption: "Bands sit behind the data, so they never hide it.",
  legend: false,
  series: [
    { name: "Activity", data: [42, 18, 4, 2, 3, 12, 38, 64] }
  ],
  bands: [
    { from: "Nov", to: "Mar", text: "hibernation", style: "muted" },
    { from: "Apr", to: "May", text: "spring — insects return", style: "secondary" }
  ]
} %}

{% raw %}
```
bands: [
  { from: "Nov", to: "Mar", text: "hibernation", style: "muted" },
  { from: "Apr", to: "May", text: "spring — insects return", style: "secondary" }
]
```
{% endraw %}

A band on the value axis instead — `axis: "y"`, `from`/`to` as numbers:

{% raw %}
```
bands: [{ from: 43, to: 49, axis: "y", text: "pipistrelle range", style: "muted" }]
```
{% endraw %}

### callouts — text, with an optional arrow

`x`/`y` place the text in data coordinates. `arrowTo` draws a leader line to
the thing it is talking about. `wrap` sets the characters per line (26 by
default), `align` is `"left"`, `"center"` or `"right"`.

{% chart {
  type: "line",
  key: "MONTH",
  yKey: "FAT RESERVE",
  labels: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr"],
  caption: "A callout is a label plus a line — the two together, so it can point.",
  legend: false,
  series: [
    { name: "With the infection", data: [100, 84, 64, 44, 22, 2, 0], stepped: true }
  ],
  callouts: [
    { x: "Jan", y: 78, text: "each step down is one arousal: a few days' worth of fat, spent in hours", style: "muted", arrowTo: { x: "Dec", y: 64 } },
    { x: "Mar", y: 30, text: "reserves gone, weeks before there is anything to eat", arrowTo: { x: "Mar", y: 4 } }
  ]
} %}

{% raw %}
```
callouts: [
  { x: "Jan", y: 78, text: "each step down is one arousal", style: "muted",
    arrowTo: { x: "Dec", y: 64 } },
  { x: "Mar", y: 30, text: "reserves gone, weeks before there is anything to eat",
    arrowTo: { x: "Mar", y: 4 } }
]
```
{% endraw %}

## Panels — several charts as one figure

Wrap charts in `{% raw %}{% panels %}{% endraw %}` and they become columns of a
single bordered figure. Use it when the comparison *between* the charts is the
point and the eye needs to cross between them — "heard, then weighted, then
reported" only works side by side.

`columns` sets how many (3 by default). `caption` is the caption for the whole
figure, and each chart keeps its own smaller one. Below 900px they stack, because
three narrow panels are worse than three tall ones — so keep `key` short enough
to fit a third of the width, and put the detail in the panel's `caption`.

{% panels { columns: 2, caption: "The overall caption sits under a divider, below all the panels." } %}
{% chart {
  key: "BEFORE",
  caption: "Each panel keeps its own smaller caption.",
  max: 0.6,
  height: 220,
  bars: [
    { label: "Daubenton's", value: 0.38, note: "0.38" },
    { label: "Brandt's", value: 0.23, note: "0.23" },
    { label: "Common pip", value: 0.16, note: "0.16" }
  ]
} %}
{% chart {
  key: "AFTER",
  caption: "Same species, same scale — that is what makes them comparable.",
  max: 0.6,
  height: 220,
  bars: [
    { label: "Daubenton's", value: 0.51, note: "0.51", highlight: true },
    { label: "Brandt's", value: 0.001, note: "0.00" },
    { label: "Common pip", value: 0.21, note: "0.21" }
  ]
} %}
{% endpanels %}

{% raw %}
```
{% panels { columns: 2, caption: "The caption for the whole figure." } %}
{% chart {
  key: "BEFORE",
  caption: "Each panel keeps its own smaller caption.",
  max: 0.6, height: 220,
  bars: [ { label: "Daubenton's", value: 0.38, note: "0.38" } ]
} %}
{% chart {
  key: "AFTER",
  caption: "Same species, same scale.",
  max: 0.6, height: 220,
  bars: [ { label: "Daubenton's", value: 0.51, note: "0.51", highlight: true } ]
} %}
{% endpanels %}
```
{% endraw %}

**Give every panel the same `max`.** Panels invite the reader to compare across
them, and they can only do that honestly if the scales agree.

**Turn the value axis off when every bar carries its own number.** With `note`
on each row the scale behind them is just noise, so panels usually want
`xTicks: false, xGrid: false` — the pinned `max` still does its job unseen.

## Log scale, colour groups, and many bars

Three options that only earn their place on a big figure: `scale: "log"` for a
spread of several orders of magnitude, `groups` for a legend when `style` is
carrying a meaning, and `notes: false` to drop the per-bar numbers when there
are too many bars to label.

Hide the species names with `xTicks: false` (the category axis on a vertical
chart) and let a few `callouts` name the ones that matter.

{% chart {
  key: "",
  yKey: "RECORDS HELD, LOG SCALE",
  vertical: true,
  scale: "log",
  min: 100,
  yTicks: true,
  xTicks: false,
  notes: false,
  height: 360,
  caption: "A log scale makes a thousandfold difference look like a threefold one, so say so — here the y label and the caption both do.",
  groups: [
    { name: "European species", style: "highlight" },
    { name: "North American species", style: "secondary" },
    { name: "Elsewhere", style: "muted" }
  ],
  bars: [
    { label: "a", value: 186, style: "secondary" },
    { label: "b", value: 280, style: "secondary" },
    { label: "c", value: 490, style: "secondary" },
    { label: "d", value: 1100, style: "secondary" },
    { label: "e", value: 1500, style: "secondary" },
    { label: "f", value: 2400, style: "secondary" },
    { label: "g", value: 3720, style: "secondary" },
    { label: "h", value: 6000, highlight: true },
    { label: "i", value: 12000, style: "secondary" },
    { label: "j", value: 35000, highlight: true },
    { label: "k", value: 52000, style: "muted" },
    { label: "l", value: 300000, highlight: true },
    { label: "m", value: 3229956, highlight: true }
  ],
  callouts: [
    { x: "b", y: 1500, text: "Spotted bat, 186 records", style: "muted", arrowTo: { x: "a", y: 200 } },
    { x: "j", y: 900000, text: "Common pipistrelle, 3,229,956 records", arrowTo: { x: "m", y: 2600000 } }
  ]
} %}

{% raw %}
```
{% chart {
  yKey: "RECORDS HELD, LOG SCALE",
  vertical: true,
  scale: "log",
  min: 100,
  yTicks: true,
  xTicks: false,
  notes: false,
  groups: [
    { name: "European species", style: "highlight" },
    { name: "North American species", style: "secondary" },
    { name: "Elsewhere", style: "muted" }
  ],
  bars: [
    { label: "a", value: 186, style: "secondary" },
    { label: "b", value: 6000, highlight: true }
  ]
} %}
```
{% endraw %}

`groups` only draws the key — each bar still picks its own colour with
`highlight` / `style`, so the two have to be kept in step by hand. `min` is
required on a log scale, because a log axis cannot start at zero.

## Everything else

Options that apply to any chart:

| Option | Does |
|---|---|
| `key` | Labels the x axis |
| `yKey` | Labels the y axis |
| `caption` | Becomes the `figcaption` |
| `alt` | Overrides the auto-generated screen-reader description |
| `height` | Pixels. Bars work it out from the row count; lines default to 320 |
| `max` / `min` | Pin the value scale |
| `xTicks: false` | Drop the x numbers |
| `yTicks: true` | Add the y numbers — off by default on lines and scatters |
| `xGrid: false` | Drop the gridlines on the x axis |
| `yGrid: false` | Drop the gridlines on the y axis |
| `legend: false` | Drop the key |
| `beginAtZero: false` | Let a line scale start where the data does |

## What is not a chart

The test is whether the figure has numbers behind it. If it does, it is a
`chart`. If it is a diagram of how something is *arranged* — a pipeline, a
five-layer stack, a plan view of a field, a call sweep whose annotations are
the content — it stays hand-written inline SVG in the markdown, using
`style="fill: var(--color-accent)"` (a CSS variable is invalid in a plain
`fill=` attribute) and the `.chart-label`, `.chart-label--small` and
`.chart-key` classes from `style.css`.
