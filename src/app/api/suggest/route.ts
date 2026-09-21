import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sanitizeText, isValidHttpUrl } from "@/lib/sanitize";
import { checkRateLimit } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    // 1. IP-based rate limiting (max 5 submissions per 10 minutes per IP)
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown-ip";

    const rateLimit = checkRateLimit(`suggest:${ip}`, 5, 10 * 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: `Too many submissions. Please wait ${rateLimit.retryAfterSeconds}s before submitting again.` },
        {
          status: 429,
          headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
        }
      );
    }

    const body = await req.json();
    const { name, url, category, description, githubUrl, honeypot } = body;

    // 2. Anti-Bot Honeypot trap: bots filling hidden field are silently acknowledged without writing
    if (honeypot && typeof honeypot === "string" && honeypot.trim().length > 0) {
      return NextResponse.json({ success: true, message: "Suggestion received." });
    }

    // 3. Validation & Sanitization
    const cleanName = sanitizeText(name, 100);
    const rawUrl = typeof url === "string" ? url.trim() : "";
    const cleanCategory = sanitizeText(category, 50) || "ui-primitives";
    const cleanDescription = sanitizeText(description, 300);
    const rawGithub = typeof githubUrl === "string" ? githubUrl.trim() : "";

    if (!cleanName || cleanName.length < 2) {
      return NextResponse.json({ error: "Resource name must be at least 2 characters." }, { status: 400 });
    }

    if (!rawUrl || !isValidHttpUrl(rawUrl)) {
      return NextResponse.json({ error: "A valid public website URL (http or https) is required." }, { status: 400 });
    }

    if (rawGithub && !isValidHttpUrl(rawGithub)) {
      return NextResponse.json({ error: "GitHub or documentation link must be a valid public web URL." }, { status: 400 });
    }

    const formattedUrl = rawUrl.startsWith("http://") || rawUrl.startsWith("https://")
      ? rawUrl
      : `https://${rawUrl}`;

    const formattedGithub = rawGithub
      ? (rawGithub.startsWith("http://") || rawGithub.startsWith("https://") ? rawGithub : `https://${rawGithub}`)
      : null;

    // 4. Server-side insert to Supabase suggestions table
    const { error } = await supabase.from("suggestions").insert({
      name: cleanName,
      url: formattedUrl,
      category: cleanCategory,
      description: cleanDescription,
      github_url: formattedGithub,
      status: "pending",
    });

    if (error) {
      console.error("Failed to insert suggestion:", error.message);
      return NextResponse.json(
        { error: "Failed to record suggestion. Please try again later." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
