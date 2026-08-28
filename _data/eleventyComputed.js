// Where blog posts live, and the URL prefix their pages get.
const BLOG_DIR = "2.0 - Blog Posts";
const BLOG_PREFIX = "/blog/";

const slugify = (s) =>
  String(s)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/['\u2019]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// Local, not exported: a named export alongside the default turns this data
// file into a namespace object and Eleventy stops running the computed values.
const isBlogPost = (data) =>
  String(data?.page?.inputPath || "").includes(`/${BLOG_DIR}/`);

export default {
  layout: (data) => {
    if (!data.page?.inputPath?.endsWith(".md")) return data.layout;
    // Posts get the post layout without having to say so in every file.
    if (isBlogPost(data)) return data.layout || "post.njk";
    return data.layout || "page.njk";
  },

  permalink: (data) => {
    // Let JS templates honour their own data() permalink
    if (data.page?.inputPath?.endsWith(".11ty.js")) return data.permalink;
    if (!data.page?.inputPath?.endsWith(".md")) return undefined;
    const publish = String(data.publish).trim().toLowerCase() === "true";
    if (!publish) return false;
    if (data.permalink) {
      if (data.permalink.endsWith(".html")) return data.permalink;
      const p = data.permalink.replace(/\/$/, "");
      return p + "/index.html";
    }
    // A post with no permalink of its own gets /blog/<slug>/, slugged from its
    // title (falling back to the filename), so writing one is just: drop a
    // markdown file in the folder.
    if (isBlogPost(data)) {
      const slug = slugify(data.title || data.page.fileSlug);
      return `${BLOG_PREFIX}${slug}/index.html`;
    }
    return undefined;
  },

  eleventyExcludeFromCollections: (data) => {
    if (!data.page?.inputPath?.endsWith(".md")) return false;
    const publish = String(data.publish).trim().toLowerCase() === "true";
    return !publish;
  },

  coverImage: (data) => data.coverImage || data["header-image"] || data.heroImage || null,
};
