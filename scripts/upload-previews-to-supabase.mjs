import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";
import fs from "fs";
import path from "path";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const PREVIEWS_DIR = "./public/previews";
const BUCKET_NAME = "tool-images";

async function optimizeAndUpload() {
  const files = fs.readdirSync(PREVIEWS_DIR);
  console.log(`Found ${files.length} preview images in ${PREVIEWS_DIR}`);

  for (const file of files) {
    if (!file.endsWith(".png") && !file.endsWith(".jpg") && !file.endsWith(".jpeg")) continue;

    const inputPath = path.join(PREVIEWS_DIR, file);
    const baseName = path.parse(file).name;
    const outputFileName = `${baseName}.webp`;

    console.log(`Optimizing ${file}...`);
    const originalSize = fs.statSync(inputPath).size;

    // Compress to high-clarity 800x480 2x Retina WebP at 85% quality
    const compressedBuffer = await sharp(inputPath)
      .resize(800, 480, {
        fit: "cover",
        position: "top",
      })
      .webp({ quality: 85, effort: 6 })
      .toBuffer();

    const compressedSize = compressedBuffer.length;
    const savings = Math.round((1 - compressedSize / originalSize) * 100);
    console.log(`  Original: ${(originalSize / 1024).toFixed(1)} KB -> Compressed: ${(compressedSize / 1024).toFixed(1)} KB (${savings}% savings!)`);

    // Upload to Supabase tool-images bucket
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(outputFileName, compressedBuffer, {
        contentType: "image/webp",
        upsert: true,
      });

    if (error) {
      console.warn(`  Upload note for ${outputFileName}:`, error.message);
    } else {
      const { data: publicUrlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(outputFileName);
      console.log(`  ✓ Uploaded to Supabase Storage: ${publicUrlData.publicUrl}`);
    }
  }

  console.log("\nFinished processing previews!");
}

optimizeAndUpload().catch(console.error);
