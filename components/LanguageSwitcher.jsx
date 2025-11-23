"use client";
import React from "react";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";

const locales = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "hi", label: "हिन्दी" },
];

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();

  const handleChange = (e) => {
    const newLocale = e.target.value;
    // Remove existing locale prefix from path
    const newPath = pathname.replace(/^\/[a-z]{2}/, "") || "/";
    router.push(`/${newLocale}${newPath}`);
  };

  return (
    <Select
      value={currentLocale}
      onChange={handleChange}
      size="small"
      sx={{ minWidth: 100, mx: 1 }}
      variant="outlined"
    >
      {locales.map((loc) => (
        <MenuItem key={loc.code} value={loc.code}>
          {loc.label}
        </MenuItem>
      ))}
    </Select>
  );
}
