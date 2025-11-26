import Heading from "@/components/common/Heading";
import PopularCalculators from "@/components/PopularCalculators";
import { Box, Container, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import SWPCalculator from "@/components/calculators/SWPCalculator";
import { createMetadata, SITE } from "@/lib/seo";
import FAQAccordion from "@/components/common/FAQAccordion";
import EPFCalculator from "@/components/calculators/EPFCalculator";
import Image from 'next/image';





export async function generateMetadata({ params }) {
  const locale = params?.locale || "en";

  // load localized common defaults and the page content (sipcalc.json)
  const common = (await import(`../../../../../messages/${locale}/common.json`).catch(() => ({}))).default || {};
  const epfCalc = (await import(`../../../../../messages/${locale}/epfCalc.json`).catch(() => ({}))).default || {};

  // use the seo block from epfCalc.json (user provided)
  const pageSeo = epfCalc.seo || {};

  // build opts for createMetadata (your lib/seo.js expects similar keys)
  const opts = {
    title: pageSeo.title || epfCalc.site?.heading || common.site?.name || SITE.name,
    description: pageSeo.description || common.site?.description || "",
    slug: pageSeo.slug || "",
    image: pageSeo.image || common.site?.defaultImage || "",
    locale,
    isArticle: Boolean(pageSeo.isArticle),
    publishDate: pageSeo.publishDate,
    modifiedDate: pageSeo.modifiedDate,
    faqs: epfCalc.faqs || [],
  };

  // createMetadata returns { title, description, openGraph, alternates, twitter, jsonLd }
  const meta = createMetadata(opts);

  // Build alternates/hreflang entries for all locales configured in SITE
  const alternates = { canonical: meta.openGraph.url, languages: {} };
  for (const lng of SITE.locales) {
    const other = (await import(`../../../../../messages/${lng}/epfCalc.json`).catch(() => ({}))).default || {};
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
  const epfcalc = (await import(`../../../../../messages/${locale}/epfCalc.json`)).default;


  // Build JSON-LD for FAQ (if any)
  const faqJsonLd =
    epfcalc.faqs && epfcalc.faqs.length
      ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: epfcalc.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
      : null;

  // Build Article JSON-LD if isArticle true
  const articleJsonLd = epfcalc.seo?.isArticle
    ? {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: epfcalc.seo?.title || epfcalc.site?.heading,
      description: epfcalc.seo?.description || "",
      author: { "@type": "Person", name: epfcalc.seo?.author || "Author" },
      datePublished: epfcalc.seo?.publishDate,
      dateModified: epfcalc.seo?.modifiedDate,
      image: epfcalc.seo?.image ? `${SITE.url}${epfcalc.seo.image}` : undefined,
      mainEntityOfPage: { "@type": "WebPage", "@id:": `${SITE.url}/${locale}/${epfcalc.seo?.slug || ""}` },
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
      <Heading title={epfcalc.site?.heading ?? "EPF Calculator"} />

      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 8 }}>
            <EPFCalculator epf={epfcalc} />
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

            <article aria-labelledby="what-is-epf-calculator" className="finance-article">

              <Image
                src={epfcalc?.seo?.image}
                alt="From ₹0 to ₹1 Crore"
                className="img-fluid mb-4 img-rounded"
                width={763}
                height={429}
                layout="responsive"
                objectFit="contain"
                style={{ marginTop: '20px' }}
              />

              <header>
                <h2 id="what-is-epf-calculator" className="finance-sub-heading">
                  {epfcalc.article.intro.heading}
                </h2>

                {epfcalc.article.intro.paragraphs.map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </header>


              <section aria-labelledby={epfcalc.article.whatIsEPFSection.id}>
                <h3 id={epfcalc.article.whatIsEPFSection.id} className="finance-sub-heading">
                  {epfcalc.article.whatIsEPFSection.heading}
                </h3>

                {epfcalc.article.whatIsEPFSection.paragraphs.map((para, index) => (
                  <p key={index}>{para}</p>
                ))}
              </section>


              <section aria-labelledby={epfcalc.article.whyUseEPFCalculatorSection.id}>
                <h3 id={epfcalc.article.whyUseEPFCalculatorSection.id} className="finance-sub-heading">
                  {epfcalc.article.whyUseEPFCalculatorSection.heading}
                </h3>

                {epfcalc.article.whyUseEPFCalculatorSection.paragraphs.map((para, index) => (
                  <p key={index}>{para}</p>
                ))}
              </section>


              <section aria-labelledby={epfcalc.article.howEPFCalculatorWorksSection.id}>
                <h3 id={epfcalc.article.howEPFCalculatorWorksSection.id} className="finance-sub-heading">
                  {epfcalc.article.howEPFCalculatorWorksSection.heading}
                </h3>

                {epfcalc.article.howEPFCalculatorWorksSection.paragraphs.map((para, index) => (
                  <p key={index}>{para}</p>
                ))}
              </section>


              <section aria-labelledby={epfcalc.article.epfInputChecklistSection.id}>
                <h3 id={epfcalc.article.epfInputChecklistSection.id} className="finance-sub-heading">
                  {epfcalc.article.epfInputChecklistSection.heading}
                </h3>

                <p>{epfcalc.article.epfInputChecklistSection.intro}</p>

                <ol className="ou-list">
                  {epfcalc.article.epfInputChecklistSection.steps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>

                <p>{epfcalc.article.epfInputChecklistSection.conclusion}</p>
              </section>


              <section aria-labelledby={epfcalc.article.epfFormulaSection.id}>
                <h3 id={epfcalc.article.epfFormulaSection.id} className="finance-sub-heading">
                  {epfcalc.article.epfFormulaSection.heading}
                </h3>

                <p>{epfcalc.article.epfFormulaSection.intro}</p>

                <ol className="ou-list">
                  {epfcalc.article.epfFormulaSection.formulas.map((item, index) => (
                    <li key={index}>
                      <strong>{item.title}</strong>
                      {item.expression && (
                        <pre style={{ margin: "8px 0", fontFamily: "monospace" }}>
                          {item.expression}
                        </pre>
                      )}
                      {item.formula && (
                        <pre style={{ margin: "8px 0", fontFamily: "monospace" }}>
                          {item.formula}
                        </pre>
                      )}
                      {item.explanation && <p>{item.explanation}</p>}
                    </li>
                  ))}
                </ol>

                <p>{epfcalc.article.epfFormulaSection.conclusion}</p>
              </section>


              <section aria-labelledby={epfcalc.article.stepByStepEPFSection.id}>
                <h3 id={epfcalc.article.stepByStepEPFSection.id} className="finance-sub-heading">
                  {epfcalc.article.stepByStepEPFSection.heading}
                </h3>

                <p>{epfcalc.article.stepByStepEPFSection.intro}</p>

                <ol className="ou-list">
                  {epfcalc.article.stepByStepEPFSection.steps.map((step, index) => (
                    <li key={index}>
                      <strong>{step.title}</strong>
                      {step.description && <> — {step.description}</>}
                    </li>
                  ))}
                </ol>

                <p>{epfcalc.article.stepByStepEPFSection.conclusion}</p>
              </section>


              <section aria-labelledby={epfcalc.article.epfExampleWalkthroughSection.id}>
                <h3 id={epfcalc.article.epfExampleWalkthroughSection.id} className="finance-sub-heading">
                  {epfcalc.article.epfExampleWalkthroughSection.heading}
                </h3>

                <p>{epfcalc.article.epfExampleWalkthroughSection.intro}</p>

                <ol className="ou-list">
                  {epfcalc.article.epfExampleWalkthroughSection.steps.map((step, index) => (
                    <li key={index}>
                      <strong>{step.title}</strong>
                      {step.formula && (
                        <pre style={{ margin: "8px 0", fontFamily: "monospace" }}>
                          {step.formula}
                        </pre>
                      )}
                    </li>
                  ))}
                </ol>

                <p>{epfcalc.article.epfExampleWalkthroughSection.conclusion}</p>
              </section>


              <section aria-labelledby={epfcalc.article.employerContributionSection.id}>
                <h3 id={epfcalc.article.employerContributionSection.id} className="finance-sub-heading">
                  {epfcalc.article.employerContributionSection.heading}
                </h3>

                <p>{epfcalc.article.employerContributionSection.intro}</p>

                <ol className="ou-list">
                  {epfcalc.article.employerContributionSection.points.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ol>

                <div style={{ marginTop: "1rem" }}>
                  <h4 className="finance-sub-heading-h4">Formulas:</h4>
                  <ul className="ou-list">
                    {epfcalc.article.employerContributionSection.formulas.map((item, index) => (
                      <li key={index}>
                        <strong>{item.title}</strong>
                        <pre style={{ margin: "8px 0", fontFamily: "monospace" }}>{item.formula}</pre>
                      </li>
                    ))}
                  </ul>
                </div>

                <p>{epfcalc.article.employerContributionSection.conclusion}</p>
              </section>


              <section aria-labelledby={epfcalc.article.boostVPFSection.id}>
                <h3 id={epfcalc.article.boostVPFSection.id} className="finance-sub-heading">
                  {epfcalc.article.boostVPFSection.heading}
                </h3>

                <p>{epfcalc.article.boostVPFSection.intro}</p>

                <ol className="ou-list">
                  {epfcalc.article.boostVPFSection.steps.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>

                <h4 className="finance-sub-heading-h4">{epfcalc.article.boostVPFSection.example.title}</h4>
                <p>{epfcalc.article.boostVPFSection.example.body}</p>

                <p>{epfcalc.article.boostVPFSection.conclusion}</p>
              </section>


              <section aria-labelledby={epfcalc.article.withdrawalsTransfersTaxSection.id}>
                <h3 id={epfcalc.article.withdrawalsTransfersTaxSection.id} className="finance-sub-heading">
                  {epfcalc.article.withdrawalsTransfersTaxSection.heading}
                </h3>

                <p>{epfcalc.article.withdrawalsTransfersTaxSection.intro}</p>

                <ol className="ou-list">
                  {epfcalc.article.withdrawalsTransfersTaxSection.points.map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ol>

                <div style={{ marginTop: 12 }}>
                  <h4 className="finance-sub-heading-h4">{epfcalc.article.withdrawalsTransfersTaxSection.formulaAdjustment.title}</h4>
                  <p>{epfcalc.article.withdrawalsTransfersTaxSection.formulaAdjustment.explanation}</p>
                  <pre style={{ margin: "8px 0", fontFamily: "monospace" }}>
                    {epfcalc.article.withdrawalsTransfersTaxSection.formulaAdjustment.expression}
                  </pre>
                </div>

                <p><em>{epfcalc.article.withdrawalsTransfersTaxSection.note}</em></p>

                <p>{epfcalc.article.withdrawalsTransfersTaxSection.conclusion}</p>
              </section>

              <section aria-labelledby={epfcalc.article.benefitsOnlineEPFSection.id}>
                <h3 id={epfcalc.article.benefitsOnlineEPFSection.id} className="finance-sub-heading">
                  {epfcalc.article.benefitsOnlineEPFSection.heading}
                </h3>

                <p>{epfcalc.article.benefitsOnlineEPFSection.intro}</p>

                <ul className="ou-list">
                  {epfcalc.article.benefitsOnlineEPFSection.points.map((point, index) => (
                    <li key={index}>
                      <strong>{point.title}</strong> — {point.description}
                    </li>
                  ))}
                </ul>

                <p>{epfcalc.article.benefitsOnlineEPFSection.conclusion}</p>
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