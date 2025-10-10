import { LOCALES } from "./locales";

// lib/seo.js
export const SITE = {
  name: "Ganaka Hub",
  url: "http://localhost:3000", // update this for production
  defaultLocale: "en",
  locales: LOCALES,
  titleTemplate: "%s | Ganaka Hub",
  twitterHandle: "@yourhandle",
};

export function buildTitle(title) {
  if (!title) return SITE.name;
  return SITE.titleTemplate.replace("%s", title);
}

function normalizeSlug(slug = "") {
  // remove leading/trailing slashes, return empty string for root
  return String(slug).replace(/^\/+|\/+$/g, "");
}

/**
 * Build metadata object (compatible with Next.js generateMetadata)
 * @param {object} opts
 *  opts.title, opts.description, opts.slug, opts.locale, opts.image, opts.publishDate, opts.modifiedDate, opts.faqs (array)
 */
export function createMetadata(opts = {}) {
  const title = buildTitle(opts.title || SITE.name);
  const description = opts.description || "";

  const cleanSlug = normalizeSlug(opts.slug);
  // Build the canonical path: omit locale prefix for default locale
  const canonicalPath =
    cleanSlug === ""
      ? SITE.defaultLocale === opts.locale || !opts.locale
        ? "/"
        : `/${opts.locale}/`
      : SITE.defaultLocale === opts.locale || !opts.locale
      ? `/${cleanSlug}`
      : `/${opts.locale}/${cleanSlug}`;

  // full canonical URL (no trailing slash except root)
  const url =
    canonicalPath === "/"
      ? SITE.url.replace(/\/+$/, "")
      : `${SITE.url.replace(/\/+$/, "")}${canonicalPath}`;

  const image =
    opts.image && typeof opts.image === "string"
      ? opts.image.startsWith("http")
        ? opts.image
        : `${SITE.url.replace(/\/+$/, "")}/${normalizeSlug(opts.image)}`
      : `${SITE.url.replace(/\/+$/, "")}/og-default.png`;

  // OpenGraph
  const openGraph = {
    title,
    description,
    url,
    siteName: SITE.name,
    images: [{ url: image, alt: title }],
    locale: opts.locale || SITE.defaultLocale,
    type: opts.isArticle ? "article" : "website",
  };

  // alternates / hreflang
  const alternates = {
    canonical: url,
    languages: LOCALES.reduce((acc, locale) => {
      const path =
        cleanSlug === ""
          ? locale === SITE.defaultLocale
            ? "/"
            : `/${locale}/`
          : locale === SITE.defaultLocale
          ? `/${cleanSlug}`
          : `/${locale}/${cleanSlug}`;

      acc[locale] =
        path === "/"
          ? SITE.url.replace(/\/+$/, "")
          : `${SITE.url.replace(/\/+$/, "")}${path}`;
      return acc;
    }, {}),
  };

  // Add x-default pointing to default locale canonical
  alternates.languages["x-default"] = alternates.languages[SITE.defaultLocale];

  // twitter
  const twitter = {
    card: "summary_large_image",
    title,
    description,
    images: [image],
    site: SITE.twitterHandle,
    creator: SITE.twitterHandle,
  };

  // JSON-LD: simple FAQ schema if faqs provided
  let jsonLd = null;
  if (Array.isArray(opts.faqs) && opts.faqs.length) {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: opts.faqs.map((f) => ({
        "@type": "Question",
        name: f.q || f.question || f.title,
        acceptedAnswer: {
          "@type": "Answer",
          text: f.a || f.answer || f.content || "",
        },
      })),
    };
    jsonLd = { script: JSON.stringify(faqSchema), type: "application/ld+json" };
  }

  return {
    title,
    description,
    openGraph,
    alternates,
    twitter,
    jsonLd,
    // allow consumers to add more keys if needed
  };
}
