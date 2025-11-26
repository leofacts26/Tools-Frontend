import Heading from "@/components/common/Heading";
import PopularCalculators from "@/components/PopularCalculators";
import { Box, Container, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import SWPCalculator from "@/components/calculators/SWPCalculator";
import { createMetadata, SITE } from "@/lib/seo";
import FAQAccordion from "@/components/common/FAQAccordion";
import MFReturnCalculator from "@/components/calculators/MFReturnCalculator";
import SukanyaSamriddhiYojanaCalculator from "@/components/calculators/SukanyaSamriddhiYojanaCalculator";
import PPFCalculator from "@/components/calculators/PPFCalculator";
import FormulaBlock from "@/components/common/FormulaBlock";
import Image from 'next/image';





export async function generateMetadata({ params }) {
  const locale = params?.locale || "en";

  // load localized common defaults and the page content (sipcalc.json)
  const common = (await import(`../../../../../messages/${locale}/common.json`).catch(() => ({}))).default || {};
  const ppfCalc = (await import(`../../../../../messages/${locale}/ppfCalc.json`).catch(() => ({}))).default || {};

  // use the seo block from ppfCalc.json (user provided)
  const pageSeo = ppfCalc.seo || {};

  // build opts for createMetadata (your lib/seo.js expects similar keys)
  const opts = {
    title: pageSeo.title || ppfCalc.site?.heading || common.site?.name || SITE.name,
    description: pageSeo.description || common.site?.description || "",
    slug: pageSeo.slug || "",
    image: pageSeo.image || common.site?.defaultImage || "",
    locale,
    isArticle: Boolean(pageSeo.isArticle),
    publishDate: pageSeo.publishDate,
    modifiedDate: pageSeo.modifiedDate,
    faqs: ppfCalc.faqs || [],
  };

  // createMetadata returns { title, description, openGraph, alternates, twitter, jsonLd }
  const meta = createMetadata(opts);

  // Build alternates/hreflang entries for all locales configured in SITE
  const alternates = { canonical: meta.openGraph.url, languages: {} };
  for (const lng of SITE.locales) {
    const other = (await import(`../../../../../messages/${lng}/ppfCalc.json`).catch(() => ({}))).default || {};
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
  const ppfCalc = (await import(`../../../../../messages/${locale}/ppfCalc.json`)).default;

  // Build JSON-LD for FAQ (if any)
  const faqJsonLd =
    ppfCalc.faqs && ppfCalc.faqs.length
      ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: ppfCalc.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
      : null;

  // Build Article JSON-LD if isArticle true
  const articleJsonLd = ppfCalc.seo?.isArticle
    ? {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: ppfCalc.seo?.title || ppfCalc.site?.heading,
      description: ppfCalc.seo?.description || "",
      author: { "@type": "Person", name: ppfCalc.seo?.author || "Author" },
      datePublished: ppfCalc.seo?.publishDate,
      dateModified: ppfCalc.seo?.modifiedDate,
      image: ppfCalc.seo?.image ? `${SITE.url}${ppfCalc.seo.image}` : undefined,
      mainEntityOfPage: { "@type": "WebPage", "@id:": `${SITE.url}/${locale}/${ppfCalc.seo?.slug || ""}` },
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
      <Heading title={ppfCalc.site?.heading ?? "PPF Calculator"} />

      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 8 }}>
            <PPFCalculator ppf={ppfCalc} />
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

            <article aria-labelledby="what-is-ppf-calculator" className="finance-article">

              <Image
                src={ppfCalc?.seo?.image}
                alt="From ₹0 to ₹1 Crore"
                className="img-fluid mb-4 img-rounded"
                width={763}
                height={429}
                layout="responsive"
                objectFit="contain"
                style={{ marginTop: '20px' }}
              />



              <header>
                <h2 id="what-is-ppf-calculator" className="finance-sub-heading">
                  {ppfCalc.article.whatIsHeading}
                </h2>

                {ppfCalc.article.whatIsParagraphs.map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </header>

              <section aria-labelledby={ppfCalc.article.whatIsPPFSection.id}>
                <h3 id={ppfCalc.article.whatIsPPFSection.id} className="finance-sub-heading">
                  {ppfCalc.article.whatIsPPFSection.heading}
                </h3>

                {ppfCalc.article.whatIsPPFSection.paragraphs.map((para, index) => (
                  <p key={index}>{para}</p>
                ))}

                <h4 className="finance-sub-heading-h4">
                  {ppfCalc.article.whatIsPPFSection.subHeading}
                </h4>

                <ul className="ou-list">
                  {ppfCalc.article.whatIsPPFSection.points.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>

                <p>{ppfCalc.article.whatIsPPFSection.conclusion}</p>
              </section>


              <section aria-labelledby={ppfCalc.article.whatIsPPFCalculatorSection.id}>
                <h3 id={ppfCalc.article.whatIsPPFCalculatorSection.id} className="finance-sub-heading">
                  {ppfCalc.article.whatIsPPFCalculatorSection.heading}
                </h3>

                {ppfCalc.article.whatIsPPFCalculatorSection.paragraphs.map((para, index) => (
                  <p key={index}>{para}</p>
                ))}

                <ul className="ou-list">
                  {ppfCalc.article.whatIsPPFCalculatorSection.points.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>

                <p>{ppfCalc.article.whatIsPPFCalculatorSection.conclusion}</p>
              </section>


              <section aria-labelledby={ppfCalc.article.whyUsePPFCalculatorSection.id}>
                <h3 id={ppfCalc.article.whyUsePPFCalculatorSection.id} className="finance-sub-heading">
                  {ppfCalc.article.whyUsePPFCalculatorSection.heading}
                </h3>

                <p>{ppfCalc.article.whyUsePPFCalculatorSection.intro}</p>

                <ul className="ou-list">
                  {ppfCalc.article.whyUsePPFCalculatorSection.points.map((point, index) => (
                    <li key={index}>
                      <strong>{point.title}</strong> — {point.description}
                    </li>
                  ))}
                </ul>
              </section>


              <section aria-labelledby={ppfCalc.article.howPPFCalculatorWorksSection.id}>
                <h3 id={ppfCalc.article.howPPFCalculatorWorksSection.id} className="finance-sub-heading">
                  {ppfCalc.article.howPPFCalculatorWorksSection.heading}
                </h3>

                {ppfCalc.article.howPPFCalculatorWorksSection.paragraphs.map((para, index) => (
                  <p key={index}>{para}</p>
                ))}

                <FormulaBlock
                  title={ppfCalc.article.howPPFCalculatorWorksSection.formula.title}
                  formula={ppfCalc.article.howPPFCalculatorWorksSection.formula.body}
                />

                <ul className="ou-list">
                  {ppfCalc.article.howPPFCalculatorWorksSection.variables.map((v, i) => (
                    <li key={i}>
                      <strong>{v.symbol}</strong> = {v.description}
                    </li>
                  ))}
                </ul>

                <p>{ppfCalc.article.howPPFCalculatorWorksSection.conclusion}</p>
              </section>


              <section aria-labelledby={ppfCalc.article.examplePPFCalculationSection.id}>
                <h3 id={ppfCalc.article.examplePPFCalculationSection.id} className="finance-sub-heading">
                  {ppfCalc.article.examplePPFCalculationSection.heading}
                </h3>

                {ppfCalc.article.examplePPFCalculationSection.paragraphs.map((para, index) => (
                  <p key={index}>{para}</p>
                ))}


                <FormulaBlock
                  title={ppfCalc.article.examplePPFCalculationSection.formula.title}
                  formula={ppfCalc.article.examplePPFCalculationSection.formula.body}
                />

                <ul className="ou-list">
                  {ppfCalc.article.examplePPFCalculationSection.results.map((result, i) => (
                    <li key={i}>{result}</li>
                  ))}
                </ul>

                <p>{ppfCalc.article.examplePPFCalculationSection.conclusion}</p>
              </section>


              <section aria-labelledby={ppfCalc.article.keyFeaturesPPFCalculatorSection.id}>
                <h3 id={ppfCalc.article.keyFeaturesPPFCalculatorSection.id} className="finance-sub-heading">
                  {ppfCalc.article.keyFeaturesPPFCalculatorSection.heading}
                </h3>

                <p>{ppfCalc.article.keyFeaturesPPFCalculatorSection.intro}</p>

                <ul className="ou-list">
                  {ppfCalc.article.keyFeaturesPPFCalculatorSection.points.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>

                <p>{ppfCalc.article.keyFeaturesPPFCalculatorSection.conclusion}</p>
              </section>


              <section aria-labelledby={ppfCalc.article.howToUsePPFCalculatorSection.id}>
                <h3 id={ppfCalc.article.howToUsePPFCalculatorSection.id} className="finance-sub-heading">
                  {ppfCalc.article.howToUsePPFCalculatorSection.heading}
                </h3>

                <p>{ppfCalc.article.howToUsePPFCalculatorSection.intro}</p>

                <ol className="ou-list">
                  {ppfCalc.article.howToUsePPFCalculatorSection.steps.map((step, index) => (
                    <li key={index}>
                      <strong>{step.title}</strong> — {step.description}
                    </li>
                  ))}
                </ol>
              </section>


              <section aria-labelledby={ppfCalc.article.ppfInterestRateHistorySection.id}>
                <h3 id={ppfCalc.article.ppfInterestRateHistorySection.id} className="finance-sub-heading">
                  {ppfCalc.article.ppfInterestRateHistorySection.heading}
                </h3>

                <p>{ppfCalc.article.ppfInterestRateHistorySection.intro}</p>

                <TableContainer component={Paper} sx={{ my: 2 }}>
                  <Table aria-label="PPF Interest Rate Table">
                    <TableHead>
                      <TableRow>
                        {ppfCalc.article.ppfInterestRateHistorySection.table.headers.map((header, index) => (
                          <TableCell key={index} sx={{ fontWeight: 600 }}>
                            {header}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {ppfCalc.article.ppfInterestRateHistorySection.table.rows.map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                          {row.map((cell, cellIndex) => (
                            <TableCell key={cellIndex}>{cell}</TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <p>{ppfCalc.article.ppfInterestRateHistorySection.conclusion}</p>
              </section>


              <section aria-labelledby={ppfCalc.article.advantagesOfPPFCalculatorSection.id}>
                <h3 id={ppfCalc.article.advantagesOfPPFCalculatorSection.id} className="finance-sub-heading">
                  {ppfCalc.article.advantagesOfPPFCalculatorSection.heading}
                </h3>

                <ul className="ou-list">
                  {ppfCalc.article.advantagesOfPPFCalculatorSection.points.map((point, index) => (
                    <li key={index}>
                      <strong>{point.title}</strong> — {point.description}
                    </li>
                  ))}
                </ul>
              </section>


              <section aria-labelledby={ppfCalc.article.taxBenefitsPPFSection.id}>
                <h3 id={ppfCalc.article.taxBenefitsPPFSection.id} className="finance-sub-heading">
                  {ppfCalc.article.taxBenefitsPPFSection.heading}
                </h3>

                <p>{ppfCalc.article.taxBenefitsPPFSection.intro}</p>

                <ul className="ou-list">
                  {ppfCalc.article.taxBenefitsPPFSection.points.map((point, index) => (
                    <li key={index}>
                      <strong>{point.title}</strong> — {point.description}
                    </li>
                  ))}
                </ul>

                <p>{ppfCalc.article.taxBenefitsPPFSection.conclusion}</p>
              </section>

              <section aria-labelledby={ppfCalc.article.ppfWithdrawalSection.id}>
                <h3 id={ppfCalc.article.ppfWithdrawalSection.id} className="finance-sub-heading">
                  {ppfCalc.article.ppfWithdrawalSection.heading}
                </h3>

                <p>{ppfCalc.article.ppfWithdrawalSection.intro}</p>

                <ul className="ou-list">
                  {ppfCalc.article.ppfWithdrawalSection.points.map((point, index) => (
                    <li key={index}>
                      <strong>{point.title}</strong> — {point.description}
                    </li>
                  ))}
                </ul>
              </section>


              <section aria-labelledby={ppfCalc.article.ppfVsOtherInvestmentsSection.id}>
                <h3 id={ppfCalc.article.ppfVsOtherInvestmentsSection.id} className="finance-sub-heading">
                  {ppfCalc.article.ppfVsOtherInvestmentsSection.heading}
                </h3>

                <TableContainer component={Paper} sx={{ my: 2 }}>
                  <Table aria-label="PPF vs Other Investment Options Table">
                    <TableHead>
                      <TableRow>
                        {ppfCalc.article.ppfVsOtherInvestmentsSection.table.headers.map((header, index) => (
                          <TableCell key={index} sx={{ fontWeight: 600 }}>
                            {header}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {ppfCalc.article.ppfVsOtherInvestmentsSection.table.rows.map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                          {row.map((cell, cellIndex) => (
                            <TableCell key={cellIndex}>{cell}</TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <p>{ppfCalc.article.ppfVsOtherInvestmentsSection.conclusion}</p>
              </section>


              <section aria-labelledby={ppfCalc.article.finalThoughtsPPFSection.id}>
                <h3 id={ppfCalc.article.finalThoughtsPPFSection.id} className="finance-sub-heading">
                  {ppfCalc.article.finalThoughtsPPFSection.heading}
                </h3>

                {ppfCalc.article.finalThoughtsPPFSection.paragraphs.map((para, index) => (
                  <p key={index}>{para}</p>
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