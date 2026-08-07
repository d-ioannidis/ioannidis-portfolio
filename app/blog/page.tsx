import type { Metadata } from "next";
import Link from "next/link";
import { ArticleCard } from "@/components/article-card";
import { BlogFooter } from "@/components/blog-footer";
import { SiteHeader } from "@/components/site-header";
import { getAllArticles, getTopics, topicToSlug } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Blog | Dimitrios Ioannidis",
  description: "Articles on data science, machine learning, software engineering, APIs, and business systems.",
};

export default function BlogPage() {
  const articles = getAllArticles();
  const featured = articles.find((article) => article.featured) ?? articles[0];
  const remaining = articles.filter((article) => article.slug !== featured?.slug);

  return (
    <main>
      <SiteHeader />
      <header className="blog-hero shell">
        <p className="eyebrow">FIELD NOTES / IDEAS IN PRACTICE</p>
        <h1>Writing about <em>useful systems.</em></h1>
        <p>Explorations in data science, machine learning, software engineering, and the practical work of turning ideas into tools.</p>
      </header>
      <section className="blog-index shell" aria-labelledby="latest-articles">
        <div className="topic-nav" aria-label="Article topics">
          <Link className="active" href="/blog">All</Link>
          {getTopics().map((topic) => <Link key={topic} href={`/blog/topic/${topicToSlug(topic)}`}>{topic}</Link>)}
        </div>
        <h2 className="section-label" id="latest-articles">Latest articles</h2>
        {featured && <ArticleCard article={featured} featured />}
        <div className="article-grid">{remaining.map((article) => <ArticleCard key={article.slug} article={article} />)}</div>
      </section>
      <BlogFooter />
    </main>
  );
}
