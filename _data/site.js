// Global site settings. Edit here rather than in the templates.
export default {
  name: "OpenBat",
  domain: "openbat.app",
  url: "https://openbat.app",
  // Not "open source": the app is source-available — readable, not licensed
  // for reuse. See the "The 'open' in OpenBat" post for the reasoning.
  tagline: "Source-available bat detection.",

  // Contact email, split so it can be assembled client-side
  // (the footer and Contact page reveal it on click rather than
  // shipping a scrapeable mailto: in the HTML).
  email: {
    user: "hello",
    domain: "openbat.app",
  },

  // Header nav. Order here is the order shown. The logo already links home.
  // An item may carry `children`: those become a dropdown under it on desktop
  // (hover or keyboard focus) and an indented sub-list inside the mobile
  // drawer, where there is no hover to open anything.
  nav: [
    { label: "Our Project", url: "/our-project/" },
    { label: "Contribute", url: "/guide-editor/" },
    { label: "Blog", url: "/blog/" },
    { label: "Help", url: "/help/" }
  ],
};
