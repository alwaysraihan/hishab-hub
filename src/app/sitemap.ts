import type { MetadataRoute } from "next";
import { absoluteUrl, LAST_UPDATED } from "@/config/site";
import { ENABLED_TOOLS, toolPath } from "@/data/tools";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(`${LAST_UPDATED}T00:00:00Z`);

  const toolEntries: MetadataRoute.Sitemap = ENABLED_TOOLS.map((tool) => ({
    url: absoluteUrl(toolPath(tool)),
    lastModified,
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  return [
    {
      url: absoluteUrl("/"),
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...toolEntries,
    {
      url: absoluteUrl("/about/"),
      lastModified,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: absoluteUrl("/privacy/"),
      lastModified,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: absoluteUrl("/disclaimer/"),
      lastModified,
      changeFrequency: "yearly",
      priority: 0.4,
    },
  ];
}
