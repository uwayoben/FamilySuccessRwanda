import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { is_active } = body;

  if (is_active === undefined) {
    return NextResponse.json({ error: "Missing is_active" }, { status: 400 });
  }

  try {
    await pool.execute(
      "UPDATE newsletter_subscribers SET is_active = ? WHERE id = ?",
      [is_active ? 1 : 0, id]
    );
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await pool.execute("DELETE FROM newsletter_subscribers WHERE id = ?", [id]);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
