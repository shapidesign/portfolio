import { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { SITE_ORIGIN } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_ORIGIN;
  /** Match `trailingSlash: true` and on-page canonicals (e.g. /work/). */
  const u = (path: string) =>
    path === "" || path === "/"
      ? `${baseUrl}/`
      : `${baseUrl}${path.endsWith("/") ? path : `${path}/`}`;

  const projectUrls = projects.map((project) => ({
    url: u(`/work/${project.slug}`),
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: u("/"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: u("/work"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: u("/about"),
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: u("/contact"),
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.7,
    },
    ...projectUrls,
  ];
}
