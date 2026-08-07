import { getAllArticles } from "@/lib/articles";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ioannidis-portfolio.pages.dev";
const escape = (value: string) => value.replace(/[<>&'\"]/g, (char) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", "\"": "&quot;" })[char]!);

export function GET() {
  const items = getAllArticles().map((article) => `<item><title>${escape(article.title)}</title><link>${siteUrl}/blog/${article.slug}</link><guid>${siteUrl}/blog/${article.slug}</guid><pubDate>${new Date(article.date).toUTCString()}</pubDate><description>${escape(article.description)}</description></item>`).join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Dimitrios Ioannidis — Blog</title><link>${siteUrl}/blog</link><description>Notes on data, software, and useful systems.</description>${items}</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
