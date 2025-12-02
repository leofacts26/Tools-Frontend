// lib/seo.js
import { LOCALES, DEFAULT_LOCALE } from "./locales";

export const SITE = {
  name: "Ganaka Hub",
  url: "https://www.ganakahub.com",
  defaultLocale: DEFAULT_LOCALE,
  locales: LOCALES,
  titleTemplate: "%s | Ganaka Hub",
  twitterHandle: "@yourhandle",
};

function normalizeSlug(slug = "") {
  return String(slug).replace(/^\/+|\/+$/g, "");
}

export function buildTitle(title) {
  return title ? SITE.titleTemplate.replace("%s", title) : SITE.name;
}

export function createMetadata(opts = {}) {
  const locale = opts.locale || SITE.defaultLocale;
  const cleanSlug = normalizeSlug(opts.slug);
  const title = buildTitle(opts.title || SITE.name);
  const description = opts.description || "";

  // CANONICAL
  let canonicalPath =
    cleanSlug === ""
      ? "/" // homepage always root
      : locale === SITE.defaultLocale
      ? `/${cleanSlug}`
      : `/${locale}/${cleanSlug}`;

  const canonicalURL =
    canonicalPath === "/"
      ? SITE.url
      : `${SITE.url}${canonicalPath}`.replace(/([^:]\/)\/+/g, "$1");

  // ALTERNATES
  const alternates = { canonical: canonicalURL, languages: {} };

  for (const lang of LOCALES) {
    const href =
      cleanSlug === ""
        ? lang === SITE.defaultLocale
          ? SITE.url
          : `${SITE.url}/${lang}`
        : lang === SITE.defaultLocale
        ? `${SITE.url}/${cleanSlug}`
        : `${SITE.url}/${lang}/${cleanSlug}`;

    alternates.languages[lang] = href.replace(/([^:]\/)\/+/g, "$1");
  }

  alternates.languages["x-default"] = alternates.languages[SITE.defaultLocale];

  const image =
    opts.image && opts.image.startsWith("http")
      ? opts.image
      : `${SITE.url}/og-default.png`;

  // OG DATA
  const openGraph = {
    title,
    description,
    url: canonicalURL,
    siteName: SITE.name,
    images: [{ url: image, alt: title }],
    locale,
    type: opts.isArticle ? "article" : "website",
  };

  return {
    title,
    description,
    alternates,
    openGraph,
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      site: SITE.twitterHandle,
      creator: SITE.twitterHandle,
    },
  };
}
