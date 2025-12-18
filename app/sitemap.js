// app/sitemap.js
import fs from "fs";
import path from "path";
import { LOCALES, DEFAULT_LOCALE } from "../lib/locales";

// Your actual domain
const SITE_URL = "https://www.ganakahub.com";

// Helper: recursively collect routes under app/[locale]
function collectRoutesFromApp() {
  const appPath = path.join(process.cwd(), "app", "[locale]");
  const routes = new Set();

  function walk(dir, prefix = "") {
    const items = fs.readdirSync(dir, { withFileTypes: true });

    for (const it of items) {
      const full = path.join(dir, it.name);

      if (it.isDirectory()) {
        // If directory contains a page.jsx (route segment)
        const pageFile = path.join(full, "page.jsx");
        const pageFileJs = path.join(full, "page.js");
        const pageFileTsx = path.join(full, "page.tsx");
        if (fs.existsSync(pageFile) || fs.existsSync(pageFileJs) || fs.existsSync(pageFileTsx)) {
          const route = path.posix.join(prefix, it.name === "[locale]" ? "" : it.name);
          // don't add when it's the [locale] root (prefix empty)
          if (route && route !== "[locale]") {
            routes.add(route.replace(/^\/+/, ""));
          }
        }

        // Recurse into the directory
        const nextPrefix = path.posix.join(prefix, it.name === "[locale]" ? "" : it.name);
        walk(full, nextPrefix === "[locale]" ? "" : nextPrefix);
      }
    }
  }

  if (!fs.existsSync(appPath)) return [];
  walk(appPath, "");

  // Normalize routes (remove duplicates)
  return Array.from(routes).map((r) => r.replace(/\\\\/g, "/")).filter(Boolean);
}

// Static top-level pages (kept intentionally minimal)
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

export default async function sitemap() {
  // 1) Collect routes from the app folder (reflects actual pages)
  const appRoutes = collectRoutesFromApp();

  // 2) Combine with STATIC_PAGES
  const pagesSet = new Set(STATIC_PAGES.map((p) => (p === "" ? "" : p)));
  for (const r of appRoutes) pagesSet.add(r.replace(/^\/+/, ""));

  // 3) Ensure common calculator routes that may be listed in data.js but not as standalone folders
  // (these often live under /tools/finance or /tools/students). We'll include a safe mapping for common groups.
  // Scan lib/data.js for 'sublinks' to add any missing calculator slugs.
  try {
    // import at runtime using a file:// URL (robust on Windows)
    const { pathToFileURL } = await import("url");
    const dataPath = path.join(process.cwd(), "lib", "data.js");
    const data = await import(pathToFileURL(dataPath).href);
    const sublinks = data.default || [];

    for (const group of sublinks) {
      const groupKey = group.key;
      for (const link of group.links || []) {
        const raw = (link.url || "").trim();
        if (!raw || raw === "/") continue;

        // If link.url is absolute path like '/finance', keep as is
        if (raw.startsWith("/")) {
          pagesSet.add(raw.replace(/^\/+/, ""));
          continue;
        }

        // Map by group key (most groups live under tools)
        let prefix = "";
        if (groupKey === "finance") prefix = "tools/finance";
        else if (groupKey === "students") prefix = "tools/students";
        else if (groupKey) prefix = `tools/${groupKey}`;

        const route = prefix ? `${prefix}/${raw}` : raw;
        pagesSet.add(route.replace(/^\/+/, ""));
      }
    }
  } catch (err) {
    // Not fatal — we will still generate sitemap from app routes and static pages
    console.warn("Could not import lib/data.js for sitemap enrichment:", err.message || err);
  }

  const pages = Array.from(pagesSet).filter(Boolean);

  const lastMod = new Date().toISOString();

  const urls = [];

  // Sitemap emission mode
  // If true: emit only locale-prefixed URLs (e.g. /en/about-us, /hi/about-us)
  // If false: emit unprefixed URLs for all pages (ONLY MAIN URLs) and no locale-prefixed variants
  const PREFER_ONLY_LOCALE_PREFIX = false;

  // If you want strictly only the main site URLs (no locale prefixes at all), set this to true.
  // The user requested "only main urls" — we'll enable this mode by default below.
  const EMIT_ONLY_UNPREFIXED = true;

  for (const page of pages) {
    // If the strict only-unprefixed mode is active, emit only the main URL
    if (EMIT_ONLY_UNPREFIXED) {
      const pathname = page === "" ? "/" : `/${page}`;
      urls.push({ url: `${SITE_URL}${pathname}`, lastModified: lastMod });
      continue;
    }

    // Otherwise, follow the prefix preference
    if (!PREFER_ONLY_LOCALE_PREFIX) {
      // Emit the unprefixed/default URL (e.g. /about-us or /)
      const pathname = page === "" ? "/" : `/${page}`;
      urls.push({ url: `${SITE_URL}${pathname}`, lastModified: lastMod });
    }

    // Add localized variants. If preferring only prefixes, include all locales; otherwise
    // include only non-default locales to avoid duplicates with the unprefixed default.
    for (const locale of LOCALES) {
      if (!PREFER_ONLY_LOCALE_PREFIX && locale === DEFAULT_LOCALE) continue;

      const localizedPath = page === "" ? `/${locale}` : `/${locale}/${page}`;
      urls.push({ url: `${SITE_URL}${localizedPath}`, lastModified: lastMod });
    }
  }

  // Deduplicate final URLs by url
  const seen = new Set();
  return urls.filter((u) => {
    if (seen.has(u.url)) return false;
    seen.add(u.url);
    return true;
  });
}
