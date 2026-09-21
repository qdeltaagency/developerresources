import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  isValidAdminKey,
  isValidSessionToken,
  computeSessionToken,
  COOKIE_NAME,
  ADMIN_KEY,
  checkRateLimit,
  resetRateLimit,
} from "@/lib/auth";

export async function POST(req: Request) {
  try {
    // Client IP rate limiting to prevent automated brute-force attacks
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown-ip";

    const rateLimit = checkRateLimit(`auth:${ip}`, 5, 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: `Too many login attempts. Please wait ${rateLimit.retryAfterSeconds}s before retrying.` },
        {
          status: 429,
          headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
        }
      );
    }

    const body = await req.json();
    const { key } = body;

    if (!isValidAdminKey(key)) {
      return NextResponse.json(
        { error: "Invalid admin key" },
        { status: 401 }
      );
    }

    // Reset rate limit on successful authorization
    resetRateLimit(`auth:${ip}`);

    const cookieStore = await cookies();
    const secureToken = computeSessionToken(ADMIN_KEY);

    cookieStore.set(COOKIE_NAME, secureToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  return NextResponse.json({ success: true });
}

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get(COOKIE_NAME);

  if (session && isValidSessionToken(session.value)) {
    return NextResponse.json({ authenticated: true });
  }

  return NextResponse.json({ authenticated: false }, { status: 401 });
}
