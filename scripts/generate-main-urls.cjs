const fs = require('fs');
const path = require('path');
const data = require(path.join(process.cwd(), 'lib', 'data.js'));
const LOCALES = require(path.join(process.cwd(), 'lib', 'locales.js')).LOCALES;

const SITE_URL = 'https://www.ganakahub.com';

function collectRoutesFromApp() {
  const appPath = path.join(process.cwd(), 'app', '[locale]');
  const routes = new Set();

  function walk(dir, prefix = '') {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    for (const it of items) {
      const full = path.join(dir, it.name);
      if (it.isDirectory()) {
        const pageFile = path.join(full, 'page.jsx');
        const pageFileJs = path.join(full, 'page.js');
        const pageFileTsx = path.join(full, 'page.tsx');
        if (fs.existsSync(pageFile) || fs.existsSync(pageFileJs) || fs.existsSync(pageFileTsx)) {
          const route = [prefix, it.name === '[locale]' ? '' : it.name].filter(Boolean).join('/');
          if (route && route !== '[locale]') routes.add(route.replace(/^\/+/, ''));
        }
        const nextPrefix = [prefix, it.name === '[locale]' ? '' : it.name].filter(Boolean).join('/');
        walk(full, nextPrefix === '[locale]' ? '' : nextPrefix);
      }
    }
  }

  if (!fs.existsSync(appPath)) return [];
  walk(appPath, '');
  return Array.from(routes).map(r => r.replace(/\\/g, '/')).filter(Boolean);
}

function buildMainUrls() {
  const STATIC_PAGES = [ '', 'about-us', 'contact-us', 'privacy-policy', 'terms-and-conditions', 'disclaimer', 'finance', 'tools' ];
  const appRoutes = collectRoutesFromApp();
  const pagesSet = new Set(STATIC_PAGES.map(p => p === '' ? '' : p));
  for (const r of appRoutes) pagesSet.add(r.replace(/^\/+/, ''));

  try {
    const sublinks = data.default || [];
    for (const group of sublinks) {
      const groupKey = group.key;
      for (const link of group.links || []) {
        const raw = (link.url || '').trim();
        if (!raw || raw === '/') continue;
        if (raw.startsWith('/')) { pagesSet.add(raw.replace(/^\/+/, '')); continue; }
        let prefix = '';
        if (groupKey === 'finance') prefix = 'tools/finance';
        else if (groupKey === 'students') prefix = 'tools/students';
        else if (groupKey) prefix = `tools/${groupKey}`;
        const route = prefix ? `${prefix}/${raw}` : raw;
        pagesSet.add(route.replace(/^\/+/, ''));
      }
    }
  } catch (err) {
    console.warn('Could not process lib/data.js:', err.message || err);
  }

  const pages = Array.from(pagesSet).filter(Boolean);
  return pages.map(p => `${SITE_URL}/${p}`);
}

const urls = buildMainUrls();
console.log('Total main URLs:', urls.length);
for (const u of urls) console.log(u);
