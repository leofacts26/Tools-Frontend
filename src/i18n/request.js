import {getRequestConfig} from 'next-intl/server';
import {headers} from 'next/headers';

export default getRequestConfig(async ({locale}) => {
  // Try param first, then header from middleware, then default
  const h = await headers();
  const headerLocale = h.get('x-next-intl-locale');
  const active = locale || headerLocale || 'en';

  // Load messages with fallback to English if file missing
  let messages;
  try {
    messages = (await import(`../../messages/${active}.json`)).default;
  } catch {
    messages = (await import(`../../messages/en.json`)).default;
  }

  return {locale: active, messages};
});
