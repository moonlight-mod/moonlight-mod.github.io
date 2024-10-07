// @ts-check
const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "moonlight",
  tagline: "Yet another Discord mod",
  favicon: "img/logo.png",

  url: "https://moonlight-mod.github.io",
  baseUrl: "/",
  staticDirectories: ["static"],

  organizationName: "moonlight-mod",
  projectName: "moonlight-mod.github.io",

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  i18n: {
    defaultLocale: "en",
    locales: ["en"]
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl: "https://github.com/moonlight-mod/moonlight-mod.github.io"
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css")
        },
        blog: {
          blogSidebarTitle: "Posts",
          blogSidebarCount: "ALL"
        }
      })
    ]
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: "img/logo.png",
      navbar: {
        title: "moonlight",
        logo: {
          alt: "moonlight",
          src: "img/logo.png"
        },
        items: [
          {
            type: "docSidebar",
            sidebarId: "sidebar",
            position: "left",
            label: "Docs"
          },
          {
            to: "blog",
            label: "Blog",
            position: "left"
          },
          {
            href: "https://github.com/moonlight-mod/moonlight",
            label: "GitHub",
            position: "right"
          }
        ]
      },

      metadata: [{ name: "twitter:card", content: "summary" }],

      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme
      }
    })
};

module.exports = config;
