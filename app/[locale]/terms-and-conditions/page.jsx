import { Box, Typography, Container } from "@mui/material";
import { createMetadata, SITE } from "@/lib/seo";


export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || "en";

  // load localized common defaults and the page content (sipcalc.json)
  const common = (await import(`../../../messages/${locale}/common.json`).catch(() => ({}))).default || {};
  const pageContent = (await import(`../../../messages/${locale}/pages/terms.json`).catch(() => ({}))).default || {};

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
  const pageContent = (await import(`../../../messages/${locale}/pages/terms.json`).catch(() => ({}))).default || {};


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
          <Typography className="terms-title">
            {pageContent.termsIntro.title}
          </Typography>

          <Typography className="terms-subtle">
            Last Updated: {pageContent.termsIntro.lastUpdated}
          </Typography>

          {/* INTRO */}
          <Typography
            className="terms-text"
            dangerouslySetInnerHTML={{ __html: pageContent.termsIntro.p1 }}
          />

          <ul className="terms-list">
            {pageContent.termsIntro.list?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <Typography className="terms-text">
            {pageContent.termsIntro.p2}
          </Typography>


          {/* SECTION 1 */}
          <Typography className="terms-heading">
            {pageContent.section1.title}
          </Typography>

          <Typography className="terms-text">
            {pageContent.section1.p1}
          </Typography>

          {/* SECTION 2 */}
          <Typography className="terms-heading">
            {pageContent.section2.title}
          </Typography>

          <Typography className="terms-text">
            {pageContent.section2.p1}
          </Typography>

          <Typography
            className="terms-text"
            dangerouslySetInnerHTML={{ __html: pageContent.section2.p2 }}
          />


          {/* SECTION 3 */}
          <Typography className="terms-heading">
            {pageContent.section3.title}
          </Typography>

          <Typography
            className="terms-text"
            dangerouslySetInnerHTML={{ __html: pageContent.section3.p1 }}
          />

          <Typography className="terms-text">
            {pageContent.section3.p2}
          </Typography>

          {/* SECTION 4 */}
          <Typography className="terms-heading">
            {pageContent.section4.title}
          </Typography>

          <Typography className="terms-text">
            {pageContent.section4.p1}
          </Typography>

          <ul className="terms-list">
            {pageContent.section4.list?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <Typography className="terms-text">
            {pageContent.section4.p2}
          </Typography>


          {/* SECTION 5 */}
          <Typography className="terms-heading">
            {pageContent.section5.title}
          </Typography>

          <Typography className="terms-text">
            {pageContent.section5.p1}
          </Typography>

          <ul className="terms-list">
            {pageContent.section5.list?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          {/* SECTION 6 */}
          <Typography className="terms-heading">
            {pageContent.section6.title}
          </Typography>

          <Typography className="terms-text">
            {pageContent.section6.p1}
          </Typography>

          {/* SECTION 7 */}
          <Typography className="terms-heading">
            {pageContent.section7.title}
          </Typography>

          <Typography className="terms-text">
            {pageContent.section7.p1}
          </Typography>

          {/* SECTION 8 */}
          <Typography className="terms-heading">
            {pageContent.section8.title}
          </Typography>

          <Typography className="terms-text">
            {pageContent.section8.p1}
          </Typography>

          <ul className="terms-list">
            {pageContent.section8.list?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          {/* SECTION 9 */}
          <Typography className="terms-heading">
            {pageContent.section9.title}
          </Typography>

          <Typography className="terms-text">
            {pageContent.section9.p1}
          </Typography>

          <Typography className="terms-text">
            {pageContent.section9.p2}
          </Typography>

          <ul className="terms-list">
            {pageContent.section9.list?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>


          {/* SECTION 10 */}
          <Typography className="terms-heading">
            {pageContent.section10.title}
          </Typography>

          <Typography className="terms-text">
            {pageContent.section10.p1}
          </Typography>

          <Typography
            className="terms-text"
            dangerouslySetInnerHTML={{ __html: pageContent.section10.p2 }}
          />

          {/* SECTION 11 */}
          <Typography className="terms-heading">
            {pageContent.section11.title}
          </Typography>

          <Typography className="terms-text">
            {pageContent.section11.p1}
          </Typography>

          {/* SECTION 12 */}
          <Typography className="terms-heading">
            {pageContent.section12.title}
          </Typography>

          <Typography
            className="terms-text"
            dangerouslySetInnerHTML={{ __html: pageContent.section12.p1 }}
          />

          {/* SECTION 13 */}
          <Typography className="terms-heading">
            {pageContent.section13.title}
          </Typography>

          <Typography className="terms-text">
            {pageContent.section13.p1}
          </Typography>


          {/* SECTION 14 */}
          <Typography className="terms-heading">
            {pageContent.section14.title}
          </Typography>

          <Typography className="terms-text">
            {pageContent.section14.p1}
          </Typography>

          {/* SECTION 15 */}
          <Typography className="terms-heading">
            {pageContent.section15.title}
          </Typography>

          <Typography className="terms-text">
            {pageContent.section15.p1}
          </Typography>

          {/* SECTION 16 */}
          <Typography className="terms-heading">
            {pageContent.section16.title}
          </Typography>

          <Typography className="terms-text">
            {pageContent.section16.p1}
          </Typography>

          {/* SECTION 17 */}
          <Typography className="terms-heading">
            {pageContent.section17.title}
          </Typography>

          <Typography className="terms-text">
            {pageContent.section17.p1}
          </Typography>

          {/* SECTION 18 */}
          <Typography className="terms-heading">
            {pageContent.section18.title}
          </Typography>

          <Typography className="terms-text">
            {pageContent.section18.p1}
            <br />
            <strong>Email:</strong> {pageContent.section18.email}
            <br />
            <strong>Website:</strong> {pageContent.section18.website}
          </Typography>

        </Container>
      </Box>

    </>
  );
}
