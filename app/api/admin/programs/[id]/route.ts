import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  if ("is_active" in body && Object.keys(body).length === 1) {
    await pool.execute("UPDATE programs SET is_active = ? WHERE id = ?", [body.is_active ? 1 : 0, id]);
    return NextResponse.json({ success: true });
  }

  const { title, slug, description, summary, icon, beneficiaries,
    bg_color, text_color, border_color, light_bg, tag, impact_items, display_order } = body;

  await pool.execute(
    `UPDATE programs SET
       title=?, slug=?, description=?, summary=?, icon=?, beneficiaries=?,
       bg_color=?, text_color=?, border_color=?, light_bg=?, tag=?,
       impact_items=?, display_order=?
     WHERE id=?`,
    [title, slug, description, summary, icon, beneficiaries,
     bg_color, text_color, border_color, light_bg, tag,
     JSON.stringify(impact_items ?? []), display_order, id]
  );
  return NextResponse.json({ success: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await pool.execute("DELETE FROM programs WHERE id = ?", [id]);
  return NextResponse.json({ success: true });
}
