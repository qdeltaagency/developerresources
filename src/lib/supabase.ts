import { createClient } from "@supabase/supabase-js";
import { ToolItem, DomainID, SubcategoryID } from "@/data/tools";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const DOMAIN_TABLE_MAP: Record<DomainID, string> = {
  design: "design_tools",
  development: "development_tools",
  ai: "ai_tools",
  backend: "backend_tools",
  boilerplates: "boilerplate_tools",
};

export interface DbTool {
  id?: string;
  slug: string;
  name: string;
  domain?: string;
  category: string;
  category_label: string;
  description: string;
  stars: string;
  badge: string;
  sub_badge?: string | null;
  version?: string | null;
  meta_left: string;
  meta_right: string;
  url: string;
  image: string;
  accent_color?: string | null;
  preview_type?: string | null;
  install_cmd?: string | null;
  full_description?: string | null;
  features?: string[] | null;
  docs_url?: string | null;
  github_url?: string | null;
  created_at?: string;
}

export function mapDbToolToToolItem(dbTool: DbTool, fallbackDomain?: DomainID): ToolItem {
  return {
    id: dbTool.slug || dbTool.id || "",
    name: dbTool.name,
    domain: (dbTool.domain as DomainID) || fallbackDomain || "development",
    category: dbTool.category as SubcategoryID,
    categoryLabel: dbTool.category_label,
    description: dbTool.description,
    stars: dbTool.stars,
    badge: dbTool.badge,
    subBadge: dbTool.sub_badge || undefined,
    version: dbTool.version || undefined,
    metaLeft: dbTool.meta_left,
    metaRight: dbTool.meta_right,
    url: dbTool.url,
    image: dbTool.image,
    accentColor: dbTool.accent_color || undefined,
    previewType: dbTool.preview_type || undefined,
    installCmd: dbTool.install_cmd || undefined,
    fullDescription: dbTool.full_description || undefined,
    features: dbTool.features || undefined,
    docsUrl: dbTool.docs_url || undefined,
    githubUrl: dbTool.github_url || undefined,
  };
}

export function mapToolItemToDbTool(tool: ToolItem): DbTool {
  return {
    slug: tool.id,
    name: tool.name,
    domain: tool.domain,
    category: tool.category,
    category_label: tool.categoryLabel,
    description: tool.description,
    stars: tool.stars || "0",
    badge: tool.badge || "v1.0",
    sub_badge: tool.subBadge || null,
    version: tool.version || null,
    meta_left: tool.metaLeft || "Curated",
    meta_right: tool.metaRight || "Web Tool",
    url: tool.url,
    image: tool.image || "/previews/shadcn-ui.png",
    accent_color: tool.accentColor || null,
    preview_type: tool.previewType || null,
    install_cmd: tool.installCmd || null,
    full_description: tool.fullDescription || null,
    features: tool.features || null,
    docs_url: tool.docsUrl || null,
    github_url: tool.githubUrl || null,
  };
}

export interface DbSection {
  slug: string;
  title: string;
  description: string;
  icon?: string | null;
  order_index?: number;
  created_at?: string;
}

export async function fetchSections(): Promise<DbSection[]> {
  try {
    const { data, error } = await supabase
      .from("sections")
      .select("*")
      .order("order_index", { ascending: true })
      .order("title", { ascending: true });

    if (data && data.length > 0 && !error) {
      return data;
    }
  } catch (err) {
    console.error("Supabase fetchSections error:", err);
  }
  return [];
}

export async function fetchTools(domain?: DomainID | "all"): Promise<ToolItem[]> {
  try {
    if (domain && domain !== "all") {
      const tableName = (DOMAIN_TABLE_MAP as Record<string, string>)[domain];
      if (tableName) {
        const { data, error } = await supabase.from(tableName).select("*");
        if (data && data.length > 0 && !error) {
          return data.map((d: DbTool) => mapDbToolToToolItem(d, domain));
        }
      } else {
        // Dynamic custom domain tools
        const { data, error } = await supabase
          .from("all_tools")
          .select("*")
          .eq("domain", domain);
        if (data && !error) {
          return data.map((d: DbTool) => mapDbToolToToolItem(d, domain));
        }
      }
    } else {
      // Global catalog or /directory queries the unified all_tools view
      const { data, error } = await supabase.from("all_tools").select("*");
      if (data && data.length > 0 && !error) {
        return data.map((d: DbTool) => mapDbToolToToolItem(d));
      }
    }
  } catch (err) {
    console.error("Supabase tools fetch error:", err);
  }

  return [];
}

export async function fetchToolBySlug(slug: string): Promise<ToolItem | null> {
  try {
    const { data, error } = await supabase
      .from("all_tools")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (data && !error) {
      return mapDbToolToToolItem(data);
    }
  } catch (err) {
    console.error("Supabase single tool fetch error:", err);
  }

  return null;
}

