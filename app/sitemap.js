import fs from "fs";
import path from "path";
import { LOCALES, DEFAULT_LOCALE } from "../lib/locales";
import { SITE } from "../lib/seo";

function extractSlugsFromDataFile() {
  try {
    const dataPath = path.join(process.cwd(), "lib", "data.js");
    const content = fs.readFileSync(dataPath, "utf8");
    const slugSet = new Set();
    const urlRegex = /url:\s*["']([^"']+)["']/g;
    let m;
    while ((m = urlRegex.exec(content)) !== null) {
      const raw = m[1].trim();
      if (!raw || raw === "/") continue;
      // normalize leading slash
      const slug = raw.replace(/^\/+/, "");
      if (slug) slugSet.add(slug);
    }
    return Array.from(slugSet);
  } catch (err) {
    return [];
  }
}

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

export default async function sitemap() {
  const slugs = extractSlugsFromDataFile();
  const pages = Array.from(new Set([...STATIC_PAGES, ...slugs]));

  const base = SITE && SITE.url ? SITE.url.replace(/\/+$/, "") : "";
  const lastMod = new Date().toISOString();

  const urls = [];

  for (const locale of LOCALES) {
    for (const page of pages) {
      // build path: omit default locale prefix for root/default locale
      let pathname;
      if (page === "") {
        pathname = locale === DEFAULT_LOCALE ? "/" : `/${locale}/`;
      } else {
        pathname = locale === DEFAULT_LOCALE ? `/${page}` : `/${locale}/${page}`;
      }

      // ensure no double slashes except root
      const url = pathname === "/" ? `${base}` : `${base}${pathname}`;

      urls.push({ url, lastModified: lastMod });
    }
  }

  // also include canonical (default-locale) paths for any slugs that might be language-agnostic
  // (already handled above by DEFAULT_LOCALE branch)

  return urls;
}
