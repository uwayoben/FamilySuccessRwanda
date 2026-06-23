import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  const [rows] = await pool.execute(
    "SELECT * FROM programs ORDER BY display_order ASC"
  ) as any[];
  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { title, slug, description, summary, icon, beneficiaries,
    bg_color, text_color, border_color, light_bg, tag, impact_items, display_order } = body;

  await pool.execute(
    `INSERT INTO programs
     (title, slug, description, summary, icon, beneficiaries, bg_color, text_color, border_color, light_bg, tag, impact_items, display_order, is_active)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
    [title, slug, description, summary, icon, beneficiaries,
     bg_color, text_color, border_color, light_bg, tag,
     JSON.stringify(impact_items ?? []), display_order ?? 99]
  );
  return NextResponse.json({ success: true });
}
