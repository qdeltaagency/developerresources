import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { isAuthorized } from "@/lib/auth";

// Allowed MIME types mapped to safe extensions
const MIME_EXTENSION_MAP: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
};

/**
 * Validates actual binary contents against expected magic bytes / signatures.
 * Prevents file-type spoofing (e.g. executable disguised as an image).
 */
function validateFileSignature(buffer: Buffer, mimeType: string): boolean {
  if (buffer.length < 8) return false;

  // JPEG: FF D8 FF
  if (mimeType === "image/jpeg") {
    return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (mimeType === "image/png") {
    return (
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47 &&
      buffer[4] === 0x0d &&
      buffer[5] === 0x0a &&
      buffer[6] === 0x1a &&
      buffer[7] === 0x0a
    );
  }

  // GIF: GIF87a or GIF89a
  if (mimeType === "image/gif") {
    const header = buffer.toString("ascii", 0, 6);
    return header === "GIF87a" || header === "GIF89a";
  }

  // WebP: RIFF .... WEBP
  if (mimeType === "image/webp") {
    if (buffer.length < 12) return false;
    const isRiff = buffer.toString("ascii", 0, 4) === "RIFF";
    const isWebp = buffer.toString("ascii", 8, 12) === "WEBP";
    return isRiff && isWebp;
  }

  // SVG: Inspect text for malicious vectors (Stored XSS / XXE prevention)
  if (mimeType === "image/svg+xml") {
    const text = buffer.toString("utf-8");
    const dangerousPatterns = [
      /<script[\s>]/i,
      /<\/script>/i,
      /on\w+\s*=/i, // inline event handlers (onload, onerror, onclick, etc.)
      /javascript:/i,
      /<foreignObject[\s>]/i,
      /<!ENTITY/i,
      /<!DOCTYPE/i,
      /<iframe[\s>]/i,
      /<embed[\s>]/i,
      /<object[\s>]/i,
    ];

    for (const pattern of dangerousPatterns) {
      if (pattern.test(text)) {
        return false;
      }
    }

    return /<svg[\s>]/i.test(text);
  }

  return false;
}

export async function POST(req: Request) {
  if (!(await isAuthorized(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 1. Strict MIME type check
    const mimeType = file.type.toLowerCase();
    const safeExt = MIME_EXTENSION_MAP[mimeType];
    if (!safeExt) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed formats: JPG, PNG, WebP, GIF, SVG." },
        { status: 400 }
      );
    }

    // 2. Strict file size cap (5MB)
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds 5MB limit." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // 3. Binary magic byte & signature inspection (deep content validation)
    if (!validateFileSignature(buffer, mimeType)) {
      return NextResponse.json(
        { error: "File content does not match the declared image format or contains unsafe elements." },
        { status: 400 }
      );
    }

    // 4. Safe filename construction (ignore user-provided file extension)
    const rawBaseName = file.name.replace(/\.[^/.]+$/, "");
    const safeBaseName = rawBaseName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .slice(0, 32)
      .replace(/^-|-$/g, "") || "upload";

    const fileName = `${safeBaseName}-${Date.now()}.${safeExt}`;

    const { error } = await supabase.storage
      .from("tool-images")
      .upload(fileName, buffer, {
        contentType: mimeType,
        upsert: true,
      });

    if (error) {
      return NextResponse.json(
        { error: `Storage upload failed: ${error.message}` },
        { status: 500 }
      );
    }

    const { data: publicUrlData } = supabase.storage
      .from("tool-images")
      .getPublicUrl(fileName);

    return NextResponse.json({
      success: true,
      url: publicUrlData.publicUrl,
      fileName,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to upload image";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
