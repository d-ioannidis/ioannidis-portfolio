import type { MetadataRoute } from "next";
import { getAllArticles, getTopics, topicToSlug } from "@/lib/articles";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ioannidis-portfolio.pages.dev";
  return [
    { url: siteUrl, lastModified: new Date(), priority: 1 },
    { url: `${siteUrl}/blog`, lastModified: new Date(), priority: 0.9 },
    ...getAllArticles().map((article) => ({ url: `${siteUrl}/blog/${article.slug}`, lastModified: new Date(article.date), priority: 0.7 })),
    ...getTopics().map((topic) => ({ url: `${siteUrl}/blog/topic/${topicToSlug(topic)}`, lastModified: new Date(), priority: 0.5 })),
  ];
}
