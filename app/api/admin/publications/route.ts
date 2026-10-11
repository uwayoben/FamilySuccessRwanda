import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { PUBLICATION_COLUMNS } from "@/lib/queries";

export async function GET() {
  const [rows] = await pool.execute(
    `SELECT ${PUBLICATION_COLUMNS} FROM publications ORDER BY published_at DESC, id DESC`
  ) as any[];
  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  const { title, description, file_url, cover_url, published_at, is_active } = await request.json();
  if (!title?.trim() || !file_url) {
    return NextResponse.json({ error: "Title and document file are required" }, { status: 400 });
  }
  await pool.execute(
    `INSERT INTO publications (title, description, file_url, cover_url, published_at, is_active)
     VALUES (?, ?, ?, ?, COALESCE(?, CURDATE()), ?)`,
    [title.trim(), description ?? "", file_url, cover_url ?? "", published_at || null, is_active ?? 1 ? 1 : 0]
  );
  return NextResponse.json({ success: true });
}
