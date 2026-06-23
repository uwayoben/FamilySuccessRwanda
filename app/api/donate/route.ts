import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { full_name, email, phone, amount, currency, donation_type, message } = body;

    if (!full_name || !email || !amount || Number(amount) <= 0) {
      return NextResponse.json(
        { message: "Full name, email, and a valid amount are required." },
        { status: 400 }
      );
    }

    await pool.execute(
      `INSERT INTO donations (full_name, email, phone, amount, currency, donation_type, message)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        full_name,
        email,
        phone || null,
        Number(amount),
        currency || "USD",
        donation_type || "general",
        message || null,
      ]
    );

    return NextResponse.json({ message: "Donation recorded successfully." }, { status: 201 });
  } catch (error) {
    console.error("Donate API error:", error);
    return NextResponse.json(
      { message: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
