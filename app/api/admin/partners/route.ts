import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  const [rows] = await pool.execute(
    "SELECT * FROM partners ORDER BY display_order ASC"
  ) as any[];
  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  const { abbr, name, logo_url, website_url, bg_gradient, display_order } = await request.json();
  await pool.execute(
    `INSERT INTO partners (abbr, name, logo_url, website_url, bg_gradient, display_order, is_active)
     VALUES (?, ?, ?, ?, ?, ?, 1)`,
    [abbr, name, logo_url ?? "", website_url ?? "", bg_gradient ?? "from-gray-800 to-gray-600", display_order ?? 99]
  );
  return NextResponse.json({ success: true });
}
