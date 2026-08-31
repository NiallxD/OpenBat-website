/* Post charts — Chart.js wiring.
 *
 * Nothing here is per-post. Every chart on the site is a <canvas data-chart>
 * emitted by the {% chart %} / {% barChart %} shortcodes in eleventy.config.js,
 * and this file hands each one to Chart.js. A post supplies numbers and labels
 * and nothing else — in particular it never picks a colour, because the palette
 * is read from the CSS custom properties on :root at draw time, so a chart
 * follows the light/dark toggle like the rest of the page.
 *
 * Chart.js is self-hosted (static/js/chart.umd.min.js) because the site's CSP
 * is script-src 'self' — a CDN copy would be blocked, silently, in production.
 */
(function () {
  "use strict";
  if (typeof Chart === "undefined") return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var charts = [];

  // chartjs-plugin-annotation gives us shaded bands, reference lines on either
  // axis, and text callouts with a leader line — the things several figures in
  // the blog are mostly made of. Self-hosted next to Chart.js; if it failed to
  // load, everything else still draws and only the annotations go missing.
  var annotationPlugin = window["chartjs-plugin-annotation"];
  if (annotationPlugin) Chart.register(annotationPlugin);

  // The palette lives in style.css, not here. Reading it back means one
  // definition of "accent" for the whole site, and a free theme swap.
  function palette() {
    var s = getComputedStyle(document.documentElement);
    var v = function (n, fallback) {
      return (s.getPropertyValue(n) || "").trim() || fallback;
    };
    return {
      accent: v("--color-accent", "#FF860D"),
      secondary: v("--color-secondary", "#cccccc"),
      muted: v("--color-muted", "#888888"),
      border: v("--color-border", "#333333"),
      // Annotation labels sit on top of the data, so they need the page ground
      // behind them or a threshold's text is unreadable over a bar.
      bg: v("--color-bg", "#111111"),
      // Passed to canvas verbatim — the quotes around 'Geist Pixel' are part
      // of a valid font stack, and stripping them breaks the whole list.
      font: v("--font-body", "system-ui, sans-serif"),
    };
  }

  // The theme variables are hex or rgb() depending on the token, so alpha has
  // to cope with both rather than assuming #rrggbb.
  function withAlpha(color, alpha) {
    var hex = color.match(/^#([0-9a-f]{6})$/i);
    if (hex) {
      var n = parseInt(hex[1], 16);
      return "rgba(" + [(n >> 16) & 255, (n >> 8) & 255, n & 255].join(", ") + ", " + alpha + ")";
    }
    var rgb = color.match(/^rgba?\(([^)]+)\)$/);
    if (rgb) {
      var parts = rgb[1].split(",").map(function (s) { return s.trim(); });
      return "rgba(" + parts.slice(0, 3).join(", ") + ", " + alpha + ")";
    }
    return color;
  }

  function roleColor(p, role) {
    return role === "secondary" ? p.secondary : role === "muted" ? p.muted : p.accent;
  }

  function wrap(label, perLine) {
    var words = String(label).split(" ");
    var lines = [];
    var line = "";
    words.forEach(function (word) {
      var next = line ? line + " " + word : word;
      if (next.length > perLine && line) {
        lines.push(line);
        line = word;
      } else {
        line = next;
      }
    });
    if (line) lines.push(line);
    return lines.length > 1 ? lines : lines[0] || "";
  }

  // ── Plugins ─────────────────────────────────────────────────
  // Chart.js has no data labels, and the note beside each bar is the whole
  // point of several of these figures — "70–100" printed against a bar drawn
  // at 85, or "50 hours — nobody does this".
  var noteLabels = {
    id: "obNoteLabels",
    afterDatasetsDraw: function (chart, _args, opts) {
      var notes = chart.$obNotes || [];
      if (!notes.length) return;
      var meta = chart.getDatasetMeta(0);
      var ctx = chart.ctx;
      var vertical = chart.$obVertical;
      ctx.save();
      ctx.textBaseline = vertical ? "bottom" : "middle";
      ctx.textAlign = vertical ? "center" : "left";
      meta.data.forEach(function (bar, i) {
        var note = notes[i];
        if (!note) return;
        var hot = chart.$obHighlight[i];
        ctx.font = (hot ? "700 " : "") + "12px " + opts.font;
        ctx.fillStyle = hot ? opts.accent : opts.muted;
        // A floating bar is drawn from its start, so the note goes past
        // whichever end is further from the baseline.
        if (vertical) {
          ctx.fillText(note, bar.x, Math.min(bar.y, bar.base || Infinity) - 6);
        } else {
          ctx.fillText(note, Math.max(bar.x, bar.base || 0) + 8, bar.y);
        }
      });
      ctx.restore();
    },
  };

  // Vertical reference lines with a label — sunset, a sampling ceiling, the
  // point where two curves cross. Small enough not to justify a plugin
  // dependency, and it keeps the CSP surface at one script.
  var marks = {
    id: "obMarks",
    afterDatasetsDraw: function (chart, _args, opts) {
      var list = chart.$obMarks || [];
      if (!list.length) return;
      var x = chart.scales.x;
      var area = chart.chartArea;
      var ctx = chart.ctx;
      ctx.save();
      list.forEach(function (m) {
        var px = x.getPixelForValue(m.at);
        if (!isFinite(px)) return;
        ctx.beginPath();
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = opts.muted;
        ctx.lineWidth = 1;
        ctx.moveTo(px, area.top);
        ctx.lineTo(px, area.bottom);
        ctx.stroke();
        if (m.text) {
          ctx.setLineDash([]);
          ctx.font = "11px " + opts.font;
          ctx.fillStyle = opts.muted;
          ctx.textBaseline = "top";
          var right = px + 6 + ctx.measureText(m.text).width > area.right;
          ctx.textAlign = right ? "right" : "left";
          ctx.fillText(m.text, px + (right ? -6 : 6), area.top + 4);
        }
      });
      ctx.restore();
    },
  };

  // ── Annotations ─────────────────────────────────────────────
  // Three shapes, all built from the spec at paint time so they pick up a
  // theme change like everything else:
  //
  //   bands:    [{ from, to, axis, text, style }]   a shaded region
  //   lines:    [{ at, axis, text, style, dashed }] a reference line
  //   callouts: [{ x, y, text, style, arrowTo }]    text, optionally with a
  //                                                 leader line to a point
  //
  // `axis` is "x" (default) or "y". On a horizontal bar chart the value axis
  // is x, so a threshold is `axis: "x"` there and `axis: "y"` on a vertical
  // one — the same way you would read it off the picture.
  function buildAnnotations(spec, p) {
    if (!annotationPlugin) return {};
    var out = {};
    var n = 0;

    (spec.bands || []).forEach(function (b) {
      var c = roleColor(p, b.style);
      var y = b.axis === "y";
      out["band" + n++] = {
        type: "box",
        xMin: y ? undefined : b.from,
        xMax: y ? undefined : b.to,
        yMin: y ? b.from : undefined,
        yMax: y ? b.to : undefined,
        backgroundColor: withAlpha(c, 0.12),
        borderWidth: 0,
        drawTime: "beforeDatasetsDraw",
        label: b.text
          ? {
              display: true,
              content: wrap(b.text, 18),
              position: { x: "center", y: "start" },
              color: c,
              font: { family: p.font, size: 11 },
              backgroundColor: "transparent",
            }
          : undefined,
      };
    });

    (spec.lines || []).forEach(function (l) {
      var c = roleColor(p, l.style);
      var y = l.axis === "y";
      out["line" + n++] = {
        type: "line",
        xMin: y ? undefined : l.at,
        xMax: y ? undefined : l.at,
        yMin: y ? l.at : undefined,
        yMax: y ? l.at : undefined,
        borderColor: c,
        borderWidth: 1,
        borderDash: l.dashed === false ? [] : [4, 4],
        label: l.text
          ? {
              display: true,
              content: l.text,
              position: l.position || "end",
              color: c,
              font: { family: p.font, size: 11 },
              backgroundColor: withAlpha(p.bg, 0.85),
              padding: { x: 5, y: 2 },
            }
          : undefined,
      };
    });

    // A callout is a label; the arrow is a second annotation drawn to the
    // point it is talking about, because a label cannot draw its own leader.
    (spec.callouts || []).forEach(function (c) {
      var col = roleColor(p, c.style);
      var id = "callout" + n++;
      out[id] = {
        type: "label",
        xValue: c.x,
        yValue: c.y,
        content: wrap(c.text, c.wrap || 26),
        color: col,
        font: { family: p.font, size: 11 },
        backgroundColor: withAlpha(p.bg, 0.85),
        padding: { x: 5, y: 3 },
        textAlign: c.align || "left",
        position: "center",
      };
      if (c.arrowTo) {
        out[id + "arrow"] = {
          type: "line",
          xMin: c.x,
          xMax: c.arrowTo.x,
          yMin: c.y,
          yMax: c.arrowTo.y,
          borderColor: withAlpha(col, 0.7),
          borderWidth: 1,
          arrowHeads: { end: { display: true, length: 6, width: 4, fill: true } },
        };
      }
    });

    return out;
  }

  // ── Builders ────────────────────────────────────────────────
  function baseOptions(spec) {
    return {
      responsive: true,
      maintainAspectRatio: false,
      animation: reduceMotion ? false : { duration: 700, easing: "easeOutQuart" },
      interaction: { intersect: false, mode: "nearest" },
      plugins: {
        legend: { display: false },
        obMarks: {},
        tooltip: { displayColors: false },
      },
      scales: {
        x: { title: { display: !!spec.key, text: spec.key || "" } },
        y: { title: { display: !!spec.yKey, text: spec.yKey || "" } },
      },
    };
  }

  // Horizontal bars, including floating ones: a bar given `from`/`to` is a
  // range rather than a value, which is what the "species sound alike" and
  // "what 384 kHz means" figures are actually showing.
  function buildBars(canvas, spec) {
    var bars = spec.bars || [];
    var floating = bars.some(function (b) { return b.from !== undefined || b.to !== undefined; });
    var notes = bars.map(function (b) { return b.note || ""; });
    var longest = notes.reduce(function (a, b) { return b.length > a.length ? b : a; }, "");

    // Bars run sideways by default — the labels are species names and other
    // long phrases, which have room there. `vertical: true` is for the figures
    // where the category is an ordinal the reader scans left to right: pulse
    // 1..8, a month, a step in a sequence.
    var vertical = spec.vertical === true;
    var val = vertical ? "y" : "x";
    var cat = vertical ? "x" : "y";

    var options = baseOptions(spec);
    options.indexAxis = vertical ? "x" : "y";
    options.layout = vertical
      ? { padding: { top: 18, right: 8 } }
      : { padding: { right: 16 + longest.length * 7, top: 4 } };
    options.plugins.obNoteLabels = {};
    options.scales[val].beginAtZero = !floating;
    options.scales[val].max = spec.max || undefined;
    options.scales[val].min = spec.min !== undefined && spec.min !== null ? spec.min : undefined;
    options.scales[val].border = { display: false };
    options.scales[val].ticks = {
      precision: 0,
      display: (vertical ? spec.yTicks : spec.xTicks) !== false,
    };
    // A log scale is the honest way to draw a spread of four orders of
    // magnitude, but it has to be asked for: it makes a 1000x difference look
    // like a 3x one, so it is never the default.
    if (spec.scale === "log") {
      options.scales[val].type = "logarithmic";
      options.scales[val].beginAtZero = false;
      options.scales[val].min = spec.min || undefined;
    }
    options.scales[cat].grid = { display: false };
    options.scales[cat].border = { display: false };
    // The category axis carries the names. A 48-bar chart has no room for
    // them, and says what it means through a handful of callouts instead.
    options.scales[cat].ticks = {
      display: (vertical ? spec.xTicks : spec.yTicks) !== false,
    };

    // Bars have no legend of their own — one dataset, and Chart.js would list
    // every bar. `groups` names the style roles instead, which is what a
    // colour-coded chart actually needs explaining.
    var groups = spec.groups || [];
    options.plugins.legend = {
      display: groups.length > 0,
      position: "bottom",
      labels: { generateLabels: function () { return []; } },
    };

    var chart = new Chart(canvas.getContext("2d"), {
      type: "bar",
      plugins: [noteLabels, marks],
      data: {
        labels: bars.map(function (b) { return b.label; }),
        datasets: [{
          data: bars.map(function (b) {
            return floating ? [b.from || 0, b.to !== undefined ? b.to : b.value] : b.value;
          }),
          borderWidth: 0,
          borderRadius: 4,
          // The point of several of these charts is a value so small it is
          // barely a mark. Without this it rounds away to nothing on a phone.
          minBarLength: floating ? 0 : 2,
          barPercentage: 0.72,
          categoryPercentage: 0.9,
        }],
      },
      options: options,
    });
    chart.$obNotes = notes;
    chart.$obVertical = vertical;
    chart.$obGroups = groups;
    chart.$obHighlight = bars.map(function (b) { return b.highlight === true; });
    chart.$obRoles = bars.map(function (b) { return b.style || null; });
    chart.$obPaint = paintBars;
    return chart;
  }

  function paintBars(chart, p) {
    var ds = chart.data.datasets[0];
    ds.backgroundColor = chart.$obHighlight.map(function (hot, i) {
      var base = roleColor(p, chart.$obRoles[i]);
      return hot ? base : withAlpha(base, 0.55);
    });
    ds.hoverBackgroundColor = p.accent;

    var o = chart.options;
    var spec = chart.$obSpec || {};
    var val = chart.$obVertical ? "y" : "x";
    var cat = chart.$obVertical ? "x" : "y";
    o.plugins.obNoteLabels = { accent: p.accent, muted: p.muted, font: p.font };
    if ((chart.$obGroups || []).length) {
      o.plugins.legend.labels = {
        color: p.secondary,
        font: { family: p.font, size: 12 },
        boxWidth: 12,
        boxHeight: 12,
        usePointStyle: true,
        pointStyle: "rectRounded",
        generateLabels: function () {
          return chart.$obGroups.map(function (g) {
            var base = roleColor(p, g.style);
            return {
              text: g.name,
              fillStyle: g.style === "highlight" ? base : withAlpha(base, 0.55),
              strokeStyle: "transparent",
              lineWidth: 0,
            };
          });
        },
      };
    }
    // When every bar prints its own number, the scale behind them is noise.
    o.scales[val].grid = {
      color: withAlpha(p.border, 0.7),
      display: (chart.$obVertical ? spec.yGrid : spec.xGrid) !== false,
    };
    o.scales[val].ticks.color = p.muted;
    o.scales[val].ticks.font = { family: p.font, size: 11 };
    o.scales[cat].ticks = {
      // paint() replaces this object wholesale, so the display flag set at
      // construction has to be restated here or it is silently lost.
      display: (chart.$obVertical ? spec.xTicks : spec.yTicks) !== false,
      color: function (c) { return chart.$obHighlight[c.index] ? p.accent : p.secondary; },
      font: function (c) {
        return { family: p.font, size: 13, weight: chart.$obHighlight[c.index] ? 700 : 400 };
      },
      crossAlign: "far",
      // Every bar is named, always. Wrapped labels are taller, and Chart.js
      // answers that by dropping every other one unless told not to.
      autoSkip: false,
      callback: function (_value, index) {
        return wrap(chart.data.labels[index], this.chart.width < 560 ? 16 : 40);
      },
    };
  }

  // Lines and scatters. Several of these figures are shapes rather than
  // measurements — a season, a night, a trade-off — so the y axis can be
  // turned off entirely rather than inviting people to read values off it.
  function buildSeries(canvas, spec) {
    var scatter = spec.type === "scatter";
    var options = baseOptions(spec);
    options.plugins.legend = { display: spec.legend !== false && (spec.series || []).length > 1, position: "bottom" };
    options.scales.x.border = { display: false };
    options.scales.x.ticks = { display: spec.xTicks !== false, autoSkip: false, maxRotation: 0 };
    options.scales.y.border = { display: false };
    options.scales.y.ticks = { display: spec.yTicks === true };
    options.scales.y.grid = { display: spec.yGrid !== false };
    options.scales.y.beginAtZero = spec.beginAtZero !== false;
    if (scatter) options.scales.x.type = "linear";

    var chart = new Chart(canvas.getContext("2d"), {
      type: scatter ? "scatter" : "line",
      plugins: [marks],
      data: {
        labels: spec.labels || [],
        datasets: (spec.series || []).map(function (s) {
          return {
            label: s.name || "",
            data: s.data,
            showLine: scatter ? s.line === true : true,
            // A step is a thing that happened at a moment — an arousal, a
            // threshold crossing. Smoothing it would draw a gradual change
            // the data does not claim.
            stepped: s.stepped === true ? "after" : false,
            tension: s.stepped === true || s.curve === false ? 0 : 0.4,
            borderWidth: 3,
            borderDash: s.dashed ? [7, 5] : [],
            pointRadius: scatter ? 5 : s.points ? 4 : 0,
            pointHoverRadius: 6,
            fill: s.fill === true ? "origin" : false,
          };
        }),
      },
      options: options,
    });
    chart.$obRoles = (spec.series || []).map(function (s) { return s.style || null; });
    chart.$obFill = (spec.series || []).map(function (s) { return s.fill === true; });
    chart.$obPaint = paintSeries;
    return chart;
  }

  function paintSeries(chart, p) {
    chart.data.datasets.forEach(function (ds, i) {
      var c = roleColor(p, chart.$obRoles[i]);
      ds.borderColor = c;
      ds.pointBackgroundColor = c;
      ds.backgroundColor = chart.$obFill[i] ? withAlpha(c, 0.18) : c;
    });
    var o = chart.options;
    o.plugins.legend.labels = {
      color: p.secondary,
      font: { family: p.font, size: 12 },
      boxWidth: 12,
      boxHeight: 12,
      usePointStyle: true,
      pointStyle: "rectRounded",
    };
    o.scales.x.grid = { display: false };
    o.scales.x.ticks.color = p.muted;
    o.scales.x.ticks.font = { family: p.font, size: 11 };
    o.scales.y.grid.color = withAlpha(p.border, 0.7);
    o.scales.y.ticks.color = p.muted;
    o.scales.y.ticks.font = { family: p.font, size: 11 };
  }

  function build(canvas) {
    var spec;
    try {
      spec = JSON.parse(canvas.getAttribute("data-chart"));
    } catch (e) {
      return;
    }
    var chart =
      spec.type === "line" || spec.type === "scatter"
        ? (spec.series || []).length && buildSeries(canvas, spec)
        : (spec.bars || []).length && buildBars(canvas, spec);
    if (!chart) return;
    chart.$obMarks = spec.marks || [];
    chart.$obSpec = spec;
    charts.push(chart);
    paint(chart);
  }

  // Everything colour-dependent is set here rather than at construction, so a
  // theme change is the same code path as the first render.
  function paint(chart) {
    var p = palette();
    chart.$obPaint(chart, p);
    var o = chart.options;
    o.plugins.obMarks = { muted: p.muted, font: p.font };
    if (annotationPlugin) {
      o.plugins.annotation = { annotations: buildAnnotations(chart.$obSpec || {}, p) };
    }
    o.plugins.tooltip.backgroundColor = p.border;
    o.plugins.tooltip.titleColor = p.secondary;
    o.plugins.tooltip.bodyColor = p.secondary;
    o.plugins.tooltip.titleFont = { family: p.font, size: 12 };
    o.plugins.tooltip.bodyFont = { family: p.font, size: 12, weight: 700 };
    [o.scales.x.title, o.scales.y.title].forEach(function (t) {
      t.color = p.muted;
      t.font = { family: p.font, size: 11 };
    });
    chart.update(reduceMotion ? "none" : undefined);
  }

  function init() {
    document.querySelectorAll("canvas[data-chart]").forEach(build);
    if (!charts.length) return;

    // The body font is a webfont; measuring it before it lands gives a chart
    // laid out for the fallback and then left that way.
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { charts.forEach(paint); });
    }

    // The toggle in base.njk flips data-theme on <html> and nothing else —
    // watching that attribute keeps the charts in step without touching it.
    new MutationObserver(function () {
      charts.forEach(paint);
    }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
