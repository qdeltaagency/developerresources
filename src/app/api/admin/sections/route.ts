import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { isAuthorized, ADMIN_KEY } from "@/lib/auth";

export async function GET(req: Request) {
  if (!(await isAuthorized(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { data, error } = await supabase
      .from("sections")
      .select("*")
      .order("order_index", { ascending: true })
      .order("title", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ sections: data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch sections";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!(await isAuthorized(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { slug, title, description, icon, orderIndex } = body;

    if (!title) {
      return NextResponse.json(
        { error: "Section title is required" },
        { status: 400 }
      );
    }

    const sectionSlug = (slug || title)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    if (!sectionSlug) {
      return NextResponse.json(
        { error: "Invalid section slug" },
        { status: 400 }
      );
    }

    // Check if section with this slug or title already exists
    const { data: existingSections } = await supabase
      .from("sections")
      .select("slug, title");

    if (existingSections && existingSections.length > 0) {
      const match = existingSections.find(
        (s: { slug: string; title: string }) =>
          s.slug.toLowerCase() === sectionSlug.toLowerCase() ||
          s.title.toLowerCase() === title.trim().toLowerCase()
      );

      // If creating new section (no slug passed originally) and match found, or match found with different slug
      if (match && (!slug || match.slug !== slug)) {
        return NextResponse.json(
          {
            error: `A section with this domain slug or title already exists: "${match.title}" (${match.slug}).`,
          },
          { status: 409 }
        );
      }
    }

    const { data, error } = await supabase.rpc("admin_upsert_section", {
      p_secret: ADMIN_KEY,
      p_slug: sectionSlug,
      p_title: title,
      p_description: description || "",
      p_icon: icon || "layers",
      p_order: typeof orderIndex === "number" ? orderIndex : 10,
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
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json({ error: "Section slug is required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("admin_delete_section", {
      p_secret: ADMIN_KEY,
      p_slug: slug,
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
