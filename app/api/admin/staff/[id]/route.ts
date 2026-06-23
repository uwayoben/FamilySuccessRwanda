import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  if ("is_active" in body) {
    await pool.execute("UPDATE staff SET is_active = ? WHERE id = ?", [body.is_active ? 1 : 0, id]);
    return NextResponse.json({ success: true });
  }

  const { name, slug, role, department, photo, short_bio, full_bio,
    email, phone, joined_year, education, expertise, display_order } = body;

  await pool.execute(
    `UPDATE staff SET
       name=?, slug=?, role=?, department=?, photo=?, short_bio=?, full_bio=?,
       email=?, phone=?, joined_year=?, education=?, expertise=?, display_order=?
     WHERE id=?`,
    [name, slug, role, department, photo ?? "", short_bio, full_bio,
     email ?? "", phone ?? "", joined_year ?? "",
     JSON.stringify(education ?? []), JSON.stringify(expertise ?? []),
     display_order, id]
  );
  return NextResponse.json({ success: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await pool.execute("DELETE FROM staff WHERE id = ?", [id]);
  return NextResponse.json({ success: true });
}
