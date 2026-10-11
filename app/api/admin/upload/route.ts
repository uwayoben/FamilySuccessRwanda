import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string | null) ?? "misc";

    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
    const isPdf = file.type === "application/pdf";
    if (!isPdf && !file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image or a PDF" }, { status: 400 });
    }
    // PDFs stay under the 10 MB request body limit that applies behind proxy.ts.
    if (isPdf && file.size > 9 * 1024 * 1024) {
      return NextResponse.json({ error: "PDF must be under 9 MB" }, { status: 400 });
    }
    if (!isPdf && file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "Image must be under 5 MB" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = isPdf ? "pdf" : file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, filename), buffer);

    return NextResponse.json({ url: `/uploads/${folder}/${filename}` });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[upload] Failed:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
