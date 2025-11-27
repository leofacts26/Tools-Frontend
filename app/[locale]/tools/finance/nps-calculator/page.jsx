import Heading from "@/components/common/Heading";
import PopularCalculators from "@/components/PopularCalculators";
import { Box, Container, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import SWPCalculator from "@/components/calculators/SWPCalculator";
import { createMetadata, SITE } from "@/lib/seo";
import FAQAccordion from "@/components/common/FAQAccordion";
import NPSCalculator from "@/components/calculators/NPSCalculator";
import Image from 'next/image';





export async function generateMetadata({ params }) {
  // ⛔ params is async — you MUST await it
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || "en";

  // load localized common defaults and the page content (sipcalc.json)
  const common = (await import(`../../../../../messages/${locale}/common.json`).catch(() => ({}))).default || {};
  const npsCalc = (await import(`../../../../../messages/${locale}/npsCalc.json`).catch(() => ({}))).default || {};

  // use the seo block from npsCalc.json (user provided)
  const pageSeo = npsCalc.seo || {};

  // build opts for createMetadata (your lib/seo.js expects similar keys)
  const opts = {
    title: pageSeo.title || npsCalc.site?.heading || common.site?.name || SITE.name,
    description: pageSeo.description || common.site?.description || "",
    slug: pageSeo.slug || "",
    image: pageSeo.image || common.site?.defaultImage || "",
    locale,
    isArticle: Boolean(pageSeo.isArticle),
    publishDate: pageSeo.publishDate,
    modifiedDate: pageSeo.modifiedDate,
    faqs: npsCalc.faqs || [],
  };

  // createMetadata returns { title, description, openGraph, alternates, twitter, jsonLd }
  const meta = createMetadata(opts);

  // Build alternates/hreflang entries for all locales configured in SITE
  const alternates = { canonical: meta.openGraph.url, languages: {} };
  for (const lng of SITE.locales) {
    const other = (await import(`../../../../../messages/${lng}/npsCalc.json`).catch(() => ({}))).default || {};
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

  const resolvedParams = await params;     // 🔥 FIX
  const locale = resolvedParams.locale;
  const npsCalc = (await import(`../../../../../messages/${locale}/npsCalc.json`)).default;


  // Build JSON-LD for FAQ (if any)
  const faqJsonLd =
    npsCalc.faqs && npsCalc.faqs.length
      ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: npsCalc.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
      : null;

  // Build Article JSON-LD if isArticle true
  const articleJsonLd = npsCalc.seo?.isArticle
    ? {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: npsCalc.seo?.title || npsCalc.site?.heading,
      description: npsCalc.seo?.description || "",
      author: { "@type": "Person", name: npsCalc.seo?.author || "Author" },
      datePublished: npsCalc.seo?.publishDate,
      dateModified: npsCalc.seo?.modifiedDate,
      image: npsCalc.seo?.image ? `${SITE.url}${npsCalc.seo.image}` : undefined,
      mainEntityOfPage: { "@type": "WebPage", "@id:": `${SITE.url}/${locale}/${npsCalc.seo?.slug || ""}` },
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
      <Heading title={npsCalc.site?.heading ?? "NPS Calculator"} />

      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 8 }}>
            <NPSCalculator nps={npsCalc} />
          </Grid>

          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 4 }}>
            <PopularCalculators />
          </Grid>
        </Grid>
      </Box>
    </Container>


    <Container maxWidth="lg">
      <Box sx={{ flexGrow: 1, mt: 3 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 8 }}>
            {/* <Paper elevation={0} sx={{ border: "none", borderRadius: 2, p: { xs: 2, md: 4 }, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}> */}

            <article aria-labelledby="what-is-nps-calculator" className="finance-article">

              <Image
                src={npsCalc?.seo?.image}
                alt="National Pension Scheme Calculator"
                className="img-fluid mb-4 img-rounded"
                width={763}
                height={429}
                layout="responsive"
                objectFit="contain"
                style={{ marginTop: '20px' }}
              />



              <header>
                <h2 id="what-is-nps-calculator" className="finance-sub-heading">
                  {npsCalc.article.intro.heading}
                </h2>

                {npsCalc.article.intro.paragraphs.map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </header>

              <section aria-labelledby="what-is-nps" className="finance-article-section">
                <h3 id="what-is-nps" className="finance-sub-heading">
                  {npsCalc.article.whatIsNps.heading}
                </h3>

                {npsCalc.article.whatIsNps.paragraphs.map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </section>

              <section aria-labelledby="why-use-nps-calculator" className="finance-article-section">
                <h3 id="why-use-nps-calculator" className="finance-sub-heading">
                  {npsCalc.article.whyUseCalculator.heading}
                </h3>

                {npsCalc.article.whyUseCalculator.paragraphs.map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </section>

              <section aria-labelledby="how-nps-calculator-works" className="finance-article-section">
                <h3 id="how-nps-calculator-works" className="finance-sub-heading">
                  {npsCalc.article.howItWorks.heading}
                </h3>

                {npsCalc.article.howItWorks.paragraphs.map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </section>

              <section aria-labelledby="nps-inputs-checklist" className="finance-article-section">
                <h3 id="nps-inputs-checklist" className="finance-sub-heading">
                  {npsCalc.article.inputsChecklist.heading}
                </h3>

                <p>{npsCalc.article.inputsChecklist.intro}</p>

                <ol className="ou-list">
                  {npsCalc.article.inputsChecklist.points.map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ol>

                <p>{npsCalc.article.inputsChecklist.conclusion}</p>
              </section>

              <section aria-labelledby="nps-calculation-formula" className="finance-article-section">
                <h3 id="nps-calculation-formula" className="finance-sub-heading">
                  {npsCalc.article.calculationFormula.heading}
                </h3>

                <p>{npsCalc.article.calculationFormula.intro}</p>

                <ol className="ou-list">
                  {npsCalc.article.calculationFormula.steps.map((step, idx) => (
                    <li key={idx}>
                      <strong>{step.title}</strong>
                      <pre className="formula-block">{step.formula}</pre>
                      <p>{step.explanation}</p>
                    </li>
                  ))}
                </ol>
              </section>

              <section aria-labelledby="how-to-use-nps-calculator" className="finance-article-section">
                <h3 id="how-to-use-nps-calculator" className="finance-sub-heading">
                  {npsCalc.article.howToUse.heading}
                </h3>

                <ol className="ou-list">
                  {npsCalc.article.howToUse.steps.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </section>

              <section aria-labelledby="nps-example" className="finance-article-section">
                <h3 id="nps-example" className="finance-sub-heading">
                  {npsCalc.article.example.heading}
                </h3>

                <p>{npsCalc.article.example.intro}</p>

                <ul className="un-list">
                  {npsCalc.article.example.formulas.map((formula, idx) => (
                    <li key={idx}>
                      <code>{formula}</code>
                    </li>
                  ))}
                </ul>

                <p>{npsCalc.article.example.details.totalContributions}</p>
                <p>{npsCalc.article.example.details.interestEarned}</p>

                <h4>Retirement Split (Typical NPS Rules)</h4>
                <ul className="un-list">
                  <li>{npsCalc.article.example.split.lumpSum}</li>
                  <li>{npsCalc.article.example.split.annuity}</li>
                </ul>

                <p><em>{npsCalc.article.example.note}</em></p>
              </section>

              <section aria-labelledby="nps-tax-benefits" className="finance-article-section">
                <h3 id="nps-tax-benefits" className="finance-sub-heading">
                  {npsCalc.article.taxBenefits.heading}
                </h3>

                {npsCalc.article.taxBenefits.paragraphs.map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </section>

              <section aria-labelledby="nps-withdrawals" className="finance-article-section">
                <h3 id="nps-withdrawals" className="finance-sub-heading">
                  {npsCalc.article.withdrawals.heading}
                </h3>

                {npsCalc.article.withdrawals.paragraphs.map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </section>

              <section aria-labelledby="nps-fund-options" className="finance-article-section">
                <h3 id="nps-fund-options" className="finance-sub-heading">
                  {npsCalc.article.fundOptions.heading}
                </h3>

                {npsCalc.article.fundOptions.paragraphs.map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </section>

              <section aria-labelledby="nps-benefits" className="finance-article-section">
                <h3 id="nps-benefits" className="finance-sub-heading">
                  {npsCalc.article.benefits.heading}
                </h3>

                {npsCalc.article.benefits.paragraphs.map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </section>




            </article>




            {/* </Paper> */}
          </Grid>

          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 4 }}>
          </Grid>

        </Grid>
      </Box>
    </Container >




  </>
}