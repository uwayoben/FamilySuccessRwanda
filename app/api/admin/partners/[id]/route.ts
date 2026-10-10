import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  if ("is_active" in body && Object.keys(body).length === 1) {
    await pool.execute("UPDATE partners SET is_active = ? WHERE id = ?", [body.is_active ? 1 : 0, id]);
    return NextResponse.json({ success: true });
  }

  const { abbr, name, logo_url, website_url, bg_gradient, display_order } = body;
  await pool.execute(
    `UPDATE partners SET abbr=?, name=?, logo_url=?, website_url=?, bg_gradient=?, display_order=? WHERE id=?`,
    [abbr, name, logo_url ?? "", website_url ?? "", bg_gradient ?? "from-gray-800 to-gray-600", display_order, id]
  );
  return NextResponse.json({ success: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await pool.execute("DELETE FROM partners WHERE id = ?", [id]);
  return NextResponse.json({ success: true });
}
