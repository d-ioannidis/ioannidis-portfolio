import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import readingTime from "reading-time";
import hljs from "highlight.js";

const articlesDirectory = path.join(process.cwd(), "content", "articles");

export type Article = {
  slug: string;
  title: string;
  description: string;
  date: string;
  topics: string[];
  featured: boolean;
  readingTime: string;
  content: string;
};

marked.use({
  renderer: {
    code({ text, lang }) {
      const language = lang && hljs.getLanguage(lang) ? lang : "plaintext";
      const highlighted = hljs.highlight(text, { language }).value;
      return `<pre><code class="hljs language-${language}">${highlighted}</code></pre>`;
    },
  },
});

function readArticle(filename: string): Article | null {
  const slug = filename.replace(/\.mdx?$/, "");
  const raw = fs.readFileSync(path.join(articlesDirectory, filename), "utf8");
  const { data, content } = matter(raw);

  if (data.published === false) return null;

  return {
    slug,
    title: String(data.title),
    description: String(data.description),
    date: String(data.date),
    topics: Array.isArray(data.topics) ? data.topics.map(String) : [],
    featured: Boolean(data.featured),
    readingTime: readingTime(content).text,
    content: marked.parse(content) as string,
  };
}

export function getAllArticles(): Article[] {
  if (!fs.existsSync(articlesDirectory)) return [];

  return fs
    .readdirSync(articlesDirectory)
    .filter((file) => /\.mdx?$/.test(file) && !file.startsWith("_"))
    .map(readArticle)
    .filter((article): article is Article => article !== null)
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
}

export function getArticle(slug: string) {
  return getAllArticles().find((article) => article.slug === slug);
}

export function getTopics() {
  return [...new Set(getAllArticles().flatMap((article) => article.topics))].sort();
}

export function topicToSlug(topic: string) {
  return topic.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00Z`));
}
