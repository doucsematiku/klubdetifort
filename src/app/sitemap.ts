import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://klubdetifort.cz",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://klubdetifort.cz/prohlidky",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: "https://klubdetifort.cz/prazdninovy-program",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.95,
    },
  ];
}
