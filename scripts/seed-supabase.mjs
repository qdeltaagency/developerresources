import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Read tools from tools.ts
const toolsFile = readFileSync("./src/data/tools.ts", "utf-8");

// We can dynamically evaluate the array or parse it
// Let's extract the TOOLS_DATA block
const match = toolsFile.match(/export const TOOLS_DATA: ToolItem\[\] = (\[[\s\S]*?\]);\s*$/);

if (!match) {
  console.error("Could not find TOOLS_DATA array");
  process.exit(1);
}

// Convert typescript-like object array to JS
const jsCode = "const data = " + match[1] + "; export default data;";
import("data:text/javascript;charset=utf-8," + encodeURIComponent(jsCode))
  .then(async (module) => {
    const tools = module.default;
    console.log(`Found ${tools.length} tools to seed into Supabase.`);

    const formatted = tools.map((t) => ({
      id: t.id,
      name: t.name,
      domain: t.domain,
      category: t.category,
      category_label: t.categoryLabel,
      description: t.description,
      stars: t.stars || "0",
      badge: t.badge || "v1.0",
      sub_badge: t.subBadge || null,
      version: t.version || null,
      meta_left: t.metaLeft || "Curated",
      meta_right: t.metaRight || "Web Tool",
      url: t.url,
      image: t.image || "/previews/shadcn-ui.png",
      accent_color: t.accentColor || null,
      preview_type: t.previewType || null,
      install_cmd: t.installCmd || null,
      full_description: t.fullDescription || null,
      features: t.features || null,
      docs_url: t.docsUrl || null,
      github_url: t.githubUrl || null,
    }));

    // Batch upsert in chunks of 25
    for (let i = 0; i < formatted.length; i += 25) {
      const chunk = formatted.slice(i, i + 25);
      const { data, error } = await supabase.from("tools").upsert(chunk, { onConflict: "id" });
      if (error) {
        console.error(`Error inserting chunk ${i}:`, error);
      } else {
        console.log(`Upserted ${i + chunk.length}/${formatted.length} tools`);
      }
    }

    console.log("Seeding complete!");
  })
  .catch((err) => {
    console.error("Evaluation error:", err);
  });
