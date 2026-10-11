import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { SPONSOR_CHILD_SETTING_KEY } from "@/lib/sponsorChild";

const ALLOWED_KEYS = ["who_we_are_image", "faina_home_image", SPONSOR_CHILD_SETTING_KEY];

export async function GET() {
  const [rows] = await pool.execute(
    "SELECT setting_key, setting_value FROM site_settings"
  ) as any[];
  const settings: Record<string, string> = {};
  for (const r of rows as any[]) settings[r.setting_key] = r.setting_value ?? "";
  return NextResponse.json(settings);
}

export async function PUT(request: Request) {
  const { key, value } = await request.json();
  if (!ALLOWED_KEYS.includes(key)) {
    return NextResponse.json({ error: "Unknown setting" }, { status: 400 });
  }
  await pool.execute(
    `INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?)
     ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
    [key, value ?? ""]
  );
  return NextResponse.json({ success: true });
}
