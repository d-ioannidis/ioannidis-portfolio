import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextRequest, NextResponse } from "next/server";

type D1Row = Record<string, unknown>;

async function ensureStats(db: D1Database, slug: string) {
  await db.prepare("INSERT OR IGNORE INTO article_stats (slug, impressions) VALUES (?, 0)").bind(slug).run();
}

async function readSummary(db: D1Database, slug: string, visitorId: string | null) {
  await ensureStats(db, slug);
  const stats = await db.prepare(
    "SELECT impressions, (SELECT COUNT(*) FROM article_likes WHERE slug = ?) AS likes FROM article_stats WHERE slug = ?"
  ).bind(slug, slug).first<D1Row>();

  const comments = await db.prepare(
    "SELECT id, name, body, created_at AS createdAt FROM article_comments WHERE slug = ? AND approved = 1 ORDER BY created_at DESC LIMIT 50"
  ).bind(slug).all<D1Row>();

  let liked = false;
  if (visitorId) {
    const row = await db.prepare("SELECT 1 AS liked FROM article_likes WHERE slug = ? AND visitor_id = ? LIMIT 1").bind(slug, visitorId).first<D1Row>();
    liked = Boolean(row);
  }

  return {
    impressions: Number(stats?.impressions ?? 0),
    likes: Number(stats?.likes ?? 0),
    comments: comments.results ?? [],
    liked,
  };
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { env } = await getCloudflareContext({ async: true });
  const slug = (await params).slug;
  const visitorId = request.headers.get("x-visitor-id");
  return NextResponse.json(await readSummary(env.DB, slug, visitorId));
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { env } = await getCloudflareContext({ async: true });
  const slug = (await params).slug;
  const visitorId = request.headers.get("x-visitor-id");
  const body = await request.json().catch(() => ({}));
  await ensureStats(env.DB, slug);

  if (body.action === "impression") {
    await env.DB.prepare("UPDATE article_stats SET impressions = impressions + 1 WHERE slug = ?").bind(slug).run();
  } else if (body.action === "like") {
    if (!visitorId || visitorId.length > 100) return NextResponse.json({ error: "Visitor identifier missing." }, { status: 400 });
    const existing = await env.DB.prepare("SELECT 1 FROM article_likes WHERE slug = ? AND visitor_id = ?").bind(slug, visitorId).first();
    if (existing) {
      await env.DB.prepare("DELETE FROM article_likes WHERE slug = ? AND visitor_id = ?").bind(slug, visitorId).run();
    } else {
      await env.DB.prepare("INSERT INTO article_likes (slug, visitor_id) VALUES (?, ?)").bind(slug, visitorId).run();
    }
  } else {
    return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  }

  return NextResponse.json(await readSummary(env.DB, slug, visitorId));
}
