import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  const [rows] = await pool.execute(
    "SELECT * FROM gallery ORDER BY display_order ASC, id DESC"
  ) as any[];
  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  const { image_url, description, display_order } = await request.json();
  await pool.execute(
    `INSERT INTO gallery (image_url, description, display_order, is_active)
     VALUES (?, ?, ?, 1)`,
    [image_url ?? "", description ?? "", display_order ?? 99]
  );
  return NextResponse.json({ success: true });
}
