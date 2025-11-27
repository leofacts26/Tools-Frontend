"use client";

import React from "react";
import Link from "next/link";
import { FaTimes } from "react-icons/fa";
import { useGlobalContext } from "@/context/context";
import sublinks from "@/lib/data";
import { useLocale, useTranslations } from "next-intl";
import { Stack } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { ThemeContext } from "../context/ThemeContext";
import LanguageIcon from "@mui/icons-material/Language";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { usePathname, useRouter } from "next/navigation";
import { LOCALES } from "@/lib/locales";

const SUPPORTED_LOCALES = LOCALES;

/**
 * Build href for a sidebar item.
 * - External http(s) => returned as-is
 * - Absolute internal path starting with "/" => prefix locale ("/products" -> "/en/products")
 * - Otherwise treat as a tools slug and build: /<locale>/tools/<categoryKey>/<url>
 *   (fallback to /<locale>/<url> if categoryKey missing)
 */
const buildHref = (url, locale, categoryKey) => {
  if (!url) return `/${locale}/`;
  if (/^https?:\/\//.test(url)) return url; // external
  if (url.startsWith("/")) {
    // if already locale-prefixed, return as-is
    if (url.startsWith(`/${locale}/`) || url === `/${locale}`) return url;
    return `/${locale}${url}`;
  }
  // treat as tools slug: /<locale>/tools/<categoryKey>/<url>
  if (categoryKey) return `/${locale}/tools/${categoryKey}/${url}`;
  // fallback if no categoryKey present
  return `/${locale}/${url}`;
};

export default function Sidebar() {
  const { isSidebarOpen, closeSidebar } = useGlobalContext();

  const [langAnchorEl, setLangAnchorEl] = React.useState(null);
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  const { mode, toggleTheme } = React.useContext(ThemeContext);

  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("common");
  const currentLocale = useLocale();

  const handleLangClick = (event) => setLangAnchorEl(event.currentTarget);
  const handleLangClose = () => setLangAnchorEl(null);

  // Let next-intl swap the locale segment & keep the rest of the path
  const handleLangChange = (lng) => {
    handleLangClose();
    const newPath = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, "") || "/";
    try {
      // set cookie to persist locale preference for middleware
      try {
        // eslint-disable-next-line no-undef
        document.cookie = `NEXT_LOCALE=${lng}; Path=/; Max-Age=${60 * 60 * 24 * 365}`;
      } catch (e) {
        // ignore in non-browser envs
      }
    } catch (e) {
      // noop
    }
    router.push(`/${lng}${newPath}`);
  };

  return (
    <div className={`${isSidebarOpen ? "sidebar-wrapper show" : "sidebar-wrapper"}`}>
      <aside className="sidebar">
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: "100%", marginBottom: '20px' }}>
          <div>
            <div className="flex-icon-mobile">
              {mounted && (
                <IconButton sx={{ ml: 2 }} onClick={toggleTheme} color="inherit" aria-label="Toggle theme">
                  {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
              )}

              {mounted && (
                <>
                  <IconButton
                    sx={{ ml: 1 }}
                    onClick={handleLangClick}
                    color="inherit"
                    aria-controls={Boolean(langAnchorEl) ? "lang-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={Boolean(langAnchorEl) ? "true" : undefined}
                    aria-label="Change language"
                  >
                    <LanguageIcon />
                  </IconButton>
                  <Menu
                    id="lang-menu"
                    anchorEl={langAnchorEl}
                    open={Boolean(langAnchorEl)}
                    onClose={handleLangClose}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                  >
                    {SUPPORTED_LOCALES.map((lng) => (
                      <MenuItem key={lng} onClick={() => handleLangChange(lng)} selected={currentLocale === lng} dense>
                        {lng.toUpperCase()}
                      </MenuItem>
                    ))}
                  </Menu>
                </>
              )}
            </div>
          </div>

          <button className="close-btn" onClick={closeSidebar} aria-label="Close sidebar">
            <FaTimes />
          </button>
        </Stack>

        <div className="sidebar-links">
          {sublinks.map((item, idx) => {
            const { links = [], page = "", key: categoryKey } = item;
            return (
              <article key={idx}>
                <h4>{categoryKey ? t(`navbar.${categoryKey}.page`) : page}</h4>

                <div className="sidebar-sublinks">
                  {links.map((link, i) => {
                    const { url = "", icon = null, label = "", labelKey = "" } = link;

                    // translate label if available
                    let translatedLabel = label;
                    try {
                      if (categoryKey && labelKey) {
                        translatedLabel = t(`navbar.${categoryKey}.links.${labelKey}.label`);
                      }
                    } catch (e) {
                      translatedLabel = label;
                    }

                    const href = buildHref(url, locale, categoryKey);

                    // external -> open new tab
                    if (/^https?:\/\//.test(href)) {
                      return (
                        <a key={i} href={href} target="_blank" rel="noopener noreferrer">
                          {icon}
                          <span>{translatedLabel}</span>
                        </a>
                      );
                    }

                    // internal -> Next Link, close sidebar on click
                    return (
                      <Link key={i} href={href} onClick={() => closeSidebar()}>
                        {icon}
                        <span>{translatedLabel}</span>
                      </Link>
                    );
                  })}
                </div>
              </article>
            );
          })}
        </div>
      </aside>
    </div>
  );
}
