"use client";
import React, { useState, useRef, useEffect } from "react";
import { useGlobalContext } from "@/context/context";
import { useParams, usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import Link from "next/link";


const titleToSlug = (title) =>
  String(title || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");


const Submenu = () => {
  const { isSubmenuOpen, page, location, closeSubmenu } = useGlobalContext();
  const pathname = usePathname();
  const params = useParams();
  const localeFromHook = useLocale();

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

  const current = page ?? { page: "", links: [] };
  const title = current.page ?? "";
  const links = Array.isArray(current.links) ? current.links : [];

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

    if (links.length === 3) setColumns("col-3");
    if (links.length > 3) setColumns("col-4");
  }, [location, links]);

  // Close on outside click (kept)
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

  // ✅ Close on "outside hover" (pointer leaving both submenu and triggers)
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

    // pointermove is smoother and works for mouse/touch/pen
    document.addEventListener("pointermove", onMove, { passive: true });
    return () => document.removeEventListener("pointermove", onMove);
  }, [isSubmenuOpen, closeSubmenu]);

  // Close on Esc (kept)
  useEffect(() => {
    if (!isSubmenuOpen) return;
    const onKey = (e) => e.key === "Escape" && closeSubmenu();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isSubmenuOpen, closeSubmenu]);

  // Close on route change (kept)
  useEffect(() => {
    if (isSubmenuOpen) closeSubmenu();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // ✅ build href
   const buildHref = (url) => {
    if (!url) return `/${locale}/tools/${category}`;
    if (url.startsWith("/")) return url;
    return `/${locale}/tools/${category}/${url}`;
  };


  return (
    <aside
      className={`${isSubmenuOpen ? "submenu show" : "submenu"}`}
      ref={container}
      role="menu"
      aria-hidden={!isSubmenuOpen}
      // Optional: also close when mouse leaves the submenu box itself
      onMouseLeave={() => closeSubmenu()}
    >
      <section>
        <h4>{title}</h4>
        <div className={`submenu-center ${columns}`}>
          {links.map((link, i) => {
            const { url, icon, label } = link;
            const href = buildHref(url);
            return (
              <Link key={i} href={href} role="menuitem" tabIndex={isSubmenuOpen ? 0 : -1}>
                {icon}
                {label}
              </Link>
            );
          })}
        </div>
      </section>
    </aside>
  );
};

export default Submenu;
