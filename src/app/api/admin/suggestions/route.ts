import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { isAuthorized, ADMIN_KEY } from "@/lib/auth";

export async function GET(req: Request) {
  if (!(await isAuthorized(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { data, error } = await supabase.rpc("admin_get_suggestions", {
      p_secret: ADMIN_KEY,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ suggestions: data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch suggestions";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!(await isAuthorized(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, domain, categoryLabel, badge, image } = body;

    if (!id || !domain) {
      return NextResponse.json({ error: "ID and domain are required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("admin_approve_suggestion", {
      p_secret: ADMIN_KEY,
      p_id: id,
      p_domain: domain,
      p_category_label: categoryLabel || "Curated",
      p_badge: badge || "Community",
      p_image: image || null,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!(await isAuthorized(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("admin_reject_suggestion", {
      p_secret: ADMIN_KEY,
      p_id: id,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
