import fs from "fs";

const code = fs.readFileSync("./src/data/tools.ts", "utf-8");
const match = code.match(/export const TOOLS_DATA: ToolItem\[\] = (\[[\s\S]*?\]);\s*$/);
if (!match) {
  console.error("Could not find TOOLS_DATA");
  process.exit(1);
}

// Convert typescript-like object array to JS
const jsCode = "const data = " + match[1] + "; export default data;";
const module = await import("data:text/javascript;charset=utf-8," + encodeURIComponent(jsCode));
const tools = module.default;

function escapeSql(val) {
  if (val === null || val === undefined) return "NULL";
  if (Array.isArray(val)) {
    const arrayStr = val.map((s) => '"' + s.replace(/"/g, '\\"') + '"').join(",");
    return "'{" + arrayStr.replace(/'/g, "''") + "}'::text[]";
  }
  return "'" + String(val).replace(/'/g, "''") + "'";
}

const tableMap = {
  design: "design_tools",
  development: "development_tools",
  ai: "ai_tools",
  backend: "backend_tools",
  boilerplates: "boilerplate_tools",
};

const statements = [];
for (const t of tools) {
  const table = tableMap[t.domain];
  const cols = [
    "slug",
    "name",
    "category",
    "category_label",
    "description",
    "stars",
    "badge",
    "sub_badge",
    "version",
    "meta_left",
    "meta_right",
    "url",
    "image",
    "accent_color",
    "preview_type",
    "install_cmd",
    "full_description",
    "features",
    "docs_url",
    "github_url",
  ];
  const vals = [
    escapeSql(t.id),
    escapeSql(t.name),
    escapeSql(t.category),
    escapeSql(t.categoryLabel),
    escapeSql(t.description),
    escapeSql(t.stars || "0"),
    escapeSql(t.badge || "v1.0"),
    escapeSql(t.subBadge || null),
    escapeSql(t.version || null),
    escapeSql(t.metaLeft || "Curated"),
    escapeSql(t.metaRight || "Web Tool"),
    escapeSql(t.url),
    escapeSql(t.image),
    escapeSql(t.accentColor || null),
    escapeSql(t.previewType || null),
    escapeSql(t.installCmd || null),
    escapeSql(t.fullDescription || null),
    escapeSql(t.features || null),
    escapeSql(t.docsUrl || null),
    escapeSql(t.githubUrl || null),
  ];
  statements.push(
    `INSERT INTO public.${table} (${cols.join(", ")}) VALUES (${vals.join(", ")}) ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, stars = EXCLUDED.stars, badge = EXCLUDED.badge, url = EXCLUDED.url, image = EXCLUDED.image, full_description = EXCLUDED.full_description, features = EXCLUDED.features;`
  );
}

fs.writeFileSync("./scripts/seed.sql", statements.join("\n"));
console.log(`Generated seed.sql with ${statements.length} insert statements.`);
