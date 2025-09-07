"use client";
import React, { useState, useRef, useEffect } from "react";
import { useGlobalContext } from "@/context/context";
import { useParams, usePathname } from "next/navigation";
import { useLocale, useTranslations, useMessages } from "next-intl";
import Link from "next/link";

const titleToSlug = (title) =>
  String(title || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// helper to strip leading slashes for keys
const stripLeadingSlash = (s) => (typeof s === "string" ? s.replace(/^\/+/, "") : s);

const ensureUniqueKeys = (items, category) => {
  const seen = new Map(); // map baseKey -> count
  return items.map((it) => {
    let base = it.key || `${category}-${stripLeadingSlash(it.url || it.label || "")}`;
    if (!base || base === `${category}-`) base = `${category}-item`;
    // normalize base to remove any slashes/spaces (keep safe characters)
    base = String(base).replace(/[^a-zA-Z0-9-_]/g, "-");

    if (!seen.has(base)) {
      seen.set(base, 0);
      return { ...it, key: base };
    }
    const next = seen.get(base) + 1;
    seen.set(base, next);
    const newKey = `${base}-${next}`;
    return { ...it, key: newKey };
  });
};

const Submenu = () => {
  const { isSubmenuOpen, page, location, closeSubmenu } = useGlobalContext();
  const pathname = usePathname();
  const params = useParams();
  const localeFromHook = useLocale();

  // next-intl hooks
  const t = typeof useTranslations === "function" ? useTranslations("common") : () => "";
  const useMsgs = typeof useMessages === "function" ? useMessages : () => () => ({});
  let rawMessages = {};
  try {
    // useMessages returns a function in some versions; handle both shapes
    const maybe = useMsgs();
    rawMessages = maybe || {};
  } catch (err) {
    rawMessages = {};
  }

  // Normalise locale
  const locale =
    typeof localeFromHook === "string"
      ? localeFromHook
      : (params && params.locale) || "en";

  // 1) try category from params
  const categoryFromParams = params?.category ?? null;

  // 2) try to derive from the submenu page title (e.g. "Finance" -> "finance")
  const categoryFromPage = page && page.page ? titleToSlug(page.page) : null;

  // 3) fallback to parsing pathname
  const categoryFromPath = (() => {
    if (!pathname) return null;
    const parts = pathname.split("/").filter(Boolean);
    // expectation: ['en', 'tools', 'finance', 'sip-calculator']
    const toolsIndex = parts.indexOf("tools");
    if (toolsIndex >= 0 && parts.length > toolsIndex + 1) {
      return parts[toolsIndex + 1];
    }
    return null;
  })();

  // priority: params -> page-derived -> path -> unknown
  const category =
    categoryFromParams || categoryFromPage || categoryFromPath || "unknown";

  // If `page` already contains links array (old behavior), use it.
  // Otherwise, lookup translations: tries multiple shapes depending on your provider:
  // 1) messages.navbar[category].links
  // 2) messages.common.navbar[category].links
  // 3) messages[category].links
  const getLinksFromMessages = () => {
    const try1 = rawMessages?.navbar?.[category]?.links;
    const try2 = rawMessages?.common?.navbar?.[category]?.links;
    const try3 = rawMessages?.[category]?.links;
    return try1 || try2 || try3 || null;
  };

  const linksObj = getLinksFromMessages();

  // Normalize to array of { key, label, url, icon }
  const normalizedLinks = (() => {
    // 1) If page.links array exists, normalize its items to include key/url/label/icon
    if (Array.isArray(page?.links) && page.links.length > 0) {
      const arr = page.links.map((ln, idx) => {
        const label = ln.label || ln.title || `item-${idx}`;
        const url = ln.url ? stripLeadingSlash(ln.url) : ln.key ? stripLeadingSlash(ln.key) : `item-${idx}`;
        const icon = ln.icon || null;
        const maybeKey = ln.key || `${category}-${url || idx}`;
        return { key: maybeKey, label, url, icon };
      });
      return ensureUniqueKeys(arr, category);
    }

    // 2) If linksObj (object) exists, convert entries
    if (linksObj && typeof linksObj === "object") {
      const arr = Object.entries(linksObj).map(([slug, val = {}]) => {
        // val might be { label: "SIP Calculator", url: "sip-calculator", icon: "<svg/>" }
        const label =
          (val && (val.label || val.title)) ||
          (t ? t(`navbar.${category}.links.${slug}.label`) : slug) ||
          slug;
        // If val.url exists and begins with '/', preserve it for href but strip for key
        const rawUrl = val && (val.url || slug);
        const url = typeof rawUrl === "string" ? stripLeadingSlash(rawUrl) : slug;
        const icon = val && val.icon ? val.icon : null;
        const baseKey = `${category}-${url || slug}`;
        return { key: baseKey, label, url, icon };
      });
      return ensureUniqueKeys(arr, category);
    }

    // nothing found — return empty array
    return [];
  })();

  const currentTitle =
    // prefer page.page if provided
    (page && page.page) ||
    // else try translation for the category page title
    (t ? t(`navbar.${category}.page`) : category);

  const container = useRef(null);
  const [columns, setColumns] = useState("col-2");

  // Position & columns
  useEffect(() => {
    if (!container.current || !location) return;

    setColumns("col-2");
    const submenu = container.current;
    const { center, bottom } = location;
    submenu.style.left = `${center}px`;
    submenu.style.top = `${bottom}px`;

    if (normalizedLinks.length === 3) setColumns("col-3");
    if (normalizedLinks.length > 3) setColumns("col-4");
  }, [location, normalizedLinks.length]);

  // Close on outside click
  useEffect(() => {
    if (!isSubmenuOpen) return;

    const handleClickOutside = (e) => {
      const el = container.current;
      const onTrigger = e.target?.closest?.(".link-btn");
      if (el && !el.contains(e.target) && !onTrigger) closeSubmenu();
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isSubmenuOpen, closeSubmenu]);

  // Close on outside pointer move
  useEffect(() => {
    if (!isSubmenuOpen) return;

    const onMove = (e) => {
      const el = container.current;
      if (!el) return;

      const insideSubmenu = el.contains(e.target);
      const overTrigger = !!e.target?.closest?.(".link-btn");

      if (!insideSubmenu && !overTrigger) {
        closeSubmenu();
      }
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    return () => document.removeEventListener("pointermove", onMove);
  }, [isSubmenuOpen, closeSubmenu]);

  // Close on Esc
  useEffect(() => {
    if (!isSubmenuOpen) return;
    const onKey = (e) => e.key === "Escape" && closeSubmenu();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isSubmenuOpen, closeSubmenu]);

  // Close on route change
  useEffect(() => {
    if (isSubmenuOpen) closeSubmenu();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Build href (uses locale + category fallback)
  const buildHref = (url) => {
    if (!url) return `/${locale}/tools/${category}`;
    // if url already absolute (starts with http or /), handle correctly:
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    if (url.startsWith("/")) return `/${locale}/tools/${category}/${stripLeadingSlash(url)}`;
    return `/${locale}/tools/${category}/${stripLeadingSlash(url)}`;
  };

  return (
    <aside
      className={`${isSubmenuOpen ? "submenu show" : "submenu"}`}
      ref={container}
      role="menu"
      aria-hidden={!isSubmenuOpen}
      onMouseLeave={() => closeSubmenu()}
    >
      <section>
        <h4>{currentTitle}</h4>
        <div className={`submenu-center ${columns}`}>
          {normalizedLinks.length === 0 && <p className="muted">No items</p>}
          {normalizedLinks.map((link) => {
            const { key, url, icon, label } = link;
            const href = buildHref(url);
            // key is already guaranteed unique by ensureUniqueKeys
            return (
              <Link
                key={key}
                href={href}
                role="menuitem"
                tabIndex={isSubmenuOpen ? 0 : -1}
                className="submenu-link"
              >
                {icon ? <span className="submenu-icon">{icon}</span> : null}
                <span className="submenu-label">{label}</span>
              </Link>
            );
          })}
        </div>
      </section>
    </aside>
  );
};

export default Submenu;
