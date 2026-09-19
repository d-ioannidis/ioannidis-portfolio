CREATE TABLE IF NOT EXISTS article_stats (
  slug TEXT PRIMARY KEY NOT NULL,
  impressions INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS article_likes (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  slug TEXT NOT NULL,
  visitor_id TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS article_likes_slug_visitor
ON article_likes (slug, visitor_id);

CREATE TABLE IF NOT EXISTS article_comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  body TEXT NOT NULL,
  approved INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS article_comments_slug_approved_created
ON article_comments (slug, approved, created_at DESC);
