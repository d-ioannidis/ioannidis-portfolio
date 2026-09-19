import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleEngagement } from "@/components/article-engagement";
import { BlogFooter } from "@/components/blog-footer";
import { SiteHeader } from "@/components/site-header";
import { formatDate, getAllArticles, getArticle, getArticleSummary, topicToSlug } from "@/lib/articles";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllArticles().map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = getArticleSummary((await params).slug);
  if (!article) return {};
  return {
    title: `${article.title} | Dimitrios Ioannidis`,
    description: article.description,
    openGraph: { type: "article", title: article.title, description: article.description, publishedTime: article.date, tags: article.topics },
  };
}

export default async function ArticlePage({ params }: Props) {
  const article = getArticle((await params).slug);
  if (!article) notFound();
  const articles = getAllArticles();
  const index = articles.findIndex((item) => item.slug === article.slug);
  const newer = index > 0 ? articles[index - 1] : undefined;
  const older = index < articles.length - 1 ? articles[index + 1] : undefined;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ioannidis-portfolio.pages.dev";
  const articleUrl = `${siteUrl}/blog/${article.slug}`;

  return (
    <main>
      <SiteHeader />
      <article>
        <header className="article-hero shell">
          <Link className="back-link" href="/blog">← All articles</Link>
          <div className="topic-list">{article.topics.map((topic) => <Link key={topic} href={`/blog/topic/${topicToSlug(topic)}`}>{topic}</Link>)}</div>
          <h1>{article.title}</h1>
          <p className="article-deck">{article.description}</p>
          <div className="article-byline"><span>By Dimitrios Ioannidis</span><time dateTime={article.date}>{formatDate(article.date)}</time><span>{article.readingTime}</span></div>
        </header>
        <div className="article-layout shell">
          <aside className="share-links" aria-label="Share article"><span>Share</span><a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}`} target="_blank" rel="noreferrer">LinkedIn</a><a href={`mailto:?subject=${encodeURIComponent(article.title)}&body=${encodeURIComponent(articleUrl)}`}>Email</a></aside>
          <div className="article-body" dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>
        <div className="shell"><ArticleEngagement slug={article.slug} /></div>
        <nav className="article-pagination shell" aria-label="More articles">
          {newer ? <Link href={`/blog/${newer.slug}`}><span>Newer</span><strong>← {newer.title}</strong></Link> : <span />}
          {older ? <Link href={`/blog/${older.slug}`}><span>Older</span><strong>{older.title} →</strong></Link> : <span />}
        </nav>
      </article>
      <BlogFooter />
    </main>
  );
}
