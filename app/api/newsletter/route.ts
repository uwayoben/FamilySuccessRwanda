import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let email = "";
    let name = "";

    if (contentType.includes("application/json")) {
      const body = await request.json();
      email = body.email;
      name = body.name || "";
    } else {
      const formData = await request.formData();
      email = String(formData.get("email") || "");
      name = String(formData.get("name") || "");
    }

    if (!email) {
      return NextResponse.json({ message: "Email is required." }, { status: 400 });
    }

    await pool.execute(
      `INSERT INTO newsletter_subscribers (email, name) VALUES (?, ?)
       ON DUPLICATE KEY UPDATE is_active = 1`,
      [email, name || null]
    );

    return NextResponse.json({ message: "Subscribed successfully." }, { status: 201 });
  } catch (error) {
    console.error("Newsletter API error:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}
