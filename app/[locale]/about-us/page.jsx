import { Box, Typography, Container } from "@mui/material";
import { createMetadata, SITE } from "@/lib/seo";


export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || "en";

  // load localized common defaults and the page content (sipcalc.json)
  const common = (await import(`../../../messages/${locale}/common.json`).catch(() => ({}))).default || {};
  const pageContent = (await import(`../../../messages/${locale}/pages/about.json`).catch(() => ({}))).default || {};

  // use the seo block from 1-crore-before-35-real-math.json (user provided)
  const pageSeo = pageContent.seo || {};

  // build opts for createMetadata (your lib/seo.js expects similar keys)
  const opts = {
    title: pageSeo.title || pageContent.site?.heading || common.site?.name || SITE.name,
    description: pageSeo.description || common.site?.description || "",
    slug: pageSeo.slug || "",
    image: pageSeo.image || common.site?.defaultImage || "",
    locale,
    isArticle: Boolean(pageSeo.isArticle),
    publishDate: pageSeo.publishDate,
    modifiedDate: pageSeo.modifiedDate,
    faqs: pageContent.faqs || [],
  };

  // createMetadata returns { title, description, openGraph, alternates, twitter, jsonLd }
  const meta = createMetadata(opts);

  // Build alternates/hreflang entries for all locales configured in SITE
  const alternates = { canonical: meta.openGraph.url, languages: {} };
  for (const lng of SITE.locales) {
    const other = (await import(`../../../messages/${lng}/pages/about.json`).catch(() => ({}))).default || {};
    const otherSlug = other?.seo?.slug || opts.slug;
    if (otherSlug) alternates.languages[lng] = `${SITE.url}/${lng}/${otherSlug}`;
  }

  // return the Next.js metadata object
  return {
    title: meta.title,
    description: meta.description,
    alternates,
    openGraph: meta.openGraph,
    twitter: meta.twitter,
    robots: pageSeo?.noindex ? { index: false, follow: false } : undefined,
  };
}


export default async function Page({ params }) {

  const resolvedParams = await params;
  const locale = resolvedParams?.locale || "en";
  const pageContent = (await import(`../../../messages/${locale}/pages/about.json`).catch(() => ({}))).default || {};


  // Build JSON-LD for FAQ (if any)
  const faqJsonLd =
    pageContent.faqs && pageContent.faqs.length
      ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: pageContent.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
      : null;

  // Build Article JSON-LD if isArticle true
  const articleJsonLd = pageContent.seo?.isArticle
    ? {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: pageContent.seo?.title || pageContent.site?.heading,
      description: pageContent.seo?.description || "",
      author: { "@type": "Person", name: pageContent.seo?.author || "Author" },
      datePublished: pageContent.seo?.publishDate,
      dateModified: pageContent.seo?.modifiedDate,
      image: pageContent.seo?.image ? `${SITE.url}${pageContent.seo.image}` : undefined,
      mainEntityOfPage: { "@type": "WebPage", "@id:": `${SITE.url}/${locale}/${pageContent.seo?.slug || ""}` },
    }
    : null;


  return (
    <Box className="terms-wrapper">
      <Container maxWidth="md">

        <Typography className="terms-title">
          {pageContent.title}
        </Typography>

        <Typography className="terms-subtle">
          Last Updated: {pageContent.lastUpdated}
        </Typography>

        <Typography className="terms-text">
          {pageContent.intro.p1}
        </Typography>

        <Typography className="terms-text">
          {pageContent.intro.p2}
        </Typography>


        {/* OUR MISSION */}
        <Typography className="terms-heading">
          {pageContent.mission.title}
        </Typography>

        <Typography className="terms-text">
          {pageContent.mission.p1}
        </Typography>

        <ul className="terms-list">
          {pageContent.mission.list?.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>

        <Typography className="terms-text">
          {pageContent.mission.p2}
        </Typography>


        {/* STORY */}
        <Typography className="terms-heading">
          {pageContent.story.title}
        </Typography>

        <Typography className="terms-text">
          {pageContent.story.p1}
        </Typography>

        <ul className="terms-list">
          {pageContent.story.list?.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>

        <Typography className="terms-text">
          {pageContent.story.p2}
        </Typography>



        {/* WHAT WE PROVIDE */}
        <Typography className="terms-heading">
          {pageContent.provide.title}
        </Typography>

        <Typography className="terms-text">
          {pageContent.provide.p1}
        </Typography>

        <ul className="terms-list">
          {pageContent.provide.list?.map((item, index) => (
            <li
              key={index}
              dangerouslySetInnerHTML={{ __html: item }}
            />
          ))}
        </ul>

        <Typography className="terms-text">
          {pageContent.provide.p2}
        </Typography>


        {/* WHY WE BUILT */}
        <Typography className="terms-heading">
          {pageContent.whyBuilt.title}
        </Typography>

        <Typography className="terms-text">
          {pageContent.whyBuilt.p1}
        </Typography>

        <ul className="terms-list">
          {pageContent.whyBuilt.list?.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>

        <Typography className="terms-text">
          {pageContent.whyBuilt.p2}
        </Typography>


        {/* OUR VALUES */}
        <Typography className="terms-heading">
          {pageContent.values.title}
        </Typography>

        <Typography className="terms-text">
          {pageContent.values.p1}
        </Typography>

        <ul className="terms-list">
          {pageContent.values.list?.map((item, index) => (
            <li
              key={index}
              dangerouslySetInnerHTML={{ __html: item }}
            />
          ))}
        </ul>


        {/* WHO WE SERVE */}
        <Typography className="terms-heading">
          {pageContent.serve.title}
        </Typography>

        <Typography className="terms-text">
          {pageContent.serve.p1}
        </Typography>

        <ul className="terms-list">
          {pageContent.serve.list?.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>

        <Typography className="terms-text">
          {pageContent.serve.p2}
        </Typography>

        {/* COMMITMENT */}
        <Typography className="terms-heading">
          {pageContent.commitment.title}
        </Typography>

        <Typography className="terms-text">
          {pageContent.commitment.p1}
        </Typography>

        <ul className="terms-list">
          {pageContent.commitment.list?.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>


        {/* FUTURE */}
        <Typography className="terms-heading">
          {pageContent.future.title}
        </Typography>

        <Typography className="terms-text">
          {pageContent.future.p1}
        </Typography>

        <ul className="terms-list">
          {pageContent.future.list?.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>


        {/* CONTACT */}
        <Typography className="terms-heading">
          {pageContent.contact.title}
        </Typography>

        <Typography className="terms-text">
          {pageContent.contact.p1}
          <br />
          <strong>Email:</strong> {pageContent.contact.email}
          <br />
          <strong>Website:</strong> {pageContent.contact.website}
        </Typography>

        <Typography className="terms-text">
          {pageContent.contact.p2}
        </Typography>

      </Container>
    </Box>
  );
}
