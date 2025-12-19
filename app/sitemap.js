// app/sitemap.js
import fs from "fs";
import path from "path";

// Your actual domain
const SITE_URL = "https://www.ganakahub.com";

// 1. Extract slugs from data.js (preserve category context so tool slugs map to /tools/<category>/<slug>)
function extractSlugsFromDataFile() {
  try {
    const dataPath = path.join(process.cwd(), "lib", "data.js");
    const content = fs.readFileSync(dataPath, "utf8");

    const slugSet = new Set();

    // Parse each category block to know which 'key' (category) the links belong to
    // Use a more permissive regex (non-greedy) so the block is captured even if it contains inner braces/objects
    const categoryRegex = /key:\s*["']([^"']+)["'][\s\S]*?links:\s*\[([\s\S]*?)\]/g;
    let catMatch;

    while ((catMatch = categoryRegex.exec(content)) !== null) {
      const key = catMatch[1].trim(); // e.g., 'finance' or 'students'
      const linksBlock = catMatch[2];

      const urlRegex = /url:\s*["']([^"']+)["']/g;
      let urlMatch;

      while ((urlMatch = urlRegex.exec(linksBlock)) !== null) {
        let raw = urlMatch[1].trim();
        if (!raw || raw === "/") continue;

        // Normalize by removing leading/trailing slashes and whitespace
        raw = raw.replace(/^\/+|\/+$/g, "").trim();
        if (!raw) continue;

        if (raw.startsWith("/")) {
          // Shouldn't reach here because we trimmed leading slash above, but keep for safety
          slugSet.add(raw.replace(/^\/+/, ""));
        } else {
          // For known tool categories, prefix with tools/<category>
          if (["finance", "students", "developer", "others"].includes(key)) {
            slugSet.add(`tools/${key}/${raw}`);
          } else {
            // if it's not a tool category, keep the slug as-is
            slugSet.add(raw);
          }
        }
      }
    }

    // Fallback: capture any absolute url entries outside the category blocks
    // NOTE: only include entries that start with '/' (absolute paths).
    // This avoids adding relative tool slugs again without their category prefix.
    const fallbackRegex = /url:\s*["']([^"']+)["']/g;
    let fallbackMatch;
    while ((fallbackMatch = fallbackRegex.exec(content)) !== null) {
      const raw = fallbackMatch[1].trim();
      if (!raw || raw === "/") continue;

      // Only treat absolute paths here; relative paths are handled by category parsing above
      if (!raw.startsWith("/")) continue;

      const slug = raw.replace(/^\/+/, "");
      slugSet.add(slug);
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

// 2b. Discover pages under app/[locale] (English-only)
function extractPagesFromAppLocale() {
  try {
    const appLocalePath = path.join(process.cwd(), "app", "[locale]");
    if (!fs.existsSync(appLocalePath)) return [];

    const pages = new Set();

    function walk(dir) {
      const items = fs.readdirSync(dir, { withFileTypes: true });
      // If this directory contains a page.(js|jsx|ts|tsx) file, add its relative path
      const hasPage = items.some((it) => it.isFile() && /^(page)\.(js|jsx|ts|tsx)$/.test(it.name));
      if (hasPage) {
        // Normalize Windows backslashes to forward slashes
        const rel = path.relative(appLocalePath, dir).replace(/\\/g, "/");
        // root of [locale] -> '' (handled by STATIC_PAGES)
        pages.add(rel || "");
      }

      for (const it of items) {
        if (it.isDirectory()) walk(path.join(dir, it.name));
      }
    }

    walk(appLocalePath);

    return Array.from(pages);
  } catch (err) {
    console.error("❌ Error reading app/[locale] pages:", err);
    return [];
  }
}

// 3. Final Sitemap (ONLY ENGLISH)
export default async function sitemap() {
  const slugs = extractSlugsFromDataFile();
  const pageDirs = extractPagesFromAppLocale();

  // Merge static pages, slugs from data.js, and page directories discovered in app/[locale]
  const pages = Array.from(new Set([...STATIC_PAGES, ...slugs, ...pageDirs.filter(Boolean)]));

  const lastMod = new Date().toISOString();

  return pages.map((page) => {
    const pathname = page === "" ? "/" : `/${page}`;

    return {
      url: `${SITE_URL}${pathname}`,
      lastModified: lastMod,
    };
  });
}
