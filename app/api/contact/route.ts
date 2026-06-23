import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { full_name, email, phone, subject, message } = body;

    if (!full_name || !email || !subject || !message) {
      return NextResponse.json(
        { message: "Full name, email, subject, and message are required." },
        { status: 400 }
      );
    }

    await pool.execute(
      `INSERT INTO contact_messages (full_name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)`,
      [full_name, email, phone || null, subject, message]
    );

    return NextResponse.json({ message: "Message sent successfully." }, { status: 201 });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { message: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
