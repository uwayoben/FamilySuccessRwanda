import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  if ("is_active" in body) {
    await pool.execute("UPDATE hero_slides SET is_active = ? WHERE id = ?", [body.is_active ? 1 : 0, id]);
    return NextResponse.json({ success: true });
  }

  const { tag, title, highlight, subtitle, cta1_label, cta1_href, cta2_label, cta2_href,
    image_url, overlay, stat_value, stat_label, bullets, icon_name, display_order } = body;

  await pool.execute(
    `UPDATE hero_slides SET
       tag=?, title=?, highlight=?, subtitle=?, cta1_label=?, cta1_href=?,
       cta2_label=?, cta2_href=?, image_url=?, overlay=?, stat_value=?,
       stat_label=?, bullets=?, icon_name=?, display_order=?
     WHERE id=?`,
    [tag, title, highlight, subtitle, cta1_label, cta1_href, cta2_label, cta2_href,
     image_url, overlay, stat_value, stat_label,
     JSON.stringify(bullets ?? []), icon_name, display_order, id]
  );
  return NextResponse.json({ success: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await pool.execute("DELETE FROM hero_slides WHERE id = ?", [id]);
  return NextResponse.json({ success: true });
}
