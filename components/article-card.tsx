import Link from "next/link";
import { Article, formatDate, topicToSlug } from "@/lib/articles";

export function ArticleCard({ article, featured = false }: { article: Article; featured?: boolean }) {
  return (
    <article className={`article-card${featured ? " article-card-featured" : ""}`}>
      <div className="article-card-meta">
        <time dateTime={article.date}>{formatDate(article.date)}</time>
        <span>{article.readingTime}</span>
      </div>
      <h2><Link href={`/blog/${article.slug}`}>{article.title}</Link></h2>
      <p>{article.description}</p>
      <div className="article-card-footer">
        <div className="topic-list">
          {article.topics.map((topic) => <Link key={topic} href={`/blog/topic/${topicToSlug(topic)}`}>{topic}</Link>)}
        </div>
        <Link className="read-link" href={`/blog/${article.slug}`}>Read article <span aria-hidden="true">↗</span></Link>
      </div>
    </article>
  );
}
