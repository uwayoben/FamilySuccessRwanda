import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  const [rows] = await pool.execute(
    "SELECT * FROM success_stories ORDER BY display_order ASC, id DESC"
  ) as any[];
  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  const { name, subtitle, quote, story, image_url, display_order, is_active } = await request.json();
  if (!name?.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  await pool.execute(
    `INSERT INTO success_stories (name, subtitle, quote, story, image_url, display_order, is_active)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [name.trim(), subtitle ?? "", quote ?? "", story ?? "", image_url ?? "", display_order ?? 99, is_active ?? 1 ? 1 : 0]
  );
  return NextResponse.json({ success: true });
}
