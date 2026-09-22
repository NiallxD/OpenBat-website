// /app/blog.json — the feed the app's blog tab reads.
//
// A build output of this site, deployed with it: posts marked `inApp: true`,
// rendered bodies and all. The app treats a 404 as "no posts", so withdrawing
// the feed is safe; see lib/app-feed.js for what a record contains and
// BlogFeedSpec.md in the app repo for the contract.

import { buildFeed } from "./lib/app-feed.js";

export default class AppBlogFeed {
  data() {
    return {
      permalink: "/app/blog.json",
      eleventyExcludeFromCollections: true,
    };
  }

  // `eleventy.env.runMode` is "build", "watch" or "serve". Only a real build
  // moves the version counter — see stampVersion in lib/app-feed.js.
  render({ collections, site, eleventy }) {
    const stamp = eleventy?.env?.runMode === "build";
    return JSON.stringify(buildFeed(collections.appPosts, site.url, { stamp }), null, 2) + "\n";
  }
}
