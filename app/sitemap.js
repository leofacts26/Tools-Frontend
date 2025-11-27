import fs from "fs";
import path from "path";
import { LOCALES, DEFAULT_LOCALE } from "../lib/locales";

// ✅ Your actual domain
const SITE_URL = "https://www.ganakahub.com";  

// ------------------------------
// Extract all slugs from lib/data.js
// ------------------------------
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

      const slug = raw.replace(/^\/+/, ""); // remove leading slash
      if (slug) slugSet.add(slug);
    }

    return Array.from(slugSet);
  } catch (err) {
    console.error("❌ Error reading data.js:", err);
    return [];
  }
}

// ------------------------------
// Static pages
// ------------------------------
const STATIC_PAGES = [
  "",
  "about-us",
  "contact",
  "privacy-policy",
  "terms-and-conditions",
  "disclaimer",
  "finance",
  "tools",
];

// ------------------------------
// FINAL SITEMAP
// ------------------------------
export default async function sitemap() {
  const slugs = extractSlugsFromDataFile();
  const pages = Array.from(new Set([...STATIC_PAGES, ...slugs]));

  const lastMod = new Date().toISOString();

  const urls = [];

  for (const locale of LOCALES) {
    for (const page of pages) {
      let pathname;

      // Root route (homepage)
      if (page === "") {
        pathname = locale === DEFAULT_LOCALE ? "/" : `/${locale}/`;
      } else {
        pathname =
          locale === DEFAULT_LOCALE
            ? `/${page}`
            : `/${locale}/${page}`;
      }

      // Ensure valid URL without double slashes
      const finalURL =
        pathname === "/"
          ? SITE_URL
          : `${SITE_URL}${pathname}`.replace(/([^:]\/)\/+/g, "$1");

      urls.push({
        url: finalURL,
        lastModified: lastMod,
      });
    }
  }

  return urls;
}
