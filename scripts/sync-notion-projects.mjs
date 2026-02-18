import { Client } from "@notionhq/client";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const OUTPUT_PATH = resolve(process.cwd(), "src/data/projects.generated.json");
const ENV_PATH = resolve(process.cwd(), ".env.local");

const ACCENTS = ["primary", "secondary", "blue", "green", "white"];
const SHAPES = ["square", "circle", "triangle"];

const ALIASES = {
  projectName: ["title", "name", "projectname", "project"],
  subHeader: ["subheader", "sub-header", "subtitle", "category", "header"],
  description: ["projectdescription", "description", "summary", "shortdescription", "overview"],
  bodyText: ["bodytext", "body", "content", "details", "longdescription"],
  url: ["projecturl", "url", "link", "website", "externalurl", "projectlink"],
  images: ["files&media", "filesmedia", "images", "image", "gallery", "cover", "media"],
  tags: ["tags", "tag", "topics", "labels", "services"],
  year: ["year", "date"]
};

function normalizeKey(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function findProperty(properties, aliases) {
  const entries = Object.entries(properties || {});
  const normalizedAliases = aliases.map(normalizeKey);

  for (const [key, value] of entries) {
    if (normalizedAliases.includes(normalizeKey(key))) return value;
  }

  for (const alias of normalizedAliases) {
    for (const [key, value] of entries) {
      const normKey = normalizeKey(key);
      if (normKey.includes(alias) || alias.includes(normKey)) return value;
    }
  }

  return null;
}

function richTextToString(items = []) {
  return items.map((item) => item?.plain_text ?? "").join("").trim();
}

function extractText(prop) {
  if (!prop) return "";
  switch (prop.type) {
    case "title":
      return richTextToString(prop.title);
    case "rich_text":
      return richTextToString(prop.rich_text);
    case "select":
      return prop.select?.name ?? "";
    case "multi_select":
      return (prop.multi_select || []).map((item) => item.name).join(", ");
    case "url":
      return prop.url ?? "";
    case "number":
      return prop.number == null ? "" : String(prop.number);
    case "status":
      return prop.status?.name ?? "";
    case "date":
      return prop.date?.start ?? "";
    case "formula":
      return extractText(prop.formula);
    case "rollup":
      if (prop.rollup?.type === "array") {
        return (prop.rollup.array || []).map(extractText).filter(Boolean).join(", ");
      }
      if (prop.rollup?.type === "number") return String(prop.rollup.number ?? "");
      if (prop.rollup?.type === "date") return prop.rollup.date?.start ?? "";
      return "";
    default:
      return "";
  }
}

function extractUrl(prop) {
  if (!prop) return "";
  if (prop.type === "url") return prop.url ?? "";
  if (prop.type === "files") {
    const first = prop.files?.[0];
    if (!first) return "";
    if (first.type === "external") return first.external?.url ?? "";
    if (first.type === "file") return first.file?.url ?? "";
  }
  const text = extractText(prop);
  const match = text.match(/https?:\/\/\S+/i);
  return match ? match[0] : "";
}

function isStableImageUrl(url) {
  if (!url) return false;
  if (url.includes("prod-files-secure.s3.us-west-2.amazonaws.com")) return false;
  if (/\.(pdf)(\?|$)/i.test(url)) return false;
  return true;
}

function extractImages(prop) {
  if (!prop) return [];
  let urls = [];
  if (prop.type === "files") {
    urls = (prop.files || [])
      .map((file) => {
        if (file.type === "external") return file.external?.url;
        if (file.type === "file") return file.file?.url;
        return null;
      })
      .filter(Boolean);
  } else {
    const text = extractText(prop);
    urls = text
      .split(/[\n,\s]+/)
      .map((value) => value.trim())
      .filter((value) => /^https?:\/\//i.test(value));
  }
  return urls.filter(isStableImageUrl);
}

function extractTags(prop) {
  if (!prop) return [];
  if (prop.type === "multi_select") {
    return (prop.multi_select || []).map((item) => item.name).filter(Boolean);
  }
  if (prop.type === "select" && prop.select?.name) return [prop.select.name];
  const text = extractText(prop);
  return text
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function makeProjectFromPage(page, index, usedSlugs) {
  const props = page.properties || {};
  const titleProp = findProperty(props, ALIASES.projectName);
  const title = extractText(titleProp);
  if (!title) return null;

  const subHeader = extractText(findProperty(props, ALIASES.subHeader));
  const description = extractText(findProperty(props, ALIASES.description));
  const bodyText = extractText(findProperty(props, ALIASES.bodyText));
  const url = extractUrl(findProperty(props, ALIASES.url));
  const images = extractImages(findProperty(props, ALIASES.images));
  const tags = extractTags(findProperty(props, ALIASES.tags));
  const yearText = extractText(findProperty(props, ALIASES.year));
  const parsedYear = (yearText.match(/\d{4}/) || [])[0] || String(new Date().getFullYear());

  const baseSlug = slugify(title) || `project-${index + 1}`;
  let slug = baseSlug;
  let counter = 2;
  while (usedSlugs.has(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  usedSlugs.add(slug);

  const accent = ACCENTS[index % ACCENTS.length];
  const thumbnailShape = SHAPES[index % SHAPES.length];
  const thumbnailHoverShape = SHAPES[(index + 1) % SHAPES.length];

  return {
    slug,
    title,
    subHeader: subHeader || "Project",
    description: description || bodyText || "Project summary coming soon.",
    bodyText: bodyText || description || "Project details coming soon.",
    url: url || undefined,
    images,
    tags,

    // compatibility fields for current UI
    category: subHeader || tags[0] || "Project",
    summary: description || bodyText || "Project summary coming soon.",
    services: tags,
    year: parsedYear,
    challenge: bodyText || description || "Challenge details coming soon.",
    process: bodyText || description || "Process details coming soon.",
    outcome: bodyText || description || "Outcome details coming soon.",
    accent,
    thumbnailShape,
    thumbnailHoverShape
  };
}

async function writeGenerated(projects) {
  await writeFile(OUTPUT_PATH, `${JSON.stringify(projects, null, 2)}\n`, "utf8");
}

async function run() {
  try {
    const envContent = await readFile(ENV_PATH, "utf8");
    for (const line of envContent.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const equalsIndex = trimmed.indexOf("=");
      if (equalsIndex <= 0) continue;
      const key = trimmed.slice(0, equalsIndex).trim();
      const value = trimmed.slice(equalsIndex + 1).trim();
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    // .env.local is optional in CI and fallback flows
  }

  const apiKey = process.env.NOTION_API_KEY;
  const databaseId = process.env.NOTION_DATABASE_ID;

  if (!apiKey || !databaseId) {
    console.warn("[sync:projects] Missing NOTION_API_KEY or NOTION_DATABASE_ID. Writing empty generated data.");
    await writeGenerated([]);
    return;
  }

  const notion = new Client({ auth: apiKey });
  const pages = [];
  let cursor = undefined;

  try {
    const database = await notion.databases.retrieve({ database_id: databaseId });
    const dataSourceId = database.data_sources?.[0]?.id;
    if (!dataSourceId) {
      throw new Error("No data source found for this database. Verify the Notion database ID.");
    }

    while (true) {
      const response = await notion.dataSources.query({
        data_source_id: dataSourceId,
        start_cursor: cursor
      });

      pages.push(...response.results.filter((item) => item.object === "page"));
      if (!response.has_more || !response.next_cursor) break;
      cursor = response.next_cursor;
    }

    const usedSlugs = new Set();
    const projects = pages
      .map((page, index) => makeProjectFromPage(page, index, usedSlugs))
      .filter(Boolean);

    await writeGenerated(projects);
    console.log(`[sync:projects] Wrote ${projects.length} project(s) to src/data/projects.generated.json`);
  } catch (error) {
    console.warn("[sync:projects] Notion sync failed, writing empty generated data for local fallback.");
    console.warn(error instanceof Error ? error.message : String(error));
    await writeGenerated([]);
  }
}

run();
