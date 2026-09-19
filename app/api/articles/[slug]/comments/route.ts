import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextRequest, NextResponse } from "next/server";

function text(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { env } = await getCloudflareContext({ async: true });
  const slug = (await params).slug;
  const parsed: unknown = await request.json().catch(() => null);
  const payload: Record<string, unknown> =
    parsed !== null && typeof parsed === "object" && !Array.isArray(parsed)
      ? parsed as Record<string, unknown>
      : {};

  if (text(payload.website, 200)) return NextResponse.json({ ok: true });
  const name = text(payload.name, 80);
  const email = text(payload.email, 160).toLowerCase();
  const body = text(payload.body, 2000);

  if (name.length < 2 || body.length < 3 || !/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ error: "Please provide a valid name, email, and comment." }, { status: 400 });
  }

  await env.DB.prepare(
    "INSERT INTO article_comments (slug, name, email, body, approved) VALUES (?, ?, ?, ?, 0)"
  ).bind(slug, name, email, body).run();

  return NextResponse.json({ ok: true }, { status: 201 });
}
