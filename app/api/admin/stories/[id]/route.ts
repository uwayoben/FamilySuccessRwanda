import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  if ("is_active" in body && Object.keys(body).length === 1) {
    await pool.execute("UPDATE success_stories SET is_active = ? WHERE id = ?", [body.is_active ? 1 : 0, id]);
    return NextResponse.json({ success: true });
  }

  const { name, subtitle, quote, story, image_url, display_order, is_active } = body;
  if (!name?.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  await pool.execute(
    `UPDATE success_stories SET name=?, subtitle=?, quote=?, story=?, image_url=?, display_order=?, is_active=? WHERE id=?`,
    [name.trim(), subtitle ?? "", quote ?? "", story ?? "", image_url ?? "", display_order ?? 99, is_active ?? 1 ? 1 : 0, id]
  );
  return NextResponse.json({ success: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await pool.execute("DELETE FROM success_stories WHERE id = ?", [id]);
  return NextResponse.json({ success: true });
}
