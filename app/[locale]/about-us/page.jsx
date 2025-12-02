import { Box, Typography, Container } from "@mui/material";
import { createMetadata, SITE } from "@/lib/seo";


export async function generateMetadata({ params }) {
  const locale = (await params)?.locale || SITE.defaultLocale;

  // Load translations
  const common =
    (await import(`../../../messages/${locale}/common.json`).catch(() => ({})))
      .default || {};

  const pageContent =
    (await import(`../../../messages/${locale}/pages/about.json`).catch(
      () => ({})
    )).default || {};

  const pageSeo = pageContent.seo || {};

  // Prepare metadata input
  const opts = {
    title:
      pageSeo.title ||
      pageContent?.site?.heading ||
      common?.site?.name ||
      SITE.name,

    description: pageSeo.description || common?.site?.description || "",
    slug: pageSeo.slug || "about-us",       // 🔥 fixed!
    image: pageSeo.image || common?.site?.defaultImage || "",
    locale,
    isArticle: Boolean(pageSeo.isArticle),
    faqs: pageContent.faqs || [],
  };

  // 🔥 RETURN FINAL METADATA (DO NOT OVERRIDE ANYTHING HERE)
  return createMetadata(opts);
}

export default async function Page({ params }) {

  const resolvedParams = await params;
  const locale = resolvedParams?.locale || "en";
  const pageContent = (await import(`../../../messages/${locale}/pages/about.json`).catch(() => ({}))).default || {};


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

    </>
  );
}
