"use client";

import React from "react";
import logo from "../images/logo.svg";
import { FaBars } from "react-icons/fa";
import { useGlobalContext } from "@/context/context";
import IconButton from "@mui/material/IconButton";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { ThemeContext } from "../context/ThemeContext";
import LanguageIcon from "@mui/icons-material/Language";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useRouter, usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { LOCALES, DEFAULT_LOCALE } from "@/lib/locales";
import { navSections } from "@/lib/utils";
import { Typography } from "@mui/material";
import Link from "next/link";

const SUPPORTED_LOCALES = LOCALES; // keep in sync with middleware & /messages

export default function Navbar() {
  const { openSidebar, openSubmenu, closeSubmenu } = useGlobalContext();
  const { mode, toggleTheme } = React.useContext(ThemeContext);

  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();
  const t = useTranslations("common");

  const [langAnchorEl, setLangAnchorEl] = React.useState(null);
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const handleLangClick = (event) => setLangAnchorEl(event.currentTarget);
  const handleLangClose = () => setLangAnchorEl(null);

  const handleLangButtonClick = (event) => handleLangClick(event);

  // Let next-intl swap the locale segment & keep the rest of the path
  React.useEffect(() => {
    if (mounted) {
      // mount side-effect only
    }
  }, [mounted]);

  const handleLangChange = async (lng) => {
    handleLangClose();

    // Remove the current locale prefix (e.g., "/en/about" -> "/about")
    const newPath = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, "") || "/";

    // debug info removed

    // If switching to the default locale, don't include the locale prefix in the URL.
    // Otherwise include the locale segment (e.g., "/hi/about").
    // Set middleware cookie so server routing respects user's choice
    try {
      try {
        // eslint-disable-next-line no-undef
        document.cookie = `NEXT_LOCALE=${lng}; Path=/; Max-Age=${60 * 60 * 24 * 365}`;
      } catch (e) {
        // ignore if cookies are not available (e.g., SSR)
      }
      if (lng === DEFAULT_LOCALE) {
        await router.push(newPath);
      } else {
        const target = `/${lng}${newPath}`;
        await router.push(target);
      }
    } catch (err) {
      // swallow navigation errors silently
    }
  };

  const displaySubmenu = (e) => {
    // read stable key from the button (use currentTarget)
    const key = e.currentTarget?.dataset?.key;
    const rect = e.currentTarget.getBoundingClientRect();
    openSubmenu(key, { center: (rect.left + rect.right) / 2, bottom: rect.bottom - 3 });
  };

  const handleSubmenu = (e) => {
    if (!e.target.classList.contains("link-btn")) closeSubmenu();
  };


  return (
    <nav className="nav" onMouseOver={handleSubmenu}>
      <div className="nav-center">
        <div className="nav-header">
          {/* <img src={logo.src} className="nav-logo" alt="Logo" /> */}
          <Link href="/" className="nav-logo" aria-label="Ganaka Hub Home">
            Ganaka <span style={{ color: "#ec407a" }}>Hub</span>
          </Link>

          {mounted ? (
            <button
              className="btn toggle-btn"
              onClick={openSidebar}
              aria-label="Open sidebar"
              type="button"
            >
              <FaBars />
            </button>
          ) : (
            // static placeholder that matches server output (keeps markup simple)
            <span aria-hidden="true" style={{ width: 40, display: "inline-block" }} />
          )}
        </div>

        <ul className="nav-links">
          {mounted
            ? navSections.map((key) => (
              <li key={key}>
                <button
                  className="link-btn"
                  data-key={key}
                  onMouseEnter={displaySubmenu}
                  type="button"
                >
                  {t(`navbar.${key}.page`)}
                </button>
              </li>
            ))
            : navSections.map((key) => <li key={key}><span>{key}</span></li>)}
        </ul>

        <div className="desktop-icon">
          {mounted && (
            <div className="desktop-icon-flex">
              <IconButton sx={{ ml: 2 }} onClick={toggleTheme} color="inherit" aria-label="Toggle theme">
                {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>

              <IconButton
                sx={{ ml: 1 }}
                onClick={handleLangButtonClick}
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
                  <MenuItem
                    key={lng}
                    onClick={() => {
                      // ensure we log the click even if navigation doesn't happen
                      // eslint-disable-next-line no-console
                      console.log("Language menu item clicked", { lng, currentLocale, pathname });
                      handleLangChange(lng);
                    }}
                    data-lng={lng}
                    selected={currentLocale === lng}
                    dense
                  >
                    {lng.toUpperCase()}
                  </MenuItem>
                ))}
              </Menu>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
