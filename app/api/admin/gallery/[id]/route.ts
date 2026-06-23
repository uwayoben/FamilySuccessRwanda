import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  if ("is_active" in body && Object.keys(body).length === 1) {
    await pool.execute("UPDATE gallery SET is_active = ? WHERE id = ?", [body.is_active ? 1 : 0, id]);
    return NextResponse.json({ success: true });
  }

  const { image_url, description, display_order, is_active } = body;
  await pool.execute(
    `UPDATE gallery SET image_url=?, description=?, display_order=?, is_active=? WHERE id=?`,
    [image_url ?? "", description ?? "", display_order ?? 99, is_active ?? 1, id]
  );
  return NextResponse.json({ success: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await pool.execute("DELETE FROM gallery WHERE id = ?", [id]);
  return NextResponse.json({ success: true });
}
