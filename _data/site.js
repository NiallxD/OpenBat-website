// Global site settings. Edit here rather than in the templates.
export default {
  name: "OpenBat",
  domain: "openbat.app",
  url: "https://openbat.app",
  tagline: "Open source bat detection.",

  // Contact email, split so it can be assembled client-side
  // (the footer and Contact page reveal it on click rather than
  // shipping a scrapeable mailto: in the HTML).
  email: {
    user: "hello",
    domain: "openbat.app",
  },

  // Header nav + footer site map. Order here is the order shown.
  nav: [
    { label: "Home", url: "/" },
    { label: "OpenBat", url: "/openbat/" },
    { label: "Help", url: "/help/" },
    { label: "Privacy", url: "/privacy/" },
    { label: "Contact", url: "/contact/" },
  ],
};
