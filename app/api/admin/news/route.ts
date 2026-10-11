import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { NEWS_COLUMNS } from "@/lib/queries";
import { slugify } from "@/lib/news";

async function uniqueSlug(title: string): Promise<string> {
  const base = slugify(title);
  const [rows] = await pool.execute(
    "SELECT slug FROM news WHERE slug = ? OR slug LIKE ?",
    [base, `${base}-%`]
  ) as any[];
  const taken = new Set((rows as { slug: string }[]).map(r => r.slug));
  if (!taken.has(base)) return base;
  let n = 2;
  while (taken.has(`${base}-${n}`)) n++;
  return `${base}-${n}`;
}

export async function GET() {
  const [rows] = await pool.execute(
    `SELECT ${NEWS_COLUMNS} FROM news ORDER BY published_at DESC, id DESC`
  ) as any[];
  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  const { title, excerpt, content, image_url, published_at, is_active } = await request.json();
  if (!title?.trim()) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }
  const slug = await uniqueSlug(title);
  await pool.execute(
    `INSERT INTO news (title, slug, excerpt, content, image_url, published_at, is_active)
     VALUES (?, ?, ?, ?, ?, COALESCE(?, CURDATE()), ?)`,
    [title.trim(), slug, excerpt ?? "", content ?? "", image_url ?? "", published_at || null, is_active ?? 1 ? 1 : 0]
  );
  return NextResponse.json({ success: true, slug });
}
