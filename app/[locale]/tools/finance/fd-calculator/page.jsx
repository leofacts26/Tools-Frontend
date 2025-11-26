import Heading from "@/components/common/Heading";
import PopularCalculators from "@/components/PopularCalculators";
import { Box, Container, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import SWPCalculator from "@/components/calculators/SWPCalculator";
import { createMetadata, SITE } from "@/lib/seo";
import FAQAccordion from "@/components/common/FAQAccordion";
import MFReturnCalculator from "@/components/calculators/MFReturnCalculator";
import FDCalculator from "@/components/calculators/FDCalculator";
import Image from 'next/image';





export async function generateMetadata({ params }) {
  const locale = params?.locale || "en";

  // load localized common defaults and the page content (sipcalc.json)
  const common = (await import(`../../../../../messages/${locale}/common.json`).catch(() => ({}))).default || {};
  const fdCalc = (await import(`../../../../../messages/${locale}/fdCalc.json`).catch(() => ({}))).default || {};

  // use the seo block from fdCalc.json (user provided)
  const pageSeo = fdCalc.seo || {};

  // build opts for createMetadata (your lib/seo.js expects similar keys)
  const opts = {
    title: pageSeo.title || fdCalc.site?.heading || common.site?.name || SITE.name,
    description: pageSeo.description || common.site?.description || "",
    slug: pageSeo.slug || "",
    image: pageSeo.image || common.site?.defaultImage || "",
    locale,
    isArticle: Boolean(pageSeo.isArticle),
    publishDate: pageSeo.publishDate,
    modifiedDate: pageSeo.modifiedDate,
    faqs: fdCalc.faqs || [],
  };

  // createMetadata returns { title, description, openGraph, alternates, twitter, jsonLd }
  const meta = createMetadata(opts);

  // Build alternates/hreflang entries for all locales configured in SITE
  const alternates = { canonical: meta.openGraph.url, languages: {} };
  for (const lng of SITE.locales) {
    const other = (await import(`../../../../../messages/${lng}/fdCalc.json`).catch(() => ({}))).default || {};
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
  const fdCalc = (await import(`../../../../../messages/${locale}/fdCalc.json`)).default;


  // Build JSON-LD for FAQ (if any)
  const faqJsonLd =
    fdCalc.faqs && fdCalc.faqs.length
      ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: fdCalc.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
      : null;

  // Build Article JSON-LD if isArticle true
  const articleJsonLd = fdCalc.seo?.isArticle
    ? {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: fdCalc.seo?.title || fdCalc.site?.heading,
      description: fdCalc.seo?.description || "",
      author: { "@type": "Person", name: fdCalc.seo?.author || "Author" },
      datePublished: fdCalc.seo?.publishDate,
      dateModified: fdCalc.seo?.modifiedDate,
      image: fdCalc.seo?.image ? `${SITE.url}${fdCalc.seo.image}` : undefined,
      mainEntityOfPage: { "@type": "WebPage", "@id:": `${SITE.url}/${locale}/${fdCalc.seo?.slug || ""}` },
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
      <Heading title={fdCalc.site?.heading ?? "FD Calculator"} />

      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 8 }}>
            <FDCalculator fd={fdCalc} />
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

            <article aria-labelledby="what-is-fd-calculator" className="finance-article">

              <Image
                src={fdCalc?.seo?.image}
                alt="FD Calculator"
                className="img-fluid mb-4 img-rounded"
                width={763}
                height={429}
                layout="responsive"
                objectFit="contain"
                style={{ marginTop: '20px' }}
              />

              <header>
                <h2 id="what-is-fd-calculator" className="finance-sub-heading">
                  {fdCalc.article.intro.heading}
                </h2>

                {fdCalc.article.intro.paragraphs.map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </header>


              <section aria-labelledby={fdCalc.article.whatIsFDSection.id}>
                <h3 id={fdCalc.article.whatIsFDSection.id} className="finance-sub-heading">
                  {fdCalc.article.whatIsFDSection.heading}
                </h3>

                {fdCalc.article.whatIsFDSection.paragraphs.map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </section>


              <section aria-labelledby={fdCalc.article.whyUseFDSection.id}>
                <h3 id={fdCalc.article.whyUseFDSection.id} className="finance-sub-heading">
                  {fdCalc.article.whyUseFDSection.heading}
                </h3>

                <p>{fdCalc.article.whyUseFDSection.intro}</p>

                <ul className="ou-list">
                  {fdCalc.article.whyUseFDSection.points.map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>

                <p>{fdCalc.article.whyUseFDSection.conclusion}</p>
              </section>


              <section aria-labelledby={fdCalc.article.howItWorksFDSection.id}>
                <h3 id={fdCalc.article.howItWorksFDSection.id} className="finance-sub-heading">
                  {fdCalc.article.howItWorksFDSection.heading}
                </h3>

                <p>{fdCalc.article.howItWorksFDSection.intro}</p>

                <div>
                  {fdCalc.article.howItWorksFDSection.formulas.map((item, idx) => (
                    <div key={idx} style={{ marginBottom: "1rem" }}>
                      <strong>{item.type}:</strong>
                      <pre style={{ margin: "6px 0", fontFamily: "monospace" }}>{item.expression}</pre>
                      <p>{item.explanation}</p>
                    </div>
                  ))}
                </div>

                <ol className="ou-list">
                  {fdCalc.article.howItWorksFDSection.steps.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>

                <p>{fdCalc.article.howItWorksFDSection.extra}</p>
              </section>


              <section aria-labelledby={fdCalc.article.fdInputChecklistSection.id}>
                <h3 id={fdCalc.article.fdInputChecklistSection.id} className="finance-sub-heading">
                  {fdCalc.article.fdInputChecklistSection.heading}
                </h3>

                <p>{fdCalc.article.fdInputChecklistSection.intro}</p>

                <ol className="ou-list">
                  {fdCalc.article.fdInputChecklistSection.steps.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>

                <p>{fdCalc.article.fdInputChecklistSection.conclusion}</p>
              </section>


              <section aria-labelledby={fdCalc.article.fdFormulaSection.id}>
                <h3 id={fdCalc.article.fdFormulaSection.id} className="finance-sub-heading">
                  {fdCalc.article.fdFormulaSection.heading}
                </h3>

                <p>{fdCalc.article.fdFormulaSection.intro}</p>

                <ol className="ou-list">
                  {fdCalc.article.fdFormulaSection.formulas.map((item, index) => (
                    <li key={index}>
                      <strong>{item.title}</strong>
                      {item.expression && (
                        <pre style={{ margin: "8px 0", fontFamily: "monospace" }}>
                          {item.expression}
                        </pre>
                      )}
                      {item.explanation && <p>{item.explanation}</p>}
                      {item.steps && (
                        <ul className="ou-list">
                          {item.steps.map((s, idx) => (
                            <li key={idx}>
                              <pre style={{ margin: "4px 0", fontFamily: "monospace" }}>{s}</pre>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ol>

                <p>{fdCalc.article.fdFormulaSection.conclusion}</p>
              </section>


              <section aria-labelledby={fdCalc.article.fdStepByStepSection.id}>
                <h3 id={fdCalc.article.fdStepByStepSection.id} className="finance-sub-heading">
                  {fdCalc.article.fdStepByStepSection.heading}
                </h3>

                <p>{fdCalc.article.fdStepByStepSection.intro}</p>

                <ol className="ou-list">
                  {fdCalc.article.fdStepByStepSection.steps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>

                <p>{fdCalc.article.fdStepByStepSection.conclusion}</p>
              </section>


              <section aria-labelledby={fdCalc.article.fdExampleWalkthroughSection.id}>
                <h3 id={fdCalc.article.fdExampleWalkthroughSection.id} className="finance-sub-heading">
                  {fdCalc.article.fdExampleWalkthroughSection.heading}
                </h3>

                <p>{fdCalc.article.fdExampleWalkthroughSection.intro}</p>

                {fdCalc.article.fdExampleWalkthroughSection.examples.map((example, idx) => (
                  <div key={idx} style={{ marginTop: "1rem" }}>
                    <h4 className="finance-sub-heading-h4">{example.type}</h4>
                    <ol className="ou-list">
                      {example.steps.map((step, i) => (
                        <li key={i}>
                          <pre style={{ margin: "4px 0", fontFamily: "monospace" }}>{step}</pre>
                        </li>
                      ))}
                    </ol>
                    {example.note && <p><em>{example.note}</em></p>}
                  </div>
                ))}
              </section>


              <section aria-labelledby={fdCalc.article.fdTypesSection.id}>
                <h3 id={fdCalc.article.fdTypesSection.id} className="finance-sub-heading">
                  {fdCalc.article.fdTypesSection.heading}
                </h3>

                <p>{fdCalc.article.fdTypesSection.intro}</p>

                <ol className="ou-list">
                  {fdCalc.article.fdTypesSection.types.map((item, idx) => (
                    <li key={idx}>
                      <strong>{item.title}</strong> — {item.description}
                    </li>
                  ))}
                </ol>

                <p>{fdCalc.article.fdTypesSection.conclusion}</p>
              </section>


              <section aria-labelledby={fdCalc.article.seniorRatesSection.id}>
                <h3 id={fdCalc.article.seniorRatesSection.id} className="finance-sub-heading">
                  {fdCalc.article.seniorRatesSection.heading}
                </h3>

                <p>{fdCalc.article.seniorRatesSection.intro}</p>

                <ol className="ou-list">
                  {fdCalc.article.seniorRatesSection.steps.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>

                <h4 className="finance-sub-heading-h4">{fdCalc.article.seniorRatesSection.example.title}</h4>
                <p>{fdCalc.article.seniorRatesSection.example.body}</p>

                <p>{fdCalc.article.seniorRatesSection.conclusion}</p>
              </section>


              <section aria-labelledby={fdCalc.article.withdrawalsPrematureTaxSection.id}>
                <h3 id={fdCalc.article.withdrawalsPrematureTaxSection.id} className="finance-sub-heading">
                  {fdCalc.article.withdrawalsPrematureTaxSection.heading}
                </h3>

                <p>{fdCalc.article.withdrawalsPrematureTaxSection.intro}</p>

                <ul className="ou-list">
                  {fdCalc.article.withdrawalsPrematureTaxSection.points.map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>

                <h4 className="finance-sub-heading-h4">{fdCalc.article.withdrawalsPrematureTaxSection.example.title}</h4>
                <p>{fdCalc.article.withdrawalsPrematureTaxSection.example.body}</p>

                <p><em>{fdCalc.article.withdrawalsPrematureTaxSection.note}</em></p>

                <p>{fdCalc.article.withdrawalsPrematureTaxSection.conclusion}</p>
              </section>


              <section aria-labelledby={fdCalc.article.fdBenefitsSection.id}>
                <h3 id={fdCalc.article.fdBenefitsSection.id} className="finance-sub-heading">
                  {fdCalc.article.fdBenefitsSection.heading}
                </h3>

                <p>{fdCalc.article.fdBenefitsSection.intro}</p>

                <ul className="ou-list">
                  {fdCalc.article.fdBenefitsSection.points.map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>

                <p>{fdCalc.article.fdBenefitsSection.conclusion}</p>
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