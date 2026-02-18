import { readFile, writeFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";

const PROJECTS_PATH = resolve(process.cwd(), "src/data/projects.generated.json");
const IMAGES_DIR = resolve(process.cwd(), "public/images");

async function listImages(dir) {
  try {
    const files = await readdir(dir);
    return files
      .filter((f) => /\.(png|jpe?g|webp|svg|avif|gif)$/i.test(f))
      .sort()
      .map((f) => `/images/${dir.split("/public/images/")[1]}/${f}`);
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
