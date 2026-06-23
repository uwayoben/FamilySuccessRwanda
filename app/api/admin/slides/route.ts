import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  const [rows] = await pool.execute(
    "SELECT * FROM hero_slides ORDER BY display_order ASC"
  ) as any[];
  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { tag, title, highlight, subtitle, cta1_label, cta1_href, cta2_label, cta2_href,
    image_url, overlay, stat_value, stat_label, bullets, icon_name, display_order } = body;

  await pool.execute(
    `INSERT INTO hero_slides
     (tag, title, highlight, subtitle, cta1_label, cta1_href, cta2_label, cta2_href,
      image_url, overlay, stat_value, stat_label, bullets, icon_name, display_order, is_active)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
    [tag, title, highlight, subtitle, cta1_label, cta1_href, cta2_label, cta2_href,
     image_url, overlay, stat_value, stat_label,
     JSON.stringify(bullets ?? []), icon_name, display_order ?? 99]
  );
  return NextResponse.json({ success: true });
}
