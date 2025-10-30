import Heading from "@/components/common/Heading";
import PopularCalculators from "@/components/PopularCalculators";
import { Box, Container, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import SWPCalculator from "@/components/calculators/SWPCalculator";
import { createMetadata, SITE } from "@/lib/seo";
import FAQAccordion from "@/components/common/FAQAccordion";
import MFReturnCalculator from "@/components/calculators/MFReturnCalculator";
import StepUpSipCalculator from "@/components/calculators/StepUpSipCalculator";





export async function generateMetadata({ params }) {
  const locale = params?.locale || "en";

  // load localized common defaults and the page content (sipcalc.json)
  const common = (await import(`../../../../../messages/${locale}/common.json`).catch(() => ({}))).default || {};
  const stepUpSipCalc = (await import(`../../../../../messages/${locale}/stepUpSipCalc.json`).catch(() => ({}))).default || {};

  // use the seo block from stepUpSipCalc.json (user provided)
  const pageSeo = stepUpSipCalc.seo || {};

  // build opts for createMetadata (your lib/seo.js expects similar keys)
  const opts = {
    title: pageSeo.title || stepUpSipCalc.site?.heading || common.site?.name || SITE.name,
    description: pageSeo.description || common.site?.description || "",
    slug: pageSeo.slug || "",
    image: pageSeo.image || common.site?.defaultImage || "",
    locale,
    isArticle: Boolean(pageSeo.isArticle),
    publishDate: pageSeo.publishDate,
    modifiedDate: pageSeo.modifiedDate,
    faqs: stepUpSipCalc.faqs || [],
  };

  // createMetadata returns { title, description, openGraph, alternates, twitter, jsonLd }
  const meta = createMetadata(opts);

  // Build alternates/hreflang entries for all locales configured in SITE
  const alternates = { canonical: meta.openGraph.url, languages: {} };
  for (const lng of SITE.locales) {
    const other = (await import(`../../../../../messages/${lng}/stepUpSipCalc.json`).catch(() => ({}))).default || {};
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
  const stepUpSipCalc = (await import(`../../../../../messages/${locale}/stepUpSipCalc.json`)).default;


  // Build JSON-LD for FAQ (if any)
  const faqJsonLd =
    stepUpSipCalc.faqs && stepUpSipCalc.faqs.length
      ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: stepUpSipCalc.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
      : null;

  // Build Article JSON-LD if isArticle true
  const articleJsonLd = stepUpSipCalc.seo?.isArticle
    ? {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: stepUpSipCalc.seo?.title || stepUpSipCalc.site?.heading,
      description: stepUpSipCalc.seo?.description || "",
      author: { "@type": "Person", name: stepUpSipCalc.seo?.author || "Author" },
      datePublished: stepUpSipCalc.seo?.publishDate,
      dateModified: stepUpSipCalc.seo?.modifiedDate,
      image: stepUpSipCalc.seo?.image ? `${SITE.url}${stepUpSipCalc.seo.image}` : undefined,
      mainEntityOfPage: { "@type": "WebPage", "@id:": `${SITE.url}/${locale}/${stepUpSipCalc.seo?.slug || ""}` },
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
      <Heading title={"Step Up SIP Calculator"} />

      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 8 }}>
            <StepUpSipCalculator config={stepUpSipCalc} />
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

              <article aria-labelledby="what-is-stepup-sip-calculator" className="finance-article">
                <header>
                  <h2 id="what-is-stepup-sip-calculator" className="finance-sub-heading">
                    {stepUpSipCalc.article.intro.heading}
                  </h2>

                  {stepUpSipCalc.article.intro.paragraphs.map((para, idx) => (
                    <p key={idx}>{para}</p>
                  ))}
                </header>

                <section aria-labelledby="what-is-stepup-sip" className="finance-article-section">
                  <h3 id="what-is-stepup-sip" className="finance-sub-heading">
                    {stepUpSipCalc.article.whatIs.heading}
                  </h3>

                  {stepUpSipCalc.article.whatIs.paragraphs.map((para, idx) => (
                    <p key={idx}>{para}</p>
                  ))}
                </section>

                <section aria-labelledby="how-stepup-sip-helps" className="finance-article-section">
                  <h3 id="how-stepup-sip-helps" className="finance-sub-heading">
                    {stepUpSipCalc.article.howItHelps.heading}
                  </h3>

                  <p>{stepUpSipCalc.article.howItHelps.intro}</p>

                  <ul className="un-list">
                    {stepUpSipCalc.article.howItHelps.points.map((point, idx) => (
                      <li key={idx}>{point}</li>
                    ))}
                  </ul>

                  <p><em>{stepUpSipCalc.article.howItHelps.note}</em></p>
                </section>

                <section aria-labelledby="stepup-sip-formula" className="finance-article-section">
                  <h3 id="stepup-sip-formula" className="finance-sub-heading">
                    {stepUpSipCalc.article.formula.heading}
                  </h3>

                  <p>{stepUpSipCalc.article.formula.intro}</p>

                  {stepUpSipCalc.article.formula.methods.map((method, idx) => (
                    <div key={idx} className="formula-block">
                      <h4>{method.title}</h4>
                      <ul className="un-list">
                        {method.formulas.map((formula, fIdx) => (
                          <li key={fIdx}>
                            <code>{formula}</code>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}

                  <h4>Where:</h4>
                  <ul className="un-list">
                    {stepUpSipCalc.article.formula.definitions.map((def, idx) => (
                      <li key={idx}>{def}</li>
                    ))}
                  </ul>

                  <p><em>{stepUpSipCalc.article.formula.note}</em></p>
                </section>

                <section aria-labelledby="stepup-sip-inputs" className="finance-article-section">
                  <h3 id="stepup-sip-inputs" className="finance-sub-heading">
                    {stepUpSipCalc.article.inputs.heading}
                  </h3>

                  <p>{stepUpSipCalc.article.inputs.intro}</p>

                  <ol className="ou-list">
                    {stepUpSipCalc.article.inputs.list.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ol>

                  <p><em>{stepUpSipCalc.article.inputs.note}</em></p>
                </section>


                <section aria-labelledby="stepup-sip-calculation" className="finance-article-section">
                  <h3 id="stepup-sip-calculation" className="finance-sub-heading">
                    {stepUpSipCalc.article.calculation.heading}
                  </h3>

                  <p>{stepUpSipCalc.article.calculation.intro}</p>

                  {stepUpSipCalc.article.calculation.methods.map((method, idx) => (
                    <div key={idx} className="formula-block">
                      <h4>{method.title}</h4>
                      <ul className="un-list">
                        {method.formulas.map((formula, fIdx) => (
                          <li key={fIdx}><code>{formula}</code></li>
                        ))}
                      </ul>
                    </div>
                  ))}

                  <h4>Definitions:</h4>
                  <ul className="un-list">
                    {stepUpSipCalc.article.calculation.definitions.map((def, idx) => (
                      <li key={idx}>{def}</li>
                    ))}
                  </ul>

                  <p><em>{stepUpSipCalc.article.calculation.note}</em></p>
                </section>


                <section aria-labelledby="how-to-use-stepup-sip" className="finance-article-section">
                  <h3 id="how-to-use-stepup-sip" className="finance-sub-heading">
                    {stepUpSipCalc.article.howToUse.heading}
                  </h3>

                  <p>{stepUpSipCalc.article.howToUse.intro}</p>

                  <ol className="ou-list">
                    {stepUpSipCalc.article.howToUse.steps.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ol>

                  <p><em>{stepUpSipCalc.article.howToUse.note}</em></p>
                </section>

                <section aria-labelledby="stepup-sip-example" className="finance-article-section">
                  <h3 id="stepup-sip-example" className="finance-sub-heading">
                    {stepUpSipCalc.article.example.heading}
                  </h3>

                  <p>{stepUpSipCalc.article.example.intro}</p>

                  <ol className="ou-list">
                    {stepUpSipCalc.article.example.steps.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ol>

                  <p><em>{stepUpSipCalc.article.example.note}</em></p>
                </section>


                <section aria-labelledby="stepup-sip-advantages" className="finance-article-section">
                  <h3 id="stepup-sip-advantages" className="finance-sub-heading">
                    {stepUpSipCalc.article.advantages.heading}
                  </h3>

                  <p>{stepUpSipCalc.article.advantages.intro}</p>

                  <ul className="un-list">
                    {stepUpSipCalc.article.advantages.points.map((point, idx) => (
                      <li key={idx}>{point}</li>
                    ))}
                  </ul>

                  <p><em>{stepUpSipCalc.article.advantages.note}</em></p>
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