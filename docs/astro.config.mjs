import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

export default defineConfig({
  site: "https://docs.cooperative.venturarodriguez.xyz",
  /* Home → Installation (single source: getting-started/installation.md) */
  redirects: {
    "/": "/getting-started/installation/",
  },
  integrations: [
    starlight({
      title: "Cooperative SDK",
      description: "TypeScript SDK for DeFi applications",
      logo: {
        src: "./src/assets/cooperative.png",
      },
      customCss: ["./src/styles/custom.css"],
      expressiveCode: {
        themes: ["github-dark"],
        useStarlightDarkModeSwitch: false,
        useStarlightUiThemeColors: false,
      },
      sidebar: [
        {
          label: "Getting Started",
          items: [
            { label: "Installation", link: "/getting-started/installation/" },
            { label: "Configuration", link: "/getting-started/configuration/" },
          ],
        },
        {
          label: "API Reference",
          items: [
            { label: "Setup", link: "/api-reference/setup/" },
            { label: "Swaps", link: "/api-reference/swaps/" },
            { label: "Token", link: "/api-reference/token/" },
            { label: "Tokens", link: "/api-reference/tokens/" },
            { label: "User", link: "/api-reference/user/" },
            { label: "Utils", link: "/api-reference/utils/" },
          ],
        },
        {
          label: "Miscellaneous",
          items: [
            { label: "Contributing", link: "/misc/contributing/" },
            { label: "Releasing", link: "/misc/releasing/" },
            { label: "License", link: "/misc/license/" },
          ],
        },
      ],
      editLink: {
        baseUrl: "https://github.com/venturars/cooperative/edit/main/docs/",
      },
    }),
  ],
});
