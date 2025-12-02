// app/sitemap.js
import fs from "fs";
import path from "path";

// Your actual domain
const SITE_URL = "https://www.ganakahub.com";

// 1. Extract slugs from data.js
function extractSlugsFromDataFile() {
  try {
    const dataPath = path.join(process.cwd(), "lib", "data.js");
    const content = fs.readFileSync(dataPath, "utf8");

    const slugSet = new Set();
    const urlRegex = /url:\s*["']([^"']+)["']/g;

    let match;
    while ((match = urlRegex.exec(content)) !== null) {
      const raw = match[1].trim();
      if (!raw || raw === "/") continue;

      const slug = raw.replace(/^\/+/, "");
      if (slug) slugSet.add(slug);
    }

    return Array.from(slugSet);
  } catch (err) {
    console.error("❌ Error reading data.js:", err);
    return [];
  }
}

// 2. Static English pages
const STATIC_PAGES = [
  "",
  "about-us",
  "contact-us",
  "privacy-policy",
  "terms-and-conditions",
  "disclaimer",
  "finance",
  "tools",
];

// 3. Final Sitemap (ONLY ENGLISH)
export default async function sitemap() {
  const slugs = extractSlugsFromDataFile();
  const pages = Array.from(new Set([...STATIC_PAGES, ...slugs]));

  const lastMod = new Date().toISOString();

  return pages.map((page) => {
    const pathname = page === "" ? "/" : `/${page}`;

    return {
      url: `${SITE_URL}${pathname}`,
      lastModified: lastMod,
    };
  });
}
