import { readFileSync, readdirSync, statSync } from "fs";
import { join, extname } from "path";
import markdownIt from "markdown-it";
import { transformCallouts } from "./lib/callouts.js";

const BLOG_DIR = "2.0 - Blog Posts";

// Kept in step with the slugify in _data/eleventyComputed.js, which is what
// actually decides a post's URL.
const slugify = (s) =>
  String(s)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/['\u2019]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

function buildWikilinkMap(rootDir) {
  const map = new Map();
  const skip = new Set(["node_modules", "_site", ".obsidian", ".git", ".claude", "96 - Hidden Notes", "99 - Not For Publish", "98 - Media", "97 - Drafts"]);
  function walk(dir) {
    try {
      for (const entry of readdirSync(dir)) {
        const full = join(dir, entry);
        try {
          if (statSync(full).isDirectory()) {
            if (!skip.has(entry)) walk(full);
          } else if (extname(entry) === ".md") {
            const raw = readFileSync(full, "utf8");
            const fm = raw.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? "";
            if (!/^publish:\s*true/m.test(fm)) continue;
            const permalink = fm.match(/^permalink:\s*(.+)$/m)?.[1]?.trim();
            const title = fm.match(/^title:\s*(.+)$/m)?.[1]?.trim().replace(/^["']|["']$/g, "");
            // Blog posts normally carry no permalink of their own — theirs is
            // computed from the title in _data/eleventyComputed.js, and the
            // same rule has to be applied here or [[a post]] never resolves.
            const blogPost = full.includes(`${BLOG_DIR}/`);
            if (!permalink && !blogPost) continue;
            const url = permalink
              ? (permalink.startsWith("/") ? permalink : "/" + permalink).replace(/\/?$/, "/")
              : `/blog/${slugify(title || entry.replace(/\.md$/, ""))}/`;
            if (title) map.set(title.toLowerCase(), url);
            map.set(entry.replace(/\.md$/, "").toLowerCase(), url);
          }
        } catch {}
      }
    } catch {}
  }
  walk(rootDir);
  return map;
}

function wikilinkPlugin(md, wikilinkMap) {
  md.core.ruler.push("wikilinks", (state) => {
    for (const block of state.tokens) {
      if (block.type !== "inline" || !block.children) continue;
      const out = [];
      for (const tok of block.children) {
        if (tok.type !== "text" || !tok.content.includes("[[")) {
          out.push(tok);
          continue;
        }
        const re = /\[\[([^\]|]+?)(?:\|([^\]]+?))?\]\]/g;
        let last = 0, m;
        let matched = false;
        while ((m = re.exec(tok.content)) !== null) {
          matched = true;
          if (m.index > last) {
            const t = new state.Token("text", "", 0);
            t.content = tok.content.slice(last, m.index);
            out.push(t);
          }
          const [, page, display] = m;
          const label = (display || page).trim();
          const href = wikilinkMap.get(page.trim().toLowerCase()) ?? wikilinkMap.get((display || page).trim().toLowerCase());
          if (href) {
            const o = new state.Token("link_open", "a", 1);
            o.attrs = [["href", href], ["class", "wikilink"]];
            out.push(o);
            const t = new state.Token("text", "", 0);
            t.content = label;
            out.push(t);
            out.push(new state.Token("link_close", "a", -1));
          } else {
            const t = new state.Token("html_inline", "", 0);
            t.content = `<span class="wikilink">${label}</span>`;
            out.push(t);
          }
          last = m.index + m[0].length;
        }
        if (matched && last < tok.content.length) {
          const t = new state.Token("text", "", 0);
          t.content = tok.content.slice(last);
          out.push(t);
        } else if (!matched) {
          out.push(tok);
        }
      }
      block.children = out;
    }
  });
}

// Give every h2..h6 an id derived from its text, so any section on any page
// can be linked to directly with /page/#the-heading. Nothing is drawn — the
// id is the whole feature. Ids are
// deduped per document (a repeated heading gets -2, -3, ...). Written by
// hand rather than pulled in as markdown-it-anchor: it is twenty lines and
// the site deliberately carries no dependencies it doesn't need.
function headingAnchorPlugin(md) {
  md.core.ruler.push("heading-anchors", (state) => {
    const seen = new Map();
    for (let i = 0; i < state.tokens.length; i++) {
      const open = state.tokens[i];
      if (open.type !== "heading_open") continue;
      if (!/^h[2-6]$/.test(open.tag)) continue;
      const inline = state.tokens[i + 1];
      if (!inline || inline.type !== "inline") continue;

      const base = slugify(inline.content.replace(/\[\[([^\]|]+?)(?:\|([^\]]+?))?\]\]/g, "$2$1"));
      if (!base) continue;
      const n = (seen.get(base) ?? 0) + 1;
      seen.set(base, n);
      const id = n === 1 ? base : `${base}-${n}`;
      open.attrSet("id", id);
    }
  });
}

function parseSlidesFromBlock(blockHtml) {
  const slides = [];
  if (!blockHtml.trim()) return slides;
  const blocks = blockHtml.split(/(?=<h2)/i);
  for (const block of blocks) {
    if (!block.trim()) continue;
    const titleMatch = block.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
    if (!titleMatch) continue;
    let rawTitle = titleMatch[1].replace(/<[^>]+>/g, '').trim()
      .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"').replace(/&#39;/g, "'");
    if (!rawTitle || /gallery-(start|end)/i.test(rawTitle)) continue;
    let nativeAspect = false;
    if (/\[AR\]/i.test(rawTitle)) {
      nativeAspect = true;
      rawTitle = rawTitle.replace(/\[AR\]/i, '').trim();
    }
    const blockTitle = rawTitle;
    const contentWithoutTitle = block.replace(/<h2[^>]*>[\s\S]*?<\/h2>/i, '');
    const imgRegex = /<img[^>]+src="([^"]+)"/gi;
    const imgsFound = [];
    let igm;
    while ((igm = imgRegex.exec(contentWithoutTitle)) !== null) imgsFound.push(igm[1]);
    const urlRegex = /((?:https?:\/\/|\/)[^\s<"']+\.(?:jpg|jpeg|png|gif|webp|avif|JPG|JPEG|PNG|GIF|WEBP|AVIF))/gi;
    const rawUrls = [];
    let um;
    while ((um = urlRegex.exec(contentWithoutTitle)) !== null) {
      if (!imgsFound.includes(um[1])) rawUrls.push(um[1]);
    }
    const uniqueRawUrls = [...new Set(rawUrls)];
    let pureCaption = contentWithoutTitle
      .replace(/<img[^>]+>/gi, '')
      .replace(/<a[^>]+>https?:\/\/[^<]+<\/a>/gi, '')
      .replace(/(?:https?:\/\/|\/)[^\s<"']+\.(?:jpg|jpeg|png|gif|webp|avif|JPG|JPEG|PNG|GIF|WEBP|AVIF)/gi, '')
      .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
      .replace(/<p>\s*<\/p>/gi, '')
      .trim();
    const srcList = imgsFound.length > 0 ? imgsFound : uniqueRawUrls;
    srcList.forEach((src, idx) => {
      slides.push({ type: 'image', src, title: blockTitle, nativeAspect, caption: idx === 0 ? pureCaption : '' });
    });
  }
  return slides;
}

function buildInlineGallery(uid, slides, hideClass = '') {
  const swiperId = `post-swiper-${uid}`;
  const paginationId = `post-pagination-${uid}`;
  const captionAreaId = `post-caption-${uid}`;
  const titleId = `post-slide-title-${uid}`;
  const descId = `post-slide-desc-${uid}`;
  const dataVar = `postGalleryData${uid}`;
  const esc = (s) => (s || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const desktopSlides = slides.map(img => {
    const onload = img.nativeAspect
      ? `onload="this.classList.add('is-native-ar')"`
      : `onload="this.classList.add(this.naturalWidth>this.naturalHeight?'is-landscape':'is-portrait')"`;
    return `<div class="swiper-slide"><div class="slide-inner"><img src="${esc(img.src)}" alt="${esc(img.title)}" loading="lazy" ${onload}></div></div>`;
  }).join('');
  const allNativeAspect = slides.every(img => img.nativeAspect);
  const slidesJson = JSON.stringify(slides).replace(/<\/script>/gi, '<\\/script>');
  return `<div class="gallery-body${hideClass}" style="margin-top:2rem;margin-bottom:2rem;"><div class="gallery-slideshow-container"><div class="swiper gallery-swiper${allNativeAspect ? ' native-ar' : ''}" id="${swiperId}"><div class="swiper-wrapper">${desktopSlides}</div><div class="swiper-button-prev"></div><div class="swiper-button-next"></div></div><div class="gallery-pagination swiper-pagination" id="${paginationId}"></div><div id="${captionAreaId}" class="gallery-caption-external" style="display:none;"><h3 id="${titleId}"></h3><p id="${descId}"></p></div></div><script>(function(){var ${dataVar}=${slidesJson};document.addEventListener('DOMContentLoaded',function(){var tEl=document.getElementById('${titleId}');var dEl=document.getElementById('${descId}');var cArea=document.getElementById('${captionAreaId}');function upd(i){var d=${dataVar}[i];if(!d)return;tEl.textContent=d.title||'';dEl.innerHTML=d.caption||'';cArea.style.display=(d.title||d.caption)?'block':'none';}new Swiper('#${swiperId}',{loop:true,keyboard:{enabled:true},speed:600,autoHeight:${allNativeAspect ? 'true' : 'false'},pagination:{el:'#${paginationId}',type:'fraction',renderFraction:function(c,t){return'<span class="'+c+'"></span> <span class="fraction-sep">of</span> <span class="'+t+'"></span>';}},navigation:{nextEl:'#${swiperId} .swiper-button-next',prevEl:'#${swiperId} .swiper-button-prev'},on:{init:function(){upd(this.realIndex);},slideChange:function(){upd(this.realIndex);}}});});}());</script></div>`;
}

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("static");
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy({
    "node_modules/chart.js/dist/chart.umd.min.js": "static/js/chart.umd.min.js",
    // Bands, threshold lines and text callouts. Self-hosted for the same
    // reason Chart.js is — the CSP is script-src 'self'.
    "node_modules/chartjs-plugin-annotation/dist/chartjs-plugin-annotation.min.js":
      "static/js/chartjs-plugin-annotation.min.js",
  });
  eleventyConfig.addPassthroughCopy({ "static/images/favicon.ico": "favicon.ico" });

  // Markdown-it with HTML enabled + Obsidian-style wikilinks
  const wikilinkMap = buildWikilinkMap(".");
  const md = markdownIt({ html: true, linkify: true, typographer: true });
  wikilinkPlugin(md, wikilinkMap);
  headingAnchorPlugin(md);
  eleventyConfig.setLibrary("md", md);

  // Strip Obsidian artifacts from rendered content
  eleventyConfig.addTransform("stripObsidianArtifacts", (content, outputPath) => {
    if (typeof outputPath !== "string" || !outputPath.endsWith(".html")) return content;
    // Remove hashtag-only paragraphs (#bats #hardware etc.)
    content = content.replace(/<p>(\s*#[\w-]+)+\s*<\/p>/g, "");
    // Remove reading-time paragraph (Obsidian plugin, JS never runs)
    content = content.replace(/<p[^>]*id="reading-time"[^>]*>[\s\S]*?<\/p>/g, "");
    return content;
  });

  // Transform Obsidian callouts into styled divs. The finding of them is
  // shared with the app feed, which wants the same callouts in its own markup.
  eleventyConfig.addTransform("callouts", (content, outputPath) => {
    if (typeof outputPath !== "string" || !outputPath.endsWith(".html")) return content;
    return transformCallouts(content);
  });

  eleventyConfig.addTransform("inlineGalleries", (content, outputPath) => {
    if (typeof outputPath !== "string" || !outputPath.endsWith(".html")) return content;
    if (!content.includes("gallery-start")) return content;
    let uid = 0;
    return content.replace(
      /<h2[^>]*>\s*gallery-start(\s*\[(HIDEM|HIDEW)\])?\s*<\/h2>([\s\S]*?)<h2[^>]*>\s*gallery-end\s*<\/h2>/gi,
      (_, __, hideTag, inner) => {
        const slides = parseSlidesFromBlock(inner);
        if (!slides.length) return '';
        const hideClass = hideTag === 'HIDEM' ? ' hide-mobile' : hideTag === 'HIDEW' ? ' hide-web' : '';
        return buildInlineGallery(uid++, slides, hideClass);
      }
    );
  });

  eleventyConfig.addFilter("markdown", (content) => {
    if (!content) return "";
    return md.render(content);
  });

  eleventyConfig.addFilter("limit", (arr, n) => (arr || []).slice(0, n));

  eleventyConfig.addFilter("ensureArray", (val) => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    return String(val).split(",").map((s) => s.trim()).filter(Boolean);
  });

  eleventyConfig.addFilter("year", () => new Date().getFullYear());

  eleventyConfig.addFilter("readableDate", (dateObj) => {
    if (!dateObj) return "";
    const d = dateObj instanceof Date ? dateObj : new Date(dateObj);
    // UTC: a date-only frontmatter value is parsed as UTC midnight, so
    // formatting it in a behind-UTC local zone would print the day before.
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
  });

  eleventyConfig.addFilter("isoDate", (dateObj) => {
    if (!dateObj) return "";
    const d = dateObj instanceof Date ? dateObj : new Date(dateObj);
    return d.toISOString().split("T")[0];
  });

  // ── Blog ────────────────────────────────────────────────────
  // A post is any published markdown file inside "2.0 - Blog Posts/".
  // Nothing in the frontmatter marks it as a post; the folder does.
  const isPost = (item) =>
    String(item.inputPath || "").includes("/2.0 - Blog Posts/") &&
    String(item.data.publish).trim().toLowerCase() === "true";

  const byNewest = (a, b) => (b.date || 0) - (a.date || 0);

  eleventyConfig.addCollection("posts", (api) =>
    api.getAll().filter(isPost).sort(byNewest)
  );

  // `featured: true` lifts a post out of the grid and into the ticker at the
  // top of /blog/ and /. Everything else falls through to `regularPosts`.
  eleventyConfig.addCollection("regularPosts", (api) =>
    api.getAll().filter((i) => isPost(i) && i.data.featured !== true).sort(byNewest)
  );

  // `priority` orders the featured posts in the ticker: 1 runs first, then 2,
  // and so on. It is optional — a featured post without one sorts after every
  // post that has one, and ties (including two posts given the same number)
  // fall back to newest first, which is what the ticker did before priorities
  // existed. Only featured posts are ordered by it; a post pulled in merely to
  // top the ticker up to three slides is always there by date.
  const byPriority = (a, b) => {
    const pa = Number(a.data.priority);
    const pb = Number(b.data.priority);
    const ha = Number.isFinite(pa);
    const hb = Number.isFinite(pb);
    if (ha && hb && pa !== pb) return pa - pb;
    if (ha !== hb) return ha ? -1 : 1;
    return byNewest(a, b);
  };

  // Up to three slides for the featured ticker on / and /blog/: featured posts
  // first (in `priority` order), topped up with the newest remaining posts so
  // the ticker still has three slides when only one post is marked featured.
  const tickerPosts = (api) => {
    const posts = api.getAll().filter(isPost).sort(byNewest);
    const featured = posts.filter((i) => i.data.featured === true).sort(byPriority);
    const rest = posts.filter((i) => i.data.featured !== true);
    return [...featured, ...rest].slice(0, 3);
  };

  eleventyConfig.addCollection("heroPosts", tickerPosts);

  // The "Recent posts" row at the foot of the home page. It is the newest
  // posts, minus anything the ticker at the top of that same page is already
  // showing — otherwise featuring a recent post would print it twice on one
  // page. Mirrors heroPosts' own top-up rule, so the two never collide.
  eleventyConfig.addCollection("recentPosts", (api) => {
    const inTicker = new Set(tickerPosts(api).map((i) => i.url));
    return api
      .getAll()
      .filter(isPost)
      .sort(byNewest)
      .filter((i) => !inTicker.has(i.url))
      .slice(0, 3);
  });

  eleventyConfig.addFilter("getAllTags", (collection) => {
    const tags = new Set();
    (collection || []).forEach((item) => {
      (item.data.tags || []).forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).sort();
  });

  // Posts sharing tags with this one, rarest tag first so a tag every post
  // carries ("openbat") counts for less than a specific one ("firmware").
  eleventyConfig.addFilter("relatedPosts", (collection, currentUrl, tags) => {
    if (!collection?.length || !tags?.length) return [];
    const pageTags = Array.from(tags).map((t) => String(t).toLowerCase().trim());

    const freq = {};
    collection.forEach((i) => {
      (i.data.tags || []).forEach((t) => {
        const k = String(t).toLowerCase().trim();
        freq[k] = (freq[k] || 0) + 1;
      });
    });

    return collection
      .filter((i) => {
        if (i.url === currentUrl) return false;
        const itemTags = (i.data.tags || []).map((t) => String(t).toLowerCase().trim());
        return itemTags.some((t) => pageTags.includes(t));
      })
      .map((i) => {
        const itemTags = (i.data.tags || []).map((t) => String(t).toLowerCase().trim());
        const score = itemTags
          .filter((t) => pageTags.includes(t))
          .reduce((sum, t) => sum + 1 / (freq[t] || 1), 0);
        return { item: i, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((r) => r.item);
  });

  // First paragraph of the body, for cards where the author gave no excerpt.
  eleventyConfig.addFilter("autoExcerpt", (content, len = 180) => {
    const text = String(content || "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (text.length <= len) return text;
    return text.slice(0, text.lastIndexOf(" ", len)) + "\u2026";
  });

  // Splits a rendered page into one card per top-level <h2>, so the standard
  // pages carry the same stack-of-cards look as the home page without every
  // .md file having to wrap its own sections in HTML.
  //
  // Only headings that sit outside any open container start a card, so a page
  // that builds its own structure keeps it. `.plat-section` (the platform
  // toggle on /help/) is the exception: it is a wrapper the toggle shows and
  // hides, not a visual block, so the split recurses inside it and the wrapper
  // itself is passed through whole — cutting it in two would leave the
  // opening and closing tags in different cards and break the toggle.
  // Anything that doesn't parse cleanly is handed back untouched.
  const VOID_TAGS = new Set([
    "area", "base", "br", "col", "embed", "hr", "img", "input", "link",
    "meta", "param", "source", "track", "wbr",
  ]);
  const PASSTHROUGH = /class\s*=\s*["'][^"']*\bplat-section\b/;
  // `.page-plain` is the author's opt-out for a single block: a page intro or
  // a pull quote that should sit on the page rather than in a card. Unlike
  // `.plat-section` it is emitted verbatim, headings and all, so nothing
  // inside it is cut into cards.
  const PLAIN = /class\s*=\s*["'][^"']*\bpage-plain\b/;
  // An explicit card, written by the author or emitted by the `## SECTIONSTART ##`
  // preprocessor below. Unlike the two above it is not passed through verbatim:
  // its CONTENTS become a card part like any other, so an authored card is
  // measured for width (half, note, media, quote) exactly as an h2-split one
  // is. Without that, hand-marked sections would all come out full width and a
  // page would change shape the moment it adopted the markers.
  const EXPLICIT = /class\s*=\s*["'][^"']*\bpage-card\b/;
  const TAG = /<(\/?)([a-zA-Z][\w-]*)([^>]*?)(\/?)>/g;

  const isBlank = (html) =>
    !html.replace(/<[^>]+>/g, "").trim() && !/<(img|table|iframe|video)/i.test(html);

  const toCards = (html) => {
    if (!html.trim()) return html;

    const tag = new RegExp(TAG.source, "g");
    const parts = [];      // finished pieces: {card: html} or {raw: html}
    let section = "";      // the card being accumulated
    let depth = 0;
    let cursor = 0;        // start of the unconsumed remainder
    let wrapperAt = -1;    // where the current passthrough wrapper opened
    let wrapperCards = false; // …and whether its contents get carded
    let wrapperExplicit = false; // …or whether it IS a card, and unwraps to one
    let m;

    const flush = () => {
      if (!isBlank(section)) parts.push({ card: section });
      section = "";
    };

    while ((m = tag.exec(html))) {
      const [full, closing, name, attrs, selfClosing] = m;
      const lower = name.toLowerCase();

      if (closing) {
        depth--;
        if (depth < 0) return html;                       // unbalanced
        if (wrapperAt >= 0 && depth === 0) {
          // Close of a passthrough wrapper: recurse into its contents and
          // emit the wrapper around the cards that come back.
          const open = html.slice(wrapperAt, html.indexOf(">", wrapperAt) + 1);
          const inner = html.slice(wrapperAt + open.length, m.index);
          if (wrapperExplicit) {
            // Drop the author's wrapper and let the card be re-emitted with a
            // measured width class below.
            parts.push({ card: inner });
          } else {
            parts.push({ raw: open + (wrapperCards ? toCards(inner) : inner) + full });
          }
          cursor = m.index + full.length;
          wrapperAt = -1;
          wrapperExplicit = false;
        }
        continue;
      }
      if (VOID_TAGS.has(lower) || selfClosing) continue;

      if (depth === 0 && wrapperAt < 0) {
        if (lower === "h2") {
          section += html.slice(cursor, m.index);
          cursor = m.index;
          flush();
        } else if (
          (lower === "div" || lower === "section") &&
          (PASSTHROUGH.test(attrs) || PLAIN.test(attrs) || EXPLICIT.test(attrs))
        ) {
          section += html.slice(cursor, m.index);
          flush();
          wrapperAt = m.index;
          wrapperCards = PASSTHROUGH.test(attrs);
          wrapperExplicit =
            EXPLICIT.test(attrs) && !PASSTHROUGH.test(attrs) && !PLAIN.test(attrs);
        }
      }
      depth++;
    }

    if (depth !== 0 || wrapperAt >= 0) return html;       // unbalanced
    section += html.slice(cursor);
    flush();

    // ── Give the cards their widths ──────────────────────────────────────
    // A page of identical full-width cards reads as a list. Each card is
    // measured instead: a short one is a candidate for a half-width pair, one
    // that is little more than a quotation gets the inset treatment, and one
    // carrying an image gets the picture beside the text, alternating sides
    // down the page. Everything else stays full width.
    const text = (html) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    const meta = parts.map((part) => {
      if (part.raw) return part;
      const body = text(part.card);
      return {
        card: part.card,
        len: body.length,
        media: /<img\b/i.test(part.card),
        quote: /<blockquote\b/i.test(part.card) && body.length < 400,
        // A bare control with no prose — the platform toggle — is furniture,
        // not a section, so it is passed through rather than boxed in a card.
        bare: !/<h[1-6]\b/i.test(part.card) && body.length < 60,
      };
    });

    let mediaSeen = 0;
    const classes = meta.map((m) => {
      if (m.raw) return null;
      if (m.media) return `page-card--media page-card--media-${mediaSeen++ % 2 ? "right" : "left"}`;
      if (m.quote) return "page-card--quote";
      return null;
    });

    // Halves are marked in strict pairs, so an odd short card stays full width
    // rather than leaving half a row empty.
    const short = (i) => meta[i] && !meta[i].raw && classes[i] === null && meta[i].len < 420;
    for (let i = 0; i < meta.length - 1; i++) {
      if (short(i) && short(i + 1)) {
        classes[i] = classes[i + 1] = "page-card--half";
        i++;
      }
    }

    // What is left short and unpaired reads better inset than stretched.
    for (let i = 0; i < meta.length; i++) {
      if (!meta[i].raw && !meta[i].bare && classes[i] === null && meta[i].len < 250) {
        classes[i] = "page-card--note";
      }
    }

    // A page that is one short card looks stranded at full width — inset it.
    if (meta.length === 1 && !meta[0].raw && classes[0] === null && meta[0].len < 600) {
      classes[0] = "page-card--solo";
    }

    return meta
      .map((m, i) => {
        if (m.raw) return m.raw;
        if (m.bare) return m.card;
        return `<section class="page-card${classes[i] ? " " + classes[i] : ""}">${m.card}</section>`;
      })
      .join("\n");
  };

  eleventyConfig.addFilter("sectionCards", toCards);

  // ── Page markers ────────────────────────────────────────────
  // Structural HTML a page would otherwise have to hand-write, expressed as
  // markers a non-developer can move around without breaking anything:
  //
  //   ## IOS ##            start the iOS tab (emits the platform toggle once)
  //   ## ANDROID ##        start the Android tab
  //   ## SECTIONSTART ##   open a card
  //   ## SECTIONEND ##     close it
  //
  // Everything between them is ordinary markdown. Markers are written as h2s
  // so a plain markdown editor still renders the file readably, and are matched
  // on their own line only, so the words can appear in prose.
  //
  // Tabs and cards close themselves: a new tab or card closes whatever is open,
  // and the end of the file closes the rest. That is the point of the format —
  // an unclosed card cannot leave a stray </div> in the output.
  const MARKER = /^[ \t]*##[ \t]*(IOS|ANDROID|SECTIONSTART|SECTIONEND)[ \t]*##[ \t]*$/;

  const PLATFORM_TOGGLE = [
    '<div class="plat-toggle-wrap" role="tablist" aria-label="Platform">',
    '  <div class="plat-toggle">',
    '    <button type="button" class="plat-toggle-btn active" data-platform="ios" role="tab" aria-selected="true" aria-controls="plat-ios">',
    '      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.37 12.72c-.02-2.3 1.88-3.4 1.96-3.46-1.07-1.56-2.73-1.78-3.32-1.8-1.42-.14-2.76.83-3.48.83-.72 0-1.82-.81-2.99-.79-1.54.02-2.96.89-3.75 2.26-1.6 2.78-.41 6.9 1.15 9.16.76 1.11 1.67 2.35 2.86 2.3 1.15-.04 1.58-.74 2.97-.74 1.39 0 1.78.74 2.99.72 1.23-.02 2.01-1.12 2.76-2.24.87-1.28 1.23-2.53 1.25-2.6-.03-.01-2.39-.92-2.4-3.64zM14.1 5.6c.63-.77 1.06-1.83.94-2.9-.91.04-2.01.61-2.67 1.37-.59.68-1.1 1.76-.96 2.8 1.01.08 2.05-.51 2.69-1.27z"/></svg>',
    '      iOS',
    '    </button>',
    '    <button type="button" class="plat-toggle-btn" data-platform="android" role="tab" aria-selected="false" aria-controls="plat-android">',
    '      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 11a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><path d="M8 10 6.2 6.6M16 10l1.8-3.4"/><path d="M9.5 7.5h.01M14.5 7.5h.01"/></svg>',
    '      Android',
    '    </button>',
    '  </div>',
    '</div>',
  ].join("\n");

  const TAB_OPEN = {
    IOS: '<div class="plat-section" id="plat-ios" role="tabpanel">',
    ANDROID: '<div class="plat-section plat-hidden" id="plat-android" role="tabpanel">',
  };

  const expandMarkers = (content) => {
    const lines = content.split(/\r?\n/);
    if (!lines.some((line) => MARKER.test(line))) return null;

    const out = [];
    let card = false;
    let tab = false;
    let toggled = false;

    // Blank lines around every emitted tag: markdown-it only treats a line as
    // an HTML block when it starts one, and only resumes parsing markdown after
    // a blank line. Without them the first paragraph of a card is swallowed
    // into the raw HTML and renders as plain text.
    const emit = (html) => out.push("", html, "");
    const closeCard = () => { if (card) { emit("</section>"); card = false; } };
    const closeTab = () => { closeCard(); if (tab) { emit("</div>"); tab = false; } };

    for (const line of lines) {
      const marker = line.match(MARKER);
      if (!marker) { out.push(line); continue; }
      const name = marker[1];

      if (name === "SECTIONSTART") {
        closeCard();
        emit('<section class="page-card">');
        card = true;
      } else if (name === "SECTIONEND") {
        closeCard();
      } else {
        closeTab();
        if (!toggled) { emit(PLATFORM_TOGGLE); toggled = true; }
        emit(TAB_OPEN[name]);
        tab = true;
      }
    }
    closeTab();
    return out.join("\n");
  };

  eleventyConfig.addPreprocessor("pageMarkers", "md", (data, content) =>
    expandMarkers(content) ?? undefined
  );

  // ── Charts ──────────────────────────────────────────────────
  // {% chart {...} %} — every data figure in the blog.
  //
  // The shortcode emits data, not drawing: a <canvas data-chart="…"> that
  // static/js/openbat-charts.js hands to Chart.js, plus a plain table for
  // anyone without JS. Colours are never written here — the runtime reads them
  // from the CSS variables, so a chart follows the theme toggle.
  //
  // Chart.js is self-hosted (copied out of node_modules below) because the
  // CSP is script-src 'self'; a CDN copy would be blocked in production.
  const escapeXml = (s) =>
    String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const formatValue = (n) =>
    Number.isFinite(n) ? new Intl.NumberFormat("en-GB").format(n) : String(n);

  // The no-JS fallback is a real table rather than an apology. It is also what
  // a screen reader gets if it prefers the table to the canvas label.
  const fallbackTable = (key, rows) =>
    `<noscript><table class="chart-table">` +
    (key ? `<caption>${escapeXml(key)}</caption>` : "") +
    `<tbody>${rows}</tbody></table></noscript>`;

  const figure = (spec, alt, height, caption, table) =>
    `<figure class="chart">` +
    `<div class="chart-canvas" style="height:${height}px">` +
    `<canvas data-chart="${escapeXml(JSON.stringify(spec))}" role="img" aria-label="${escapeXml(alt)}"></canvas>` +
    `</div>` +
    table +
    (caption ? `<figcaption>${escapeXml(caption)}</figcaption>` : "") +
    `</figure>`;

  const barsFigure = (opts) => {
    const bars = (opts.bars || [])
      .map((b) => ({
        label: String(b.label ?? ""),
        // A bar is either a value from zero or a from/to range — the "species
        // that sound alike" figure is ranges, and drawing those from zero
        // would say something quite different from what the post means.
        value: b.value === undefined ? undefined : Number(b.value) || 0,
        from: b.from === undefined ? undefined : Number(b.from) || 0,
        to: b.to === undefined ? undefined : Number(b.to) || 0,
        note:
          opts.notes === false
            ? ""
            : b.note ?? (b.value === undefined ? "" : formatValue(Number(b.value))),
        highlight: b.highlight === true,
        style: b.style || undefined,
      }))
      .filter((b) => b.label || b.value !== undefined || b.from !== undefined);
    if (!bars.length) return "";

    const key = opts.key ? String(opts.key) : "";
    const spec = {
      type: "bar",
      bars,
      key,
      max: Number(opts.max) || null,
      min: opts.min === undefined ? null : Number(opts.min),
      xTicks: opts.xTicks !== false,
      yTicks: opts.yTicks !== false,
      xGrid: opts.xGrid !== false,
      yGrid: opts.yGrid !== false,
      vertical: opts.vertical === true,
      scale: opts.scale === "log" ? "log" : undefined,
      groups: opts.groups || [],
      marks: opts.marks || [],
      bands: opts.bands || [],
      lines: opts.lines || [],
      callouts: opts.callouts || [],
    };

    const describe = (b) =>
      b.note || (b.from !== undefined ? `${formatValue(b.from)} to ${formatValue(b.to)}` : formatValue(b.value));
    const alt =
      opts.alt ||
      "Bar chart, every bar drawn to the same scale: " +
        bars.map((b) => `${b.label}, ${describe(b)}`).join("; ") + ".";

    // Height is the one thing a canvas can't work out for itself — it has no
    // intrinsic size, so the row count decides it here.
    const height =
      Number(opts.height) ||
      (spec.vertical ? 320 : bars.length * 34 + (key ? 56 : 32));

    const rows = bars
      .map(
        (b) =>
          `<tr${b.highlight ? ' class="is-highlight"' : ""}><th scope="row">${escapeXml(b.label)}</th>` +
          `<td>${escapeXml(describe(b))}</td></tr>`
      )
      .join("");

    return figure(spec, alt, height, opts.caption, fallbackTable(key, rows));
  };

  const seriesFigure = (opts) => {
    const series = (opts.series || []).filter((s) => (s.data || []).length);
    if (!series.length) return "";
    const labels = (opts.labels || []).map(String);
    const key = opts.key ? String(opts.key) : "";
    const spec = {
      type: opts.type === "scatter" ? "scatter" : "line",
      labels,
      series,
      key,
      yKey: opts.yKey ? String(opts.yKey) : "",
      // Most of these curves are shapes, not measurements — a season, a night,
      // a trade-off. Numbers on the y axis would invite reading values that
      // were never claimed, so they are off unless a post asks for them.
      yTicks: opts.yTicks === true,
      xTicks: opts.xTicks !== false,
      yGrid: opts.yGrid !== false,
      legend: opts.legend !== false,
      beginAtZero: opts.beginAtZero !== false,
      marks: opts.marks || [],
      bands: opts.bands || [],
      lines: opts.lines || [],
      callouts: opts.callouts || [],
    };

    const alt =
      opts.alt ||
      (spec.type === "scatter" ? "Scatter chart. " : "Line chart. ") +
        series.map((s) => s.name).filter(Boolean).join(" against ") +
        (key ? `, across ${key.toLowerCase()}` : "") + ".";

    const height = Number(opts.height) || 320;

    // Without JS a shape is not much use, so the fallback lists the series and
    // whatever the post used for x, which is at least the claim in words.
    const rows = series
      .map(
        (s) =>
          `<tr><th scope="row">${escapeXml(s.name || "series")}</th>` +
          `<td>${escapeXml(labels.length ? labels.filter(Boolean).join(", ") : `${(s.data || []).length} points`)}</td></tr>`
      )
      .join("");

    return figure(spec, alt, height, opts.caption, fallbackTable(key, rows));
  };

  // {% panels %} … {% endpanels %} — several charts read as one figure.
  //
  // Three bar charts side by side say "heard, then weighted, then reported" in
  // a way three stacked ones do not: the comparison is the point, and it only
  // works if the eye can cross between them. Below the breakpoint they stack,
  // because three 200px panels say nothing at all.
  //
  // Nested <figure> is valid HTML — the outer one is the figure, the inner
  // ones are its panels — so each panel keeps its own caption and the wrapper
  // can carry the caption for the whole thing.
  eleventyConfig.addPairedShortcode("panels", (content, opts = {}) => {
    const columns = Number(opts.columns) || 0;
    const caption = opts.caption
      ? `<figcaption>${escapeXml(String(opts.caption))}</figcaption>`
      : "";
    return (
      `<figure class="chart-panels"${columns ? ` style="--panels:${columns}"` : ""}>` +
      `<div class="chart-panels-grid">${String(content).trim()}</div>` +
      caption +
      `</figure>`
    );
  });

  eleventyConfig.addShortcode("chart", (opts = {}) =>
    opts.type === "line" || opts.type === "scatter" ? seriesFigure(opts) : barsFigure(opts)
  );

  // The original name, kept because bar charts are most of them.
  eleventyConfig.addShortcode("barChart", (opts = {}) => barsFigure(opts));

  // Chart.js and its wiring are ~70KB gzipped, so they load only on the pages
  // that actually contain a chart rather than site-wide from base.njk.
  eleventyConfig.addTransform("chartAssets", (content, outputPath) => {
    if (typeof outputPath !== "string" || !outputPath.endsWith(".html")) return content;
    if (!content.includes("data-chart=") || !content.includes("</body>")) return content;
    const tags =
      `<script src="/static/js/chart.umd.min.js?v=4.5.1" defer></script>` +
      `<script src="/static/js/chartjs-plugin-annotation.min.js?v=3.1.0" defer></script>` +
      `<script src="/static/js/openbat-charts.js?v=12" defer></script>`;
    return content.replace("</body>", tags + "</body>");
  });

  return {
    pathPrefix: process.env.ELEVENTY_PATH_PREFIX || "/",
    dir: {
      input: ".",
      output: "_site",
      includes: "templates",
      layouts: "templates",
      data: "_data",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
