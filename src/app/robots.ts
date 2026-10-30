import type { MetadataRoute } from "next";
import { site } from "@/config/site";

// Compatible con `output: "export"`: se genera como archivo estático (out/robots.txt).
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
