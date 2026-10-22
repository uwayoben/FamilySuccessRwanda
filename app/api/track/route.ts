import { NextRequest, NextResponse } from "next/server";
import geoip from "geoip-lite";
import pool from "@/lib/db";

const VISITOR_COOKIE = "fsr_vid";
const BOT_PATTERN = /bot|crawl|spider|slurp|preview|facebookexternalhit|whatsapp|curl|wget|python|headless|lighthouse/i;

// Hosting proxies (Cloudflare, Vercel) send the country directly; otherwise look the IP up locally.
function getCountry(request: NextRequest): string | null {
  const header = request.headers.get("cf-ipcountry") ?? request.headers.get("x-vercel-ip-country");
  if (header && /^[A-Z]{2}$/i.test(header) && header.toUpperCase() !== "XX") return header.toUpperCase();

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip")?.trim();
  if (!ip) return null;
  return geoip.lookup(ip)?.country || null;
}

function externalReferrer(referrer: unknown, host: string | null): string | null {
  if (typeof referrer !== "string" || !referrer) return null;
  try {
    const url = new URL(referrer);
    if (url.host === host) return null;
    return url.hostname.replace(/^www\./, "").slice(0, 255);
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  const empty = new NextResponse(null, { status: 204 });
  if (BOT_PATTERN.test(request.headers.get("user-agent") ?? "")) return empty;

  try {
    const body = await request.json();
    const path = typeof body.path === "string" ? body.path.slice(0, 255) : "";
    if (!path.startsWith("/") || path.startsWith("/admin")) return empty;

    let visitorId = request.cookies.get(VISITOR_COOKIE)?.value;
    if (!visitorId || !/^[0-9a-f-]{36}$/.test(visitorId)) {
      visitorId = crypto.randomUUID();
      empty.cookies.set(VISITOR_COOKIE, visitorId, {
        httpOnly: true,
        sameSite: "lax",
        secure: request.nextUrl.protocol === "https:",
        maxAge: 60 * 60 * 24 * 365,
        path: "/",
      });
    }

    await pool.execute(
      "INSERT INTO site_visits (visitor_id, path, country, referrer) VALUES (?, ?, ?, ?)",
      [visitorId, path, getCountry(request), externalReferrer(body.referrer, request.headers.get("host"))]
    );
  } catch (error) {
    console.error("Track API error:", error);
  }
  return empty;
}
