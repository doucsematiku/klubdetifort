import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // interní materiály — ke stažení přes odkaz, ale ne do vyhledávačů
      disallow: ["/dokumenty/navod-pruvodkyne.pdf"],
    },
    sitemap: "https://klubdetifort.cz/sitemap.xml",
  };
}
