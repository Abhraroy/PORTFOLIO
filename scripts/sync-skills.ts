import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SKILL_TRACK_CONFIG } from "../components/Skills/skills.config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DEST_DIR = path.resolve(__dirname, "../public/icons/skills");

async function downloadIcon(slug: string, targetPath: string): Promise<boolean> {
  const url = `https://skills.syvixor.com/api/icons?i=${slug}`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`[sync-skills] Failed to fetch ${url} (status ${res.status})`);
      return false;
    }
    const svgText = await res.text();
    if (!svgText.includes("<svg") || svgText.length < 100) {
      console.warn(`[sync-skills] Invalid SVG payload received for: ${slug}`);
      return false;
    }
    fs.writeFileSync(targetPath, svgText, "utf-8");
    return true;
  } catch (err) {
    console.error(`[sync-skills] Error downloading ${slug}:`, err);
    return false;
  }
}

export async function syncSkills(force = false) {
  if (!fs.existsSync(DEST_DIR)) {
    fs.mkdirSync(DEST_DIR, { recursive: true });
  }

  const slugs = Array.from(
    new Set(SKILL_TRACK_CONFIG.map((s) => s.icon || s.id.toLowerCase()))
  );

  console.log(`[sync-skills] Checking ${slugs.length} skill icons in public/icons/skills...`);

  let downloadedCount = 0;
  let skippedCount = 0;

  for (const slug of slugs) {
    const targetFile = path.join(DEST_DIR, `${slug}.svg`);
    if (!force && fs.existsSync(targetFile)) {
      skippedCount++;
      continue;
    }

    process.stdout.write(`[sync-skills] Downloading "${slug}"... `);
    const success = await downloadIcon(slug, targetFile);
    if (success) {
      console.log("OK");
      downloadedCount++;
    } else {
      console.log("FAILED");
    }
  }

  console.log(
    `[sync-skills] Sync complete! Downloaded: ${downloadedCount}, Already local: ${skippedCount}, Total: ${slugs.length}\n`
  );
}

// Support CLI flags: --force, --watch
const args = process.argv.slice(2);
const isWatch = args.includes("--watch");
const isForce = args.includes("--force");

await syncSkills(isForce);

if (isWatch) {
  console.log("[sync-skills] Watching components/Skills/skills.config.ts for changes...");
  const configPath = path.resolve(__dirname, "../components/Skills/skills.config.ts");
  let debounceTimeout: NodeJS.Timeout | null = null;
  fs.watch(configPath, () => {
    if (debounceTimeout) clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(async () => {
      console.log("[sync-skills] Detected change in skills.config.ts. Re-syncing icons...");
      await syncSkills(false);
    }, 500);
  });
}
