import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"
import { Staticrypt } from "./quartz/plugins/transformers/password"

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "lore garden",
    pageTitleSuffix: " - lore garden",
    enableSPA: true,
    enablePopovers: true,
    analytics: null,
    locale: "en-US",
    baseUrl: "lore.karma.computer",
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "local",
      cdnCaching: false,
      typography: {
        title: "Geist",
        header: "Geist",
        body: "Geist",
        code: "Geist Mono",
      },
      colors: {
        lightMode: {
          light: "rgb(255, 252, 240)",
          lightgray: "#e5e5e5",
          gray: "#b8b8b8",
          darkgray: "rgb(16, 15, 15)",
          dark: "#2b2b2b",
          secondary: "rgb(94, 64, 157)",
          tertiary: "rgb(139, 126, 200)",
          highlight: "rgba(139, 126, 200, 0.15)",
          textHighlight: "rgba(32, 94, 166, 0.3)",
        },
        darkMode: {
          light: "rgb(16, 15, 15)",
          lightgray: "#393639",
          gray: "#646464",
          darkgray: "rgb(206, 205, 195)",
          dark: "#ebebec",
          secondary: "rgb(139, 126, 200)",
          tertiary: "rgb(94, 64, 157)",
          highlight: "rgba(139, 126, 200, 0.15)",
          textHighlight: "rgba(67, 133, 190, 0.5)",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
      Staticrypt(),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
      // Comment out CustomOgImages to speed up build time
      Plugin.CustomOgImages(),
      Plugin.CNAME()
    ],
  },
}

export default config
