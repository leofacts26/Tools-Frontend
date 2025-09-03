import React from 'react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/navigation';

const locales = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'hi', label: 'हिन्दी' },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const router = useRouter();
  const currentLang = i18n.language || 'en';

  const handleChange = (e) => {
    const newLocale = e.target.value;
    i18n.changeLanguage(newLocale);
    router.push(`/${newLocale}`);
  };

  return (
    <Select
      value={currentLang}
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