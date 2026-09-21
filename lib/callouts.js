// Obsidian callouts, in one place.
//
// markdown-it renders `> [!note] Title` as an ordinary blockquote whose first
// paragraph opens with the literal `[!note] Title`. Both consumers of a post —
// the website's own pages and the app feed — have to find that and turn it
// into real markup, and they want *different* markup, so the finding lives
// here and the two renderers are passed in.

const CALLOUT_RE = /<blockquote>\s*<p>\[!([\w-]+)\]([^<\n]*)([\s\S]*?)<\/blockquote>/g;

// The website's own shape: a div with a title bar, styled by style.css.
export const siteCallout = (type, title, body) =>
  `<div class="callout callout-${type}"><div class="callout-title">${title}</div><div class="callout-body">${body}</div></div>`;

// The app's shape, per BlogFeedSpec: a blockquote carrying the same classes,
// with the title as a <strong> first child. The app draws the rest.
export const appCallout = (type, title, body) =>
  `<blockquote class="callout callout-${type}"><strong>${title}</strong>${body}</blockquote>`;

export function transformCallouts(html, render = siteCallout) {
  return String(html).replace(CALLOUT_RE, (_, type, titleRaw, bodyRaw) => {
    const t = type.toLowerCase();
    const title = titleRaw.trim() || type;
    let body = bodyRaw;
    if (body.startsWith("\n")) {
      body = body.replace(/^\n/, "").replace(/<\/p>\s*$/, "").trim();
      body = body ? `<p>${body}</p>` : "";
    } else {
      body = body.replace(/^<\/p>\s*/, "").trim();
    }
    return render(t, title, body);
  });
}
