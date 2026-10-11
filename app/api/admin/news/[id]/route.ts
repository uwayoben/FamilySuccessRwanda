import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  if ("is_active" in body && Object.keys(body).length === 1) {
    await pool.execute("UPDATE news SET is_active = ? WHERE id = ?", [body.is_active ? 1 : 0, id]);
    return NextResponse.json({ success: true });
  }

  const { title, excerpt, content, image_url, published_at, is_active } = body;
  if (!title?.trim()) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }
  // The slug is kept so links to an already published article keep working.
  await pool.execute(
    `UPDATE news SET title=?, excerpt=?, content=?, image_url=?, published_at=COALESCE(?, published_at), is_active=? WHERE id=?`,
    [title.trim(), excerpt ?? "", content ?? "", image_url ?? "", published_at || null, is_active ?? 1 ? 1 : 0, id]
  );
  return NextResponse.json({ success: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await pool.execute("DELETE FROM news WHERE id = ?", [id]);
  return NextResponse.json({ success: true });
}
