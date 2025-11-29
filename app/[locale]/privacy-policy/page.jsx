import { Box, Typography, Container } from "@mui/material";
import { createMetadata, SITE } from "@/lib/seo";


export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || "en";

  // load localized common defaults and the page content (sipcalc.json)
  const common = (await import(`../../../messages/${locale}/common.json`).catch(() => ({}))).default || {};
  const pageContent = (await import(`../../../messages/${locale}/pages/privacypolicy.json`).catch(() => ({}))).default || {};

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
    const other = (await import(`../../../messages/${lng}/pages/privacypolicy.json`).catch(() => ({}))).default || {};
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
  const pageContent = (await import(`../../../messages/${locale}/pages/privacypolicy.json`).catch(() => ({}))).default || {};


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
    <>

      {/* JSON-LD: Article */}
      {
        articleJsonLd && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
        )
      }



      <Box className="terms-wrapper">
        <Container maxWidth="md">
          {/* PRIVACY POLICY TITLE */}
          <Typography className="terms-title">
            {pageContent.privacyIntro.title}
          </Typography>

          <Typography className="terms-subtle">
            Last Updated: {pageContent.privacyIntro.lastUpdated}
          </Typography>

          {/* INTRO */}
          <Typography
            className="terms-text"
            dangerouslySetInnerHTML={{ __html: pageContent.privacyIntro.p1 }}
          />

          {/* SECTION 1: WHO WE ARE */}
          <Typography className="terms-heading">
            {pageContent.privacySection1.title}
          </Typography>

          <Typography className="terms-text">
            {pageContent.privacySection1.p1}
          </Typography>

          {/* SECTION 2 - INFORMATION WE COLLECT */}
          <Typography className="terms-heading">
            {pageContent.privacySection2.title}
          </Typography>

          <Typography
            className="terms-text"
            dangerouslySetInnerHTML={{ __html: pageContent.privacySection2.p1 }}
          />

          <Typography className="terms-text">
            {pageContent.privacySection2.p2}
          </Typography>

          <ul className="terms-list">
            {pageContent.privacySection2.list?.map((item, index) => (
              <li key={index} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ul>

          <Typography
            className="terms-text"
            dangerouslySetInnerHTML={{ __html: pageContent.privacySection2.p3 }}
          />

          {/* SECTION 3 - HOW WE USE INFORMATION */}
          <Typography className="terms-heading">
            {pageContent.privacySection3.title}
          </Typography>

          <Typography className="terms-text">
            {pageContent.privacySection3.p1}
          </Typography>

          <ul className="terms-list">
            {pageContent.privacySection3.list?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          {/* SECTION 4 - LEGAL BASES */}
          <Typography className="terms-heading">
            {pageContent.privacySection4.title}
          </Typography>

          <Typography
            className="terms-text"
            dangerouslySetInnerHTML={{ __html: pageContent.privacySection4.p1 }}
          />

          {/* SECTION 5 - COOKIES */}
          <Typography className="terms-heading">
            {pageContent.privacySection5.title}
          </Typography>

          <Typography className="terms-text">
            {pageContent.privacySection5.p1}
          </Typography>

          {/* SECTION 6 - ANALYTICS */}
          <Typography className="terms-heading">
            {pageContent.privacySection6.title}
          </Typography>

          <Typography className="terms-text">
            {pageContent.privacySection6.p1}
          </Typography>

          {/* SECTION 7 - DATA SHARING */}
          <Typography className="terms-heading">
            {pageContent.privacySection7.title}
          </Typography>

          <Typography className="terms-text">
            {pageContent.privacySection7.p1}
          </Typography>

          <ul className="terms-list">
            {pageContent.privacySection7.list?.map((item, index) => (
              <li key={index} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ul>


          {/* SECTION 8 - DATA RETENTION */}
          <Typography className="terms-heading">
            {pageContent.privacySection8.title}
          </Typography>

          <Typography className="terms-text">
            {pageContent.privacySection8.p1}
          </Typography>

          {/* SECTION 9 - DATA SECURITY */}
          <Typography className="terms-heading">
            {pageContent.privacySection9.title}
          </Typography>

          <Typography className="terms-text">
            {pageContent.privacySection9.p1}
          </Typography>

          {/* SECTION 10 - CHILDREN'S PRIVACY */}
          <Typography className="terms-heading">
            {pageContent.privacySection10.title}
          </Typography>

          <Typography className="terms-text">
            {pageContent.privacySection10.p1}
          </Typography>

          {/* SECTION 11 - INTERNATIONAL DATA TRANSFERS */}
          <Typography className="terms-heading">
            {pageContent.privacySection11.title}
          </Typography>

          <Typography className="terms-text">
            {pageContent.privacySection11.p1}
          </Typography>

          {/* SECTION 12 - YOUR CHOICES */}
          <Typography className="terms-heading">
            {pageContent.privacySection12.title}
          </Typography>

          <Typography className="terms-text">
            {pageContent.privacySection12.p1}
          </Typography>

          <ul className="terms-list">
            {pageContent.privacySection12.list?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>


          {/* SECTION 13 - YOUR RIGHTS */}
          <Typography className="terms-heading">
            {pageContent.privacySection13.title}
          </Typography>

          <Typography className="terms-text">
            {pageContent.privacySection13.p1}
          </Typography>

          {/* SECTION 14 - THIRD-PARTY LINKS */}
          <Typography className="terms-heading">
            {pageContent.privacySection14.title}
          </Typography>

          <Typography className="terms-text">
            {pageContent.privacySection14.p1}
          </Typography>

          {/* SECTION 15 - CHANGES */}
          <Typography className="terms-heading">
            {pageContent.privacySection15.title}
          </Typography>

          <Typography className="terms-text">
            {pageContent.privacySection15.p1}
          </Typography>

          {/* SECTION 16 - CONTACT & GRIEVANCE */}
          <Typography className="terms-heading">
            {pageContent.privacySection16.title}
          </Typography>

          <Typography className="terms-text">
            {pageContent.privacySection16.p1}
            <br />
            <strong>Email:</strong> {pageContent.privacySection16.email}
            <br />
            <strong>Website:</strong> {pageContent.privacySection16.website}
          </Typography>

          <Typography
            className="terms-text"
            dangerouslySetInnerHTML={{ __html: pageContent.privacySection16.p2 }}
          />

          {/* FINAL NOTE */}
          <Typography
            className="terms-text"
            dangerouslySetInnerHTML={{ __html: pageContent.privacyFinalNote.p1 }}
          />

        </Container>
      </Box>

    </>
  );
}
