// import {getRequestConfig} from 'next-intl/server';
// import {headers} from 'next/headers';

// export default getRequestConfig(async ({locale}) => {
//   // Try param first, then header from middleware, then default
//   const h = await headers();
//   const headerLocale = h.get('x-next-intl-locale');
//   const active = locale || headerLocale || 'en';

//   // Load messages with fallback to English if file missing
//   let messages;
//   try {
//     messages = (await import(`../../messages/${active}.json`)).default;
//   } catch {
//     messages = (await import(`../../messages/en.json`)).default;
//   }

//   return {locale: active, messages};
// });


import { DEFAULT_LOCALE } from "@/lib/locales";
import { headers } from "next/headers";
import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ locale }) => {
  const h = await headers();
  const headerLocale = h.get("x-next-intl-locale");
  const active = locale || headerLocale || DEFAULT_LOCALE;

  async function loadMessages(loc) {
    try {
      const common = (await import(`../../messages/${loc}/common.json`)).default;
      const sipcalc = (await import(`../../messages/${loc}/sipcalc.json`)).default;

      // Merge namespaces into one object
      return {
        common,
        sipcalc,
      };
    } catch (err) {
      if (loc !== DEFAULT_LOCALE) {
        // fallback to default locale
        return loadMessages(DEFAULT_LOCALE);
      }
      throw err; // if even default fails, surface error
    }
  }

  const messages = await loadMessages(active);

  return { locale: active, messages };
});
