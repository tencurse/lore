import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer({
    links: {
      github: "https://github.com/tencurse/lore",
      "main site": "https://karma.computer",
      colophon: "/colophon"
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ArticleTitle(),
    Component.MobileOnly(Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    })),
    Component.MobileOnly(Component.ContentMeta()),
    Component.MobileOnly(Component.TagList()),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
        { Component: Component.ReaderMode() },
      ],
    }),
    Component.DesktopOnly(Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    })),
    Component.DesktopOnly(Component.TableOfContents()),
  ],
  right: [
    Component.DesktopOnly(Component.ContentMeta()),
    Component.DesktopOnly(Component.TagList()),
    Component.Backlinks(),
    Component.DesktopOnly(Component.Graph()),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [
    Component.ArticleTitle(),
    Component.MobileOnly(Component.Breadcrumbs()),
    Component.MobileOnly(Component.ContentMeta()),
    Component.MobileOnly(Component.TagList()),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.DesktopOnly(Component.Breadcrumbs()),
    Component.DesktopOnly(Component.TableOfContents()),
  ],
  right: [
    Component.DesktopOnly(Component.ContentMeta()),
    Component.DesktopOnly(Component.TagList()),
    Component.Backlinks(),
    Component.DesktopOnly(Component.Graph()),
  ],
}
