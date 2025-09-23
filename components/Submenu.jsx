"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useGlobalContext } from "@/context/context";

const slugify = (s = "") =>
  String(s).trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const buildHref = (url, locale, categorySlug) => {
  if (!url) return `/${locale}/`;
  if (/^https?:\/\//.test(url)) return url;
  if (url.startsWith("/")) {
    if (url.startsWith(`/${locale}/`) || url === `/${locale}`) return url;
    return `/${locale}${url}`;
  }
  return `/${locale}/tools/${categorySlug}/${url}`;
};

export default function Submenu() {
  const t = useTranslations("common");
  const { isSubmenuOpen, page: pageObj = {}, location = {}, closeSubmenu } = useGlobalContext();
  const { page = "", links = [], key: categoryKey } = pageObj || {};
  const container = useRef(null);
  const [columns, setColumns] = useState("col-2");
  const locale = useLocale();

  // POSITION + layout effect (unchanged)
  useEffect(() => {
    setColumns("col-2");
    const submenu = container.current;
    if (!submenu) return;
    const { center = 0, bottom = 0 } = location || {};
    submenu.style.left = `${center}px`;
    submenu.style.top = `${bottom}px`;

    if (links.length === 3) setColumns("col-3");
    else if (links.length > 3) setColumns("col-3");
  }, [page, location, links]);

  // OUTSIDE DETECTION + ESC key handling
  useEffect(() => {
    if (!isSubmenuOpen) return; // only attach when open

    const handleOutside = (e) => {
      const target = e.target;
      // if submenu DOM not present, nothing to do
      if (!container.current) return;

      // if the event target is inside the submenu -> ignore
      if (container.current.contains(target)) return;

      // if the event target is a navbar link button (or inside one) -> ignore
      // ensure your navbar buttons have class "link-btn" (you already have that)
      if (target.closest && target.closest(".link-btn")) return;

      // otherwise the pointer is outside both submenu and link buttons -> close
      closeSubmenu();
    };

    const handleKey = (e) => {
      if (e.key === "Escape") closeSubmenu();
    };

    document.addEventListener("pointerover", handleOutside);
    document.addEventListener("pointerdown", handleOutside); // catches clicks/taps
    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("pointerover", handleOutside);
      document.removeEventListener("pointerdown", handleOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, [isSubmenuOpen, closeSubmenu]);

  const categorySlug = slugify(page);
  const heading = categoryKey ? t(`navbar.${categoryKey}.page`) : page || "";

  return (
    <aside className={`${isSubmenuOpen ? "submenu show" : "submenu"}`} ref={container}>
      <section>
        <h4>{heading}</h4>

     
        <div className={`submenu-center ${columns}`}>
          {links.length === 0 && <p className="muted">No links</p>}

          {links.map((link, i) => {
            const { url = "", icon = null, label = "", labelKey = "" } = link;
            let translatedLabel = label;
            try {
              if (categoryKey && labelKey) {
                translatedLabel = t(`navbar.${categoryKey}.links.${labelKey}.label`);
              }
            } catch (e) {
              translatedLabel = label;
            }

            const href = buildHref(url, locale, categorySlug);

            if (/^https?:\/\//.test(href)) {
              return (
                <a key={i} href={href} target="_blank" rel="noopener noreferrer">
                  {icon}
                  <span>{translatedLabel}</span>
                </a>
              );
            }

            return (
              <Link key={i} href={href} onClick={() => closeSubmenu()}>
                {icon}
                <span>{translatedLabel}</span>
              </Link>
            );
          })}
        </div>
      </section>
    </aside>
  );
}
