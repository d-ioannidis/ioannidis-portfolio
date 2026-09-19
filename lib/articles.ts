import matter from "gray-matter";
import { marked } from "marked";
import readingTime from "reading-time";
import hljs from "highlight.js";
import articleSources from "@/content/articles.generated.json";

type ArticleSource = {
  filename: string;
  source: string;
};

type ParsedArticle = Omit<Article, "content"> & {
  rawContent: string;
};

const sources = articleSources as ArticleSource[];
const renderedContent = new Map<string, string>();

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

const articles: ParsedArticle[] = sources
  .filter(({ filename }) => /\.mdx?$/.test(filename) && !filename.startsWith("_"))
  .map(({ filename, source }) => {
    const slug = filename.replace(/\.mdx?$/, "");
    const { data, content } = matter(source);

    if (data.published === false) return null;

    return {
      slug,
      title: String(data.title),
      description: String(data.description),
      date: String(data.date),
      topics: Array.isArray(data.topics) ? data.topics.map(String) : [],
      featured: Boolean(data.featured),
      readingTime: readingTime(content).text,
      rawContent: content,
    };
  })
  .filter((article): article is ParsedArticle => article !== null)
  .sort((a, b) => Date.parse(b.date) - Date.parse(a.date));

function summary(article: ParsedArticle): Article {
  const { rawContent: _rawContent, ...metadata } = article;
  return { ...metadata, content: "" };
}

export function getAllArticles(): Article[] {
  return articles.map(summary);
}

export function getArticleSummary(slug: string) {
  const article = articles.find((item) => item.slug === slug);
  return article ? summary(article) : undefined;
}

export function getArticle(slug: string) {
  const article = articles.find((item) => item.slug === slug);
  if (!article) return undefined;

  let content = renderedContent.get(slug);
  if (!content) {
    content = marked.parse(article.rawContent) as string;
    renderedContent.set(slug, content);
  }

  const { rawContent: _rawContent, ...metadata } = article;
  return { ...metadata, content };
}

export function getTopics() {
  return [...new Set(articles.flatMap((article) => article.topics))].sort();
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
