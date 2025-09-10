// lib/seo.js
export const SITE = {
  name: "MySite",
  url: "http://localhost:3000", // update this
  defaultLocale: "en",
  locales: ["en", "hi", "fr", "de"],
  titleTemplate: "%s | MySite",
  twitterHandle: "@yourhandle",
};

export function buildTitle(title) {
  if (!title) return SITE.name;
  return SITE.titleTemplate.replace("%s", title);
}

/**
 * Build metadata object (compatible with Next.js generateMetadata)
 * @param {object} opts
 *  opts.title, opts.description, opts.slug, opts.locale, opts.image, opts.publishDate, opts.modifiedDate, opts.faqs (array)
 */
export function createMetadata(opts = {}) {
  const title = buildTitle(opts.title || SITE.name);
  const description = opts.description || "";
  const url = opts.slug ? `${SITE.url}/${opts.locale ? opts.locale + "/" : ""}${opts.slug}` : SITE.url;
  const image = opts.image ? (opts.image.startsWith("http") ? opts.image : `${SITE.url}${opts.image}`) : `${SITE.url}/og-default.png`;

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
    languages: {}, // fill by caller
  };

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
      "mainEntity": opts.faqs.map((f) => ({
        "@type": "Question",
        "name": f.q || f.question || f.title,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": f.a || f.answer || f.content || "",
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
