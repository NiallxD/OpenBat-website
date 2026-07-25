export default {
  layout: (data) => {
    if (!data.page?.inputPath?.endsWith(".md")) return data.layout;
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
    return undefined;
  },

  eleventyExcludeFromCollections: (data) => {
    if (!data.page?.inputPath?.endsWith(".md")) return false;
    const publish = String(data.publish).trim().toLowerCase() === "true";
    return !publish;
  },

  coverImage: (data) => data.coverImage || data["header-image"] || data.heroImage || null,
};
