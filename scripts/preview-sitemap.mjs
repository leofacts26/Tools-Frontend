import path from 'path';
import { pathToFileURL } from 'url';

const sitemapPath = pathToFileURL(path.join(process.cwd(), 'app', 'sitemap.js')).href;
(async () => {
  try {
    const m = await import(sitemapPath);
    const urls = await m.default();
    console.log('Total URLs:', urls.length);
    for (const u of urls) console.log(u.url);
  } catch (err) {
    console.error('Failed to run sitemap preview:', err);
    process.exit(1);
  }
})();
