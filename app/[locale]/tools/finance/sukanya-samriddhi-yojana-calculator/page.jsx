import Heading from "@/components/common/Heading";
import PopularCalculators from "@/components/PopularCalculators";
import { Box, Container, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import SWPCalculator from "@/components/calculators/SWPCalculator";
import { createMetadata, SITE } from "@/lib/seo";
import FAQAccordion from "@/components/common/FAQAccordion";
import MFReturnCalculator from "@/components/calculators/MFReturnCalculator";
import SukanyaSamriddhiYojanaCalculator from "@/components/calculators/SukanyaSamriddhiYojanaCalculator";





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
  const ssycCalc = (await import(`../../../../../messages/${locale}/ssycCalc.json`)).default;

  // Build JSON-LD for FAQ (if any)
  const faqJsonLd =
    ssycCalc.faqs && ssycCalc.faqs.length
      ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: ssycCalc.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
      : null;

  // Build Article JSON-LD if isArticle true
  const articleJsonLd = ssycCalc.seo?.isArticle
    ? {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: ssycCalc.seo?.title || ssycCalc.site?.heading,
      description: ssycCalc.seo?.description || "",
      author: { "@type": "Person", name: ssycCalc.seo?.author || "Author" },
      datePublished: ssycCalc.seo?.publishDate,
      dateModified: ssycCalc.seo?.modifiedDate,
      image: ssycCalc.seo?.image ? `${SITE.url}${ssycCalc.seo.image}` : undefined,
      mainEntityOfPage: { "@type": "WebPage", "@id:": `${SITE.url}/${locale}/${ssycCalc.seo?.slug || ""}` },
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
      <Heading title={ssycCalc.site?.heading ?? "Mutual Fund Return Calculator"}  />

      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 8 }}>
            <SukanyaSamriddhiYojanaCalculator ssy={ssycCalc} />
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

              <article aria-labelledby="what-is-ssy-calculator" className="finance-article">
                <header>
                  <h2 id="what-is-ssy-calculator" className="finance-sub-heading">
                    {ssycCalc.article.whatIsHeading}
                  </h2>

                  {ssycCalc.article.whatIsParagraphs.map((para, idx) => (
                    <p key={idx}>{para}</p>
                  ))}
                </header>


                <section aria-labelledby={ssycCalc.article.whatIsSection.id}>
                  <h3 id={ssycCalc.article.whatIsSection.id} className="finance-sub-heading">
                    {ssycCalc.article.whatIsSection.heading}
                  </h3>

                  {ssycCalc.article.whatIsSection.paragraphs.map((para, index) => (
                    <p key={index}>{para}</p>
                  ))}

                  <ul className="ou-list">
                    {ssycCalc.article.whatIsSection.points.map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                  </ul>

                  <br />

                  <p>{ssycCalc.article.whatIsSection.conclusion}</p>
                </section>


                <section aria-labelledby={ssycCalc.article.eligibilitySection.id}>
                  <h3 id={ssycCalc.article.eligibilitySection.id} className="finance-sub-heading">
                    {ssycCalc.article.eligibilitySection.heading}
                  </h3>

                  <p>{ssycCalc.article.eligibilitySection.intro}</p>

                  <ul className="ou-list">
                    {ssycCalc.article.eligibilitySection.eligibilityPoints.map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                  </ul>

                  <h4 className="finance-sub-heading-h4">{ssycCalc.article.eligibilitySection.documentsHeading}</h4>
                  <ul className="ou-list">
                    {ssycCalc.article.eligibilitySection.documents.map((doc, index) => (
                      <li key={index}>{doc}</li>
                    ))}
                  </ul>

                  <p>{ssycCalc.article.eligibilitySection.conclusion}</p>
                </section>


                <section aria-labelledby={ssycCalc.article.whyUseSection.id}>
                  <h3 id={ssycCalc.article.whyUseSection.id} className="finance-sub-heading">
                    {ssycCalc.article.whyUseSection.heading}
                  </h3>

                  <p>{ssycCalc.article.whyUseSection.intro}</p>

                  <ul className="ou-list">
                    {ssycCalc.article.whyUseSection.points.map((point, index) => (
                      <li key={index}>
                        <strong>{point.title}</strong> — {point.description}
                      </li>
                    ))}
                  </ul>

                  <p>{ssycCalc.article.whyUseSection.conclusion}</p>
                </section>



                <section aria-labelledby={ssycCalc.article.howItWorksSection.id}>
                  <h3 id={ssycCalc.article.howItWorksSection.id} className="finance-sub-heading">
                    {ssycCalc.article.howItWorksSection.heading}
                  </h3>

                  {ssycCalc.article.howItWorksSection.paragraphs.map((para, index) => (
                    <p key={index}>{para}</p>
                  ))}

                  <div className="formula-block" style={{ margin: "16px 0", padding: "12px", background: "#f9fafb", borderRadius: "8px" }}>
                    <strong>{ssycCalc.article.howItWorksSection.formula.title}</strong>
                    <pre style={{ margin: "8px 0", fontFamily: "monospace" }}>
                      {ssycCalc.article.howItWorksSection.formula.body}
                    </pre>
                  </div>

                  <ul className="ou-list">
                    {ssycCalc.article.howItWorksSection.variables.map((v, i) => (
                      <li key={i}>
                        <strong>{v.symbol}</strong> = {v.description}
                      </li>
                    ))}
                  </ul>

                  <h4 className="finance-sub-heading-h4">{ssycCalc.article.howItWorksSection.exampleHeading}</h4>

                  {ssycCalc.article.howItWorksSection.exampleIntro.map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}

                  <ul className="ou-list">
                    {ssycCalc.article.howItWorksSection.exampleResults.map((result, i) => (
                      <li key={i}>{result}</li>
                    ))}
                  </ul>

                  <p>{ssycCalc.article.howItWorksSection.conclusion}</p>
                </section>


                <section aria-labelledby={ssycCalc.article.featuresSection.id}>
                  <h3 id={ssycCalc.article.featuresSection.id} className="finance-sub-heading">
                    {ssycCalc.article.featuresSection.heading}
                  </h3>

                  <ul className="ou-list">
                    {ssycCalc.article.featuresSection.points.map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                  </ul>

                  <p>{ssycCalc.article.featuresSection.conclusion}</p>
                </section>


                <section aria-labelledby={ssycCalc.article.taxBenefitsSection.id}>
                  <h3 id={ssycCalc.article.taxBenefitsSection.id} className="finance-sub-heading">
                    {ssycCalc.article.taxBenefitsSection.heading}
                  </h3>

                  <p>{ssycCalc.article.taxBenefitsSection.intro}</p>

                  <ul className="ou-list">
                    {ssycCalc.article.taxBenefitsSection.points.map((p, idx) => (
                      <li key={idx}>
                        <strong>{p.title}</strong> — {p.description}
                      </li>
                    ))}
                  </ul>

                  <p>{ssycCalc.article.taxBenefitsSection.conclusion}</p>
                </section>


                <section aria-labelledby={ssycCalc.article.howToUseSection.id}>
                  <h3 id={ssycCalc.article.howToUseSection.id} className="finance-sub-heading">
                    {ssycCalc.article.howToUseSection.heading}
                  </h3>

                  <p>{ssycCalc.article.howToUseSection.intro}</p>

                  <ol className="ou-list">
                    {ssycCalc.article.howToUseSection.steps.map((step, index) => (
                      <li key={index}>
                        <strong>{step.title}</strong> — {step.description}
                      </li>
                    ))}
                  </ol>
                </section>


                <section aria-labelledby={ssycCalc.article.benefitsOnlineSection.id}>
                  <h3 id={ssycCalc.article.benefitsOnlineSection.id} className="finance-sub-heading">
                    {ssycCalc.article.benefitsOnlineSection.heading}
                  </h3>

                  <p>{ssycCalc.article.benefitsOnlineSection.intro}</p>

                  <ul className="ou-list">
                    {ssycCalc.article.benefitsOnlineSection.points.map((point, index) => (
                      <li key={index}>
                        <strong>{point.title}</strong> — {point.description}
                      </li>
                    ))}
                  </ul>

                  <p>{ssycCalc.article.benefitsOnlineSection.conclusion}</p>
                </section>


                <section aria-labelledby={ssycCalc.article.maturitySection.id}>
                  <h3 id={ssycCalc.article.maturitySection.id} className="finance-sub-heading">
                    {ssycCalc.article.maturitySection.heading}
                  </h3>

                  <p>{ssycCalc.article.maturitySection.intro}</p>

                  <ul className="ou-list">
                    {ssycCalc.article.maturitySection.points.map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                  </ul>
                </section>


                <section aria-labelledby={ssycCalc.article.whyBestSection.id}>
                  <h3 id={ssycCalc.article.whyBestSection.id} className="finance-sub-heading">
                    {ssycCalc.article.whyBestSection.heading}
                  </h3>

                  <ul className="ou-list">
                    {ssycCalc.article.whyBestSection.points.map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                  </ul>
                </section>


                <section aria-labelledby={ssycCalc.article.finalThoughtsSection.id}>
                  <h3 id={ssycCalc.article.finalThoughtsSection.id} className="finance-sub-heading">
                    {ssycCalc.article.finalThoughtsSection.heading}
                  </h3>

                  {ssycCalc.article.finalThoughtsSection.paragraphs.map((para, index) => (
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