import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { isAuthorized, ADMIN_KEY } from "@/lib/auth";

export async function GET(req: Request) {
  if (!(await isAuthorized(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { data, error } = await supabase
      .from("all_tools")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ tools: data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch tools";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!(await isAuthorized(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      domain,
      slug,
      name,
      url,
      category,
      categoryLabel,
      description,
      fullDescription,
      image,
      badge,
      stars,
      metaLeft,
      metaRight,
      githubUrl,
      docsUrl,
      installCmd,
      features,
    } = body;

    if (!domain || !name || !url) {
      return NextResponse.json(
        { error: "Domain, name, and URL are required" },
        { status: 400 }
      );
    }

    const normalizeUrl = (u: string) => {
      return (u || "")
        .trim()
        .toLowerCase()
        .replace(/^https?:\/\//, "")
        .replace(/^www\./, "")
        .replace(/\/+$/, "");
    };

    const cleanUrl = normalizeUrl(url);
    const urlDomain = cleanUrl.split("/")[0];
    const toolSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    // Check if a tool with this website URL or domain already exists in the database
    const { data: existingUrlTools } = await supabase
      .from("all_tools")
      .select("slug, name, url, domain");

    if (existingUrlTools && existingUrlTools.length > 0) {
      const match = existingUrlTools.find((t: { slug: string; name: string; url: string; domain: string }) => {
        if (t.slug === toolSlug) return false;
        const tCleanUrl = normalizeUrl(t.url);
        // Direct match on normalized URL
        if (tCleanUrl === cleanUrl) return true;
        // Or if both are root domains without subpaths (e.g. framer.com and framer.com/)
        const tDomain = tCleanUrl.split("/")[0];
        if (urlDomain && tDomain === urlDomain && !cleanUrl.includes("/") && !tCleanUrl.includes("/")) {
          return true;
        }
        return false;
      });

      if (match) {
        return NextResponse.json(
          {
            error: `A resource with this URL/domain already exists: "${match.name}" (${match.url}) in section "${match.domain}". Duplicate entries are not allowed.`,
          },
          { status: 409 }
        );
      }
    }

    const { data, error } = await supabase.rpc("admin_upsert_tool", {
      p_secret: ADMIN_KEY,
      p_domain: domain,
      p_slug: toolSlug,
      p_name: name,
      p_url: url,
      p_category: category || "general",
      p_category_label: categoryLabel || "Curated",
      p_description: description || "",
      p_full_description: fullDescription || null,
      p_image: image || null,
      p_badge: badge || "Curated",
      p_stars: stars || "New",
      p_meta_left: metaLeft || "v1.0",
      p_meta_right: metaRight || "Free",
      p_github_url: githubUrl || null,
      p_docs_url: docsUrl || null,
      p_install_cmd: installCmd || null,
      p_features: features || [],
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
    const domain = searchParams.get("domain");
    const slug = searchParams.get("slug");

    if (!domain || !slug) {
      return NextResponse.json({ error: "Domain and slug are required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("admin_delete_tool", {
      p_secret: ADMIN_KEY,
      p_domain: domain,
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
