import { readFile, writeFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";

const PROJECTS_PATH = resolve(process.cwd(), "src/data/projects.generated.json");
const IMAGES_DIR = resolve(process.cwd(), "public/images");

async function listImages(dir) {
  try {
    const files = await readdir(dir);
    const imageFiles = files.filter((f) => /\.(png|jpe?g|webp|svg|avif|gif)$/i.test(f));
    const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });
    const naturallySorted = [...imageFiles].sort((a, b) => collator.compare(a, b));

    let orderMap = new Map();
    try {
      const customOrderRaw = await readFile(resolve(dir, "_order.txt"), "utf8");
      const customOrder = customOrderRaw
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
      orderMap = new Map(customOrder.map((filename, index) => [filename, index]));
    } catch {
      // _order.txt is optional
    }

    const sorted = [...naturallySorted].sort((a, b) => {
      const aIndex = orderMap.has(a) ? orderMap.get(a) : Number.POSITIVE_INFINITY;
      const bIndex = orderMap.has(b) ? orderMap.get(b) : Number.POSITIVE_INFINITY;
      if (aIndex !== bIndex) return aIndex - bIndex;
      return collator.compare(a, b);
    });

    const relativeDir = dir.replace(`${IMAGES_DIR}/`, "").replace(/\\/g, "/");
    return sorted.map((f) => `/images/${relativeDir}/${f}`);
  } catch {
    return [];
  }
}

async function run() {
  const raw = await readFile(PROJECTS_PATH, "utf8");
  const projects = JSON.parse(raw);

  for (const project of projects) {
    const slugDir = resolve(IMAGES_DIR, project.slug);
    const localImages = await listImages(slugDir);
    if (localImages.length > 0) {
      const existingStable = project.images.filter(
        (url) => !url.startsWith("/images/")
      );
      project.images = [...localImages, ...existingStable];
    }
  }

  await writeFile(PROJECTS_PATH, JSON.stringify(projects, null, 2) + "\n", "utf8");
  const total = projects.reduce((s, p) => s + p.images.length, 0);
  console.log(`[inject-images] Injected local images. Total: ${total} images across ${projects.length} projects.`);
}

run();
