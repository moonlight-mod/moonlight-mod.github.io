// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightBlog from "starlight-blog";
import starlightLinksValidator from "starlight-links-validator";

// https://astro.build/config
export default defineConfig({
  site: "https://moonlight-mod.github.io",
  integrations: [
    starlight({
      plugins: [
        starlightBlog({
          authors: {
            cynosphere: {
              name: "Cynosphere",
              url: "https://c7.pm/",
              picture: "https://github.com/Cynosphere.png"
            },

            notnite: {
              name: "NotNite",
              url: "https://notnite.com/",
              picture: "https://github.com/NotNite.png"
            },

            adryd: {
              name: "adryd",
              url: "https://adryd.com/",
              picture: "https://github.com/adryd325.png"
            }
          }
        }),
        starlightLinksValidator()
      ],

      title: "moonlight",
      logo: {
        dark: "./src/img/wordmark-light.png",
        light: "./src/img/wordmark.png",
        alt: "moonlight",
        replacesTitle: true
      },
      favicon: "/favicon.png",
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/moonlight-mod/moonlight"
        },
        {
          // It's Bluesky not BlueSky lol
          icon: "blueSky",
          label: "Bluesky",
          href: "https://bsky.app/profile/did:plc:uiwhayeayjutykag74l3yits"
        },
        {
          icon: "discord",
          label: "Discord server",
          href: "https://discord.gg/FdZBTFCP6F"
        }
      ],
      editLink: {
        baseUrl:
          "https://github.com/moonlight-mod/moonlight-mod.github.io/edit/main/"
      },
      sidebar: [
        {
          label: "Using moonlight",
          autogenerate: { directory: "using" }
        },
        {
          label: "Extension developers",
          autogenerate: { directory: "ext-dev" }
        },
        {
          label: "moonlight developers",
          autogenerate: { directory: "dev" }
        }
      ],
      components: {
        Hero: "./src/components/Hero.astro"
      },
      head: [
        {
          tag: "meta",
          attrs: {
            property: "og:image",
            content: "https://moonlight-mod.github.io/favicon.png"
          }
        },
        {
          tag: "meta",
          attrs: {
            name: "twitter:card",
            content: "summary"
          }
        }
      ]
    })
  ]
});
