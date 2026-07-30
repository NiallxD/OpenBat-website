import { readFileSync, readdirSync, statSync } from "fs";
import { join, extname } from "path";
import markdownIt from "markdown-it";

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
            if (!permalink) continue;
            const url = (permalink.startsWith("/") ? permalink : "/" + permalink).replace(/\/?$/, "/");
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

function buildInlineGallery(uid, slides) {
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
  return `<div class="gallery-body" style="margin-top:2rem;margin-bottom:2rem;"><div class="gallery-slideshow-container"><div class="swiper gallery-swiper${allNativeAspect ? ' native-ar' : ''}" id="${swiperId}"><div class="swiper-wrapper">${desktopSlides}</div><div class="swiper-button-prev"></div><div class="swiper-button-next"></div></div><div class="gallery-pagination swiper-pagination" id="${paginationId}"></div><div id="${captionAreaId}" class="gallery-caption-external" style="display:none;"><h3 id="${titleId}"></h3><p id="${descId}"></p></div></div><script>(function(){var ${dataVar}=${slidesJson};document.addEventListener('DOMContentLoaded',function(){var tEl=document.getElementById('${titleId}');var dEl=document.getElementById('${descId}');var cArea=document.getElementById('${captionAreaId}');function upd(i){var d=${dataVar}[i];if(!d)return;tEl.textContent=d.title||'';dEl.innerHTML=d.caption||'';cArea.style.display=(d.title||d.caption)?'block':'none';}new Swiper('#${swiperId}',{loop:true,keyboard:{enabled:true},speed:600,autoHeight:${allNativeAspect ? 'true' : 'false'},pagination:{el:'#${paginationId}',type:'fraction',renderFraction:function(c,t){return'<span class="'+c+'"></span> <span class="fraction-sep">of</span> <span class="'+t+'"></span>';}},navigation:{nextEl:'#${swiperId} .swiper-button-next',prevEl:'#${swiperId} .swiper-button-prev'},on:{init:function(){upd(this.realIndex);},slideChange:function(){upd(this.realIndex);}}});});}());</script></div>`;
}

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("static");
  eleventyConfig.addPassthroughCopy("robots.txt");

  // Markdown-it with HTML enabled + Obsidian-style wikilinks
  const wikilinkMap = buildWikilinkMap(".");
  const md = markdownIt({ html: true, linkify: true, typographer: true });
  wikilinkPlugin(md, wikilinkMap);
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

  // Transform Obsidian callouts into styled divs
  eleventyConfig.addTransform("callouts", (content, outputPath) => {
    if (typeof outputPath !== "string" || !outputPath.endsWith(".html")) return content;
    return content.replace(
      /<blockquote>\s*<p>\[!([\w-]+)\]([^<\n]*)([\s\S]*?)<\/blockquote>/g,
      (_, type, titleRaw, bodyRaw) => {
        const t = type.toLowerCase();
        const title = titleRaw.trim() || type;
        let body = bodyRaw;
        if (body.startsWith("\n")) {
          body = body.replace(/^\n/, "").replace(/<\/p>\s*$/, "").trim();
          body = body ? `<p>${body}</p>` : "";
        } else {
          body = body.replace(/^<\/p>\s*/, "").trim();
        }
        return `<div class="callout callout-${t}"><div class="callout-title">${title}</div><div class="callout-body">${body}</div></div>`;
      }
    );
  });

  eleventyConfig.addTransform("inlineGalleries", (content, outputPath) => {
    if (typeof outputPath !== "string" || !outputPath.endsWith(".html")) return content;
    if (!content.includes("gallery-start")) return content;
    let uid = 0;
    return content.replace(
      /<h2[^>]*>\s*gallery-start\s*<\/h2>([\s\S]*?)<h2[^>]*>\s*gallery-end\s*<\/h2>/gi,
      (_, inner) => {
        const slides = parseSlidesFromBlock(inner);
        if (!slides.length) return '';
        return buildInlineGallery(uid++, slides);
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
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  });

  eleventyConfig.addFilter("isoDate", (dateObj) => {
    if (!dateObj) return "";
    const d = dateObj instanceof Date ? dateObj : new Date(dateObj);
    return d.toISOString().split("T")[0];
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
