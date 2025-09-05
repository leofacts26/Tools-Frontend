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
import { useLocale } from "next-intl";

const SUPPORTED_LOCALES = ["en", "fr", "hi", "de"]; // keep in sync with middleware & /messages

export default function Navbar() {
  const { openSidebar, openSubmenu, closeSubmenu } = useGlobalContext();
  const { mode, toggleTheme } = React.useContext(ThemeContext);

  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();

  const [langAnchorEl, setLangAnchorEl] = React.useState(null);
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const handleLangClick = (event) => setLangAnchorEl(event.currentTarget);
  const handleLangClose = () => setLangAnchorEl(null);

  // Let next-intl swap the locale segment & keep the rest of the path
 const handleLangChange = (lng) => {
  handleLangClose();

  // Remove the current locale prefix (e.g., "/en/about" -> "/about")
  const newPath = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, "") || "/";

  // Push with new locale
  router.push(`/${lng}${newPath}`);
};

  const displaySubmenu = (e) => {
    const page = e.target.textContent;
    const rect = e.target.getBoundingClientRect();
    openSubmenu(page, { center: (rect.left + rect.right) / 2, bottom: rect.bottom - 3 });
  };

  const handleSubmenu = (e) => {
    if (!e.target.classList.contains("link-btn")) closeSubmenu();
  };

  return (
    <nav
      className="nav"
      onMouseOver={handleSubmenu}
    >
      <div className="nav-center">
        <div className="nav-header">
          <img src={logo.src} className="nav-logo" alt="Logo" />
          <button className="btn toggle-btn" onClick={openSidebar} aria-label="Open sidebar">
            <FaBars />
          </button>
        </div>

        <ul className="nav-links">
          {["Finance", "Students", "Utilities", "Others"].map((item) => (
            <li key={item}>
              <button className="link-btn" onMouseOver={displaySubmenu}>
                {item}
              </button>
            </li>
          ))}
        </ul>

        <div>
          {mounted && (
            <IconButton sx={{ ml: 2 }}  onClick={toggleTheme} color="inherit" aria-label="Toggle theme">
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
                  <MenuItem
                    key={lng}
                    onClick={() => handleLangChange(lng)}
                    selected={currentLocale === lng}
                    dense
                  >
                    {lng.toUpperCase()}
                  </MenuItem>
                ))}
              </Menu>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
