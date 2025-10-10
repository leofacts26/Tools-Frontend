import Heading from "@/components/common/Heading";
import PopularCalculators from "@/components/PopularCalculators";
import { Box, Container, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import SWPCalculator from "@/components/calculators/SWPCalculator";
import { createMetadata, SITE } from "@/lib/seo";
import FAQAccordion from "@/components/common/FAQAccordion";
import MFReturnCalculator from "@/components/calculators/MFReturnCalculator";





export async function generateMetadata({ params }) {
  const locale = params?.locale || "en";

  // load localized common defaults and the page content (sipcalc.json)
  const common = (await import(`../../../../../messages/${locale}/common.json`).catch(() => ({}))).default || {};
  const mfReturnCalc = (await import(`../../../../../messages/${locale}/mfReturnCalc.json`).catch(() => ({}))).default || {};

  // use the seo block from mfReturnCalc.json (user provided)
  const pageSeo = mfReturnCalc.seo || {};

  // build opts for createMetadata (your lib/seo.js expects similar keys)
  const opts = {
    title: pageSeo.title || mfReturnCalc.site?.heading || common.site?.name || SITE.name,
    description: pageSeo.description || common.site?.description || "",
    slug: pageSeo.slug || "",
    image: pageSeo.image || common.site?.defaultImage || "",
    locale,
    isArticle: Boolean(pageSeo.isArticle),
    publishDate: pageSeo.publishDate,
    modifiedDate: pageSeo.modifiedDate,
    faqs: mfReturnCalc.faqs || [],
  };

  // createMetadata returns { title, description, openGraph, alternates, twitter, jsonLd }
  const meta = createMetadata(opts);

  // Build alternates/hreflang entries for all locales configured in SITE
  const alternates = { canonical: meta.openGraph.url, languages: {} };
  for (const lng of SITE.locales) {
    const other = (await import(`../../../../../messages/${lng}/mfReturnCalc.json`).catch(() => ({}))).default || {};
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
  const mfcalc = (await import(`../../../../../messages/${locale}/mfReturnCalc.json`)).default;



  // Build JSON-LD for FAQ (if any)
  const faqJsonLd =
    mfcalc.faqs && mfcalc.faqs.length
      ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: mfcalc.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
      : null;

  // Build Article JSON-LD if isArticle true
  const articleJsonLd = mfcalc.seo?.isArticle
    ? {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: mfcalc.seo?.title || mfcalc.site?.heading,
      description: mfcalc.seo?.description || "",
      author: { "@type": "Person", name: mfcalc.seo?.author || "Author" },
      datePublished: mfcalc.seo?.publishDate,
      dateModified: mfcalc.seo?.modifiedDate,
      image: mfcalc.seo?.image ? `${SITE.url}${mfcalc.seo.image}` : undefined,
      mainEntityOfPage: { "@type": "WebPage", "@id:": `${SITE.url}/${locale}/${mfcalc.seo?.slug || ""}` },
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
      <Heading title={mfcalc.site?.heading ?? "Mutual Fund Return Calculator"} />

      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 8 }}>
            <MFReturnCalculator mf={mfcalc} />
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
            <Paper elevation={0} sx={{ border: "none", borderRadius: 2, p: { xs: 2, md: 4 }, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>

              {/* JSON object assumed to be imported as `mfcalc` */}
              <article aria-labelledby="what-is-mf-return-calculator" className="finance-article">
                <header>
                  <h2 id="what-is-mf-return-calculator" className="finance-sub-heading">
                    {mfcalc.article.whatIsHeading}
                  </h2>

                  {mfcalc.article.whatIsParagraphs.map((para, idx) => (
                    <p key={idx}>{para}</p>
                  ))}
                </header>


                <section aria-labelledby={mfcalc.article.whatIsSection.id}>
                  <h3 id={mfcalc.article.whatIsSection.id} className="finance-sub-heading">
                    {mfcalc.article.whatIsSection.heading}
                  </h3>

                  {mfcalc.article.whatIsSection.paragraphs.map((para, index) => (
                    <p key={index}>{para}</p>
                  ))}

                  <ul className="ou-list">
                    {mfcalc.article.whatIsSection.points.map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                  </ul>

                  <br />

                  <p>{mfcalc.article.whatIsSection.conclusion}</p>
                </section>



                <section aria-labelledby={mfcalc.article.whyUseSection.id}>
                  <h3 id={mfcalc.article.whyUseSection.id} className="finance-sub-heading">
                    {mfcalc.article.whyUseSection.heading}
                  </h3>

                  {mfcalc.article.whyUseSection.paragraphs.map((para, index) => (
                    <p key={index}>{para}</p>
                  ))}

                  <ul className="ou-list">
                    {mfcalc.article.whyUseSection.points.map((point, index) => (
                      <li key={index}>
                        <strong>{point.title}</strong> — {point.description}
                      </li>
                    ))}
                  </ul>

                  <br />

                  <p>{mfcalc.article.whyUseSection.conclusion}</p>
                </section>


                <section aria-labelledby={mfcalc.article.howItWorksSection.id}>
                  <h3 id={mfcalc.article.howItWorksSection.id} className="finance-sub-heading">
                    {mfcalc.article.howItWorksSection.heading}
                  </h3>

                  {mfcalc.article.howItWorksSection.paragraphs.map((para, index) => (
                    <p key={index}>{para}</p>
                  ))}

                  <div className="formula-block" style={{ margin: "16px 0", padding: "12px", background: "#f9fafb", borderRadius: "8px" }}>
                    <strong>{mfcalc.article.howItWorksSection.formula.title}</strong>
                    <pre style={{ margin: "8px 0", fontFamily: "monospace" }}>
                      {mfcalc.article.howItWorksSection.formula.body}
                    </pre>
                  </div>

                  <ul className="ou-list">
                    {mfcalc.article.howItWorksSection.variables.map((variable, index) => (
                      <li key={index}>
                        <strong>{variable.symbol}</strong> = {variable.description}
                      </li>
                    ))}
                  </ul>

                  <p>{mfcalc.article.howItWorksSection.conclusion}</p>
                </section>


                <section aria-labelledby={mfcalc.article.exampleSection.id}>
                  <h3 id={mfcalc.article.exampleSection.id} className="finance-sub-heading">
                    {mfcalc.article.exampleSection.heading}
                  </h3>

                  {mfcalc.article.exampleSection.paragraphs.map((para, index) => (
                    <p key={index}>{para}</p>
                  ))}

                  <div className="formula-block" style={{ margin: "16px 0", padding: "12px", background: "#f9fafb", borderRadius: "8px" }}>
                    <strong>{mfcalc.article.exampleSection.formula.title}</strong>
                    <pre style={{ margin: "8px 0", fontFamily: "monospace" }}>
                      {mfcalc.article.exampleSection.formula.body}
                    </pre>
                  </div>

                  <ul className="ou-list">
                    {mfcalc.article.exampleSection.results.map((result, index) => (
                      <li key={index}>{result}</li>
                    ))}
                  </ul>

                  <p>{mfcalc.article.exampleSection.conclusion}</p>
                </section>



                <section aria-labelledby={mfcalc.article.typesSection.id}>
                  <h3 id={mfcalc.article.typesSection.id} className="finance-sub-heading">
                    {mfcalc.article.typesSection.heading}
                  </h3>

                  <p>{mfcalc.article.typesSection.intro}</p>

                  {mfcalc.article.typesSection.types.map((t, idx) => (
                    <div key={idx} style={{ marginBottom: 16 }}>
                      <h4 className="finance-sub-heading-h4">{t.name}</h4>
                      <p>{t.description}</p>
                      <ul className="ou-list">
                        {t.bullets.map((b, i) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  ))}

                  <p>{mfcalc.article.typesSection.conclusion}</p>
                </section>


                <section aria-labelledby={mfcalc.article.benefitsOnlineSection.id}>
                  <h3 id={mfcalc.article.benefitsOnlineSection.id} className="finance-sub-heading">
                    {mfcalc.article.benefitsOnlineSection.heading}
                  </h3>

                  <p>{mfcalc.article.benefitsOnlineSection.intro}</p>

                  <ul className="ou-list">
                    {mfcalc.article.benefitsOnlineSection.points.map((point, index) => (
                      <li key={index}>
                        <strong>{point.title}</strong> — {point.description}
                      </li>
                    ))}
                  </ul>
                </section>


                <section aria-labelledby={mfcalc.article.howToUseSection.id}>
                  <h3 id={mfcalc.article.howToUseSection.id} className="finance-sub-heading">
                    {mfcalc.article.howToUseSection.heading}
                  </h3>

                  <p>{mfcalc.article.howToUseSection.intro}</p>

                  <ol className="ou-list">
                    {mfcalc.article.howToUseSection.steps.map((step, index) => (
                      <li key={index}>
                        <strong>{step.title}</strong> — {step.description}
                      </li>
                    ))}
                  </ol>

                  <p>{mfcalc.article.howToUseSection.conclusion}</p>
                </section>


                <section aria-labelledby={mfcalc.article.returnTypesSection.id}>
                  <h3 id={mfcalc.article.returnTypesSection.id} className="finance-sub-heading">
                    {mfcalc.article.returnTypesSection.heading}
                  </h3>

                  <p>{mfcalc.article.returnTypesSection.intro}</p>

                  <ul className="ou-list">
                    {mfcalc.article.returnTypesSection.points.map((point, index) => (
                      <li key={index}>
                        <strong>{point.title}</strong> — {point.description}
                      </li>
                    ))}
                  </ul>

                  <p>{mfcalc.article.returnTypesSection.conclusion}</p>
                </section>


                <section aria-labelledby={mfcalc.article.accuracySection.id}>
                  <h3 id={mfcalc.article.accuracySection.id} className="finance-sub-heading">
                    {mfcalc.article.accuracySection.heading}
                  </h3>

                  {mfcalc.article.accuracySection.paragraphs.map((para, index) => (
                    <p key={index}>{para}</p>
                  ))}
                </section>


                <section aria-labelledby={mfcalc.article.advantagesSection.id}>
                  <h3 id={mfcalc.article.advantagesSection.id} className="finance-sub-heading">
                    {mfcalc.article.advantagesSection.heading}
                  </h3>

                  <p>{mfcalc.article.advantagesSection.intro}</p>

                  <ul className="ou-list">
                    {mfcalc.article.advantagesSection.points.map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                  </ul>

                  <p>{mfcalc.article.advantagesSection.conclusion}</p>
                </section>


                <section aria-labelledby={mfcalc.article.finalThoughtsSection.id}>
                  <h3 id={mfcalc.article.finalThoughtsSection.id} className="finance-sub-heading">
                    {mfcalc.article.finalThoughtsSection.heading}
                  </h3>

                  {mfcalc.article.finalThoughtsSection.paragraphs.map((para, index) => (
                    <p key={index}>{para}</p>
                  ))}
                </section>














              </article>



            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 4 }}>
          </Grid>

        </Grid>
      </Box>
    </Container >



  </>
}