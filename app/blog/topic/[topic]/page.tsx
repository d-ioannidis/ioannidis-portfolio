import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/article-card";
import { BlogFooter } from "@/components/blog-footer";
import { SiteHeader } from "@/components/site-header";
import { getAllArticles, getTopics, topicToSlug } from "@/lib/articles";

type Props = { params: Promise<{ topic: string }> };

export function generateStaticParams() {
  return getTopics().map((topic) => ({ topic: topicToSlug(topic) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { topic: slug } = await params;
  const topic = getTopics().find((item) => topicToSlug(item) === slug);
  return topic ? { title: `${topic} articles | Dimitrios Ioannidis` } : {};
}

export default async function TopicPage({ params }: Props) {
  const { topic: slug } = await params;
  const topic = getTopics().find((item) => topicToSlug(item) === slug);
  if (!topic) notFound();
  const articles = getAllArticles().filter((article) => article.topics.includes(topic));

  return (
    <main>
      <SiteHeader />
      <header className="topic-hero shell">
        <Link className="back-link" href="/blog">← All articles</Link>
        <p className="eyebrow">TOPIC</p>
        <h1>{topic}</h1>
        <p>{articles.length} {articles.length === 1 ? "article" : "articles"}</p>
      </header>
      <section className="blog-index shell"><div className="article-grid">{articles.map((article) => <ArticleCard key={article.slug} article={article} />)}</div></section>
      <BlogFooter />
    </main>
  );
}
