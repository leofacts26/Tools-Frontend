// middleware.js
import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'fr', 'hi', 'de'],
  defaultLocale: 'en'
});

export const config = {
  matcher: ['/', '/((?!_next|.*\\..*|api).*)']
};
