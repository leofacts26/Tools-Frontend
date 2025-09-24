import Heading from "@/components/common/Heading";
import PopularCalculators from "@/components/PopularCalculators";
import { Box, Container, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import SWPCalculator from "@/components/calculators/SWPCalculator";
import { createMetadata, SITE } from "@/lib/seo";
import FAQAccordion from "@/components/common/FAQAccordion";
import MFReturnCalculator from "@/components/calculators/MFReturnCalculator";
import FDCalculator from "@/components/calculators/FDCalculator";
import RDCalculator from "@/components/calculators/RDCalculator";
import NSCCalculator from "@/components/calculators/NSCCalculator";





export async function generateMetadata({ params }) {
  const locale = params?.locale || "en";

  // load localized common defaults and the page content (sipcalc.json)
  const common = (await import(`../../../../../messages/${locale}/common.json`).catch(() => ({}))).default || {};
  const swpcalc = (await import(`../../../../../messages/${locale}/swpcalc.json`).catch(() => ({}))).default || {};

  // use the seo block from swpcalc.json (user provided)
  const pageSeo = swpcalc.seo || {};

  // build opts for createMetadata (your lib/seo.js expects similar keys)
  const opts = {
    title: pageSeo.title || swpcalc.site?.heading || common.site?.name || SITE.name,
    description: pageSeo.description || common.site?.description || "",
    slug: pageSeo.slug || "",
    image: pageSeo.image || common.site?.defaultImage || "",
    locale,
    isArticle: Boolean(pageSeo.isArticle),
    publishDate: pageSeo.publishDate,
    modifiedDate: pageSeo.modifiedDate,
    faqs: swpcalc.faqs || [],
  };

  // createMetadata returns { title, description, openGraph, alternates, twitter, jsonLd }
  const meta = createMetadata(opts);

  // Build alternates/hreflang entries for all locales configured in SITE
  const alternates = { canonical: meta.openGraph.url, languages: {} };
  for (const lng of SITE.locales) {
    const other = (await import(`../../../../../messages/${lng}/swpcalc.json`).catch(() => ({}))).default || {};
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

  const { locale } = params;
  const swp = (await import(`../../../../../messages/${locale}/swpcalc.json`)).default;

  console.log(swp, "swp?.faqs");


  // Build JSON-LD for FAQ (if any)
  const faqJsonLd =
    swp.faqs && swp.faqs.length
      ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: swp.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
      : null;

  // Build Article JSON-LD if isArticle true
  const articleJsonLd = swp.seo?.isArticle
    ? {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: swp.seo?.title || swp.site?.heading,
      description: swp.seo?.description || "",
      author: { "@type": "Person", name: swp.seo?.author || "Author" },
      datePublished: swp.seo?.publishDate,
      dateModified: swp.seo?.modifiedDate,
      image: swp.seo?.image ? `${SITE.url}${swp.seo.image}` : undefined,
      mainEntityOfPage: { "@type": "WebPage", "@id:": `${SITE.url}/${locale}/${swp.seo?.slug || ""}` },
    }
    : null;



  return <>

    {/* JSON-LD: FAQ */}
    {faqJsonLd && (
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    )}

    {/* JSON-LD: Article */}
    {articleJsonLd && (
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
    )}


    <Container maxWidth="lg">
      <Heading title={"NSC Calculator"} />

      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 8 }}>
            <NSCCalculator swp={swp} />
          </Grid>

          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 4 }}>
            <PopularCalculators />
          </Grid>
        </Grid>
      </Box>
    </Container>






  </>
}