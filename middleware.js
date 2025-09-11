// middleware.js
import createMiddleware from 'next-intl/middleware';
import { DEFAULT_LOCALE, LOCALES } from './lib/locales';

export default createMiddleware({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE
});

export const config = {
  matcher: ['/', '/((?!_next|.*\\..*|api).*)']
};
