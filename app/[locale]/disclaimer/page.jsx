import { Box, Typography, Container } from "@mui/material";
import { createMetadata, SITE } from "@/lib/seo";



export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || SITE.defaultLocale;

  // Load localized JSON content
  const common =
    (await import(`../../../messages/${locale}/common.json`).catch(() => ({})))
      .default || {};

  const pageContent =
    (await import(
      `../../../messages/${locale}/pages/disclaimer.json`
    ).catch(() => ({}))).default || {};

  const pageSeo = pageContent.seo || {};

  const opts = {
    title:
      pageSeo.title ||
      pageContent.site?.heading ||
      common.site?.name ||
      SITE.name,

    description: pageSeo.description || common.site?.description || "",

    slug: pageSeo.slug || "disclaimer", // fallback slug

    image: pageSeo.image || common.site?.defaultImage || "",

    locale,

    isArticle: Boolean(pageSeo.isArticle),

    faqs: pageContent.faqs || [],
  };

  return createMetadata(opts);
}




export default async function Page({ params }) {

  const resolvedParams = await params;
  const locale = resolvedParams?.locale || "en";
  const pageContent = (await import(`../../../messages/${locale}/pages/disclaimer.json`).catch(() => ({}))).default || {};



  return (
    <>

   

      
      <Box className="terms-wrapper">
        <Container maxWidth="md">
          {/* TITLE */}
          <Typography className="terms-title">
            {pageContent.disclaimerIntro.title}
          </Typography>

          <Typography className="terms-subtle">
            Last Updated: {pageContent.disclaimerIntro.lastUpdated}
          </Typography>

          {/* INTRO */}
          <Typography
            className="terms-text"
            dangerouslySetInnerHTML={{ __html: pageContent.disclaimerIntro.p1 }}
          />

          {/* SECTION 1 */}
          <Typography className="terms-heading">
            {pageContent.disclaimerSection1.title}
          </Typography>

          <Typography
            className="terms-text"
            dangerouslySetInnerHTML={{ __html: pageContent.disclaimerSection1.p1 }}
          />

          <ul className="terms-list">
            {pageContent.disclaimerSection1.list?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <Typography
            className="terms-text"
            dangerouslySetInnerHTML={{ __html: pageContent.disclaimerSection1.p2 }}
          />


          {/* SECTION 2 - ACCURACY */}
          <Typography className="terms-heading">
            {pageContent.disclaimerSection2.title}
          </Typography>

          <Typography
            className="terms-text"
            dangerouslySetInnerHTML={{ __html: pageContent.disclaimerSection2.p1 }}
          />

          <ul className="terms-list">
            {pageContent.disclaimerSection2.list?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <Typography className="terms-text">
            {pageContent.disclaimerSection2.p2}
          </Typography>

          {/* SECTION 3 - USE AT YOUR OWN RISK */}
          <Typography className="terms-heading">
            {pageContent.disclaimerSection3.title}
          </Typography>

          <Typography
            className="terms-text"
            dangerouslySetInnerHTML={{ __html: pageContent.disclaimerSection3.p1 }}
          />

          <Typography className="terms-text">
            {pageContent.disclaimerSection3.p2}
          </Typography>

          <ul className="terms-list">
            {pageContent.disclaimerSection3.list?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>


          {/* SECTION 4 - THIRD PARTY */}
          <Typography className="terms-heading">
            {pageContent.disclaimerSection4.title}
          </Typography>

          <Typography
            className="terms-text"
            dangerouslySetInnerHTML={{ __html: pageContent.disclaimerSection4.p1 }}
          />

          <ul className="terms-list">
            {pageContent.disclaimerSection4.list?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <Typography className="terms-text">
            {pageContent.disclaimerSection4.p2}
          </Typography>

          {/* SECTION 5 - NO WARRANTIES */}
          <Typography className="terms-heading">
            {pageContent.disclaimerSection5.title}
          </Typography>

          <Typography
            className="terms-text"
            dangerouslySetInnerHTML={{ __html: pageContent.disclaimerSection5.p1 }}
          />

          <ul className="terms-list">
            {pageContent.disclaimerSection5.list?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <Typography className="terms-text">
            {pageContent.disclaimerSection5.p2}
          </Typography>


          {/* SECTION 6 - TECHNICAL ISSUES */}
          <Typography className="terms-heading">
            {pageContent.disclaimerSection6.title}
          </Typography>

          <Typography className="terms-text">
            {pageContent.disclaimerSection6.p1}
          </Typography>

          <ul className="terms-list">
            {pageContent.disclaimerSection6.list?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <Typography className="terms-text">
            {pageContent.disclaimerSection6.p2}
          </Typography>

          {/* SECTION 7 - NO GUARANTEE */}
          <Typography className="terms-heading">
            {pageContent.disclaimerSection7.title}
          </Typography>

          <Typography
            className="terms-text"
            dangerouslySetInnerHTML={{ __html: pageContent.disclaimerSection7.p1 }}
          />

          {/* SECTION 8 - LIMITATION OF LIABILITY */}
          <Typography className="terms-heading">
            {pageContent.disclaimerSection8.title}
          </Typography>

          <Typography className="terms-text">
            {pageContent.disclaimerSection8.p1}
          </Typography>

          <ul className="terms-list">
            {pageContent.disclaimerSection8.list?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <Typography className="terms-text">
            {pageContent.disclaimerSection8.p2}
          </Typography>


          {/* SECTION 9 - UPDATES */}
          <Typography className="terms-heading">
            {pageContent.disclaimerSection9.title}
          </Typography>

          <Typography className="terms-text">
            {pageContent.disclaimerSection9.p1}
          </Typography>

          {/* SECTION 10 - CONTACT */}
          <Typography className="terms-heading">
            {pageContent.disclaimerSection10.title}
          </Typography>

          <Typography className="terms-text">
            {pageContent.disclaimerSection10.p1}
            <br />
            <strong>Email:</strong> {pageContent.disclaimerSection10.email}
            <br />
            <strong>Website:</strong> {pageContent.disclaimerSection10.website}
          </Typography>

          <Typography className="terms-text">
            {pageContent.disclaimerSection10.p2}
          </Typography>

        </Container>
      </Box>

    </>
  );
}
