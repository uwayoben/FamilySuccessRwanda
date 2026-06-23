import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  const [rows] = await pool.execute(
    "SELECT * FROM staff ORDER BY display_order ASC"
  ) as any[];
  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, slug, role, department, photo, short_bio, full_bio,
    email, phone, joined_year, education, expertise, display_order } = body;

  await pool.execute(
    `INSERT INTO staff
     (name, slug, role, department, photo, short_bio, full_bio, email, phone,
      joined_year, education, expertise, display_order, is_active)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
    [name, slug, role, department, photo ?? "", short_bio, full_bio,
     email ?? "", phone ?? "", joined_year ?? "",
     JSON.stringify(education ?? []), JSON.stringify(expertise ?? []),
     display_order ?? 99]
  );
  return NextResponse.json({ success: true });
}
