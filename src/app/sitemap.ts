import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/config/site";
import { sitemapPaths } from "@/lib/seo";

// Compatible con `output: "export"`: se genera como archivo estático (out/sitemap.xml).
export const dynamic = "force-static";

/** URL absolutas con barra final, como las sirve el sitio (`trailingSlash`). */
export default function sitemap(): MetadataRoute.Sitemap {
  return sitemapPaths.map((path) => ({ url: absoluteUrl(path) }));
}
