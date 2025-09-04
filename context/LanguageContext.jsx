
"use client"
import React, { createContext, useState } from 'react';
import { useRouter } from 'next/navigation';

export const LanguageContext = createContext({
  locale: 'en',
  setLocale: () => {},
});

export const LanguageContextProvider = ({ children, defaultLocale = 'en' }) => {
  const [locale, setLocale] = useState(defaultLocale);
  const router = useRouter();

  const changeLocale = (newLocale) => {
    setLocale(newLocale);
    router.push(`/${newLocale}`);
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale: changeLocale }}>
      {children}
    </LanguageContext.Provider>
  );
};