import Heading from "@/components/common/Heading";
import PopularCalculators from "@/components/PopularCalculators";
import { Box, Container, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import SWPCalculator from "@/components/calculators/SWPCalculator";
import { createMetadata, SITE } from "@/lib/seo";
import FAQAccordion from "@/components/common/FAQAccordion";
import MFReturnCalculator from "@/components/calculators/MFReturnCalculator";
import FDCalculator from "@/components/calculators/FDCalculator";
import RDCalculator from "@/components/calculators/RDCalculator";
import Image from 'next/image';




export async function generateMetadata({ params }) {
  // ⛔ params is async — you MUST await it
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || "en";


  // load localized common defaults and the page content (sipcalc.json)
  const common = (await import(`../../../../../messages/${locale}/common.json`).catch(() => ({}))).default || {};
  const rdCalc = (await import(`../../../../../messages/${locale}/rdCalc.json`).catch(() => ({}))).default || {};

  // use the seo block from rdCalc.json (user provided)
  const pageSeo = rdCalc.seo || {};

  // build opts for createMetadata (your lib/seo.js expects similar keys)
  const opts = {
    title: pageSeo.title || rdCalc.site?.heading || common.site?.name || SITE.name,
    description: pageSeo.description || common.site?.description || "",
    slug: pageSeo.slug || "",
    image: pageSeo.image || common.site?.defaultImage || "",
    locale,
    isArticle: Boolean(pageSeo.isArticle),
    publishDate: pageSeo.publishDate,
    modifiedDate: pageSeo.modifiedDate,
    faqs: rdCalc.faqs || [],
  };

  // createMetadata returns { title, description, openGraph, alternates, twitter, jsonLd }
  const meta = createMetadata(opts);

  // Build alternates/hreflang entries for all locales configured in SITE
  const alternates = { canonical: meta.openGraph.url, languages: {} };
  for (const lng of SITE.locales) {
    const other = (await import(`../../../../../messages/${lng}/rdCalc.json`).catch(() => ({}))).default || {};
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
  const rdCalc = (await import(`../../../../../messages/${locale}/rdCalc.json`)).default;



  // Build JSON-LD for FAQ (if any)
  const faqJsonLd =
    rdCalc.faqs && rdCalc.faqs.length
      ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: rdCalc.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
      : null;

  // Build Article JSON-LD if isArticle true
  const articleJsonLd = rdCalc.seo?.isArticle
    ? {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: rdCalc.seo?.title || rdCalc.site?.heading,
      description: rdCalc.seo?.description || "",
      author: { "@type": "Person", name: rdCalc.seo?.author || "Author" },
      datePublished: rdCalc.seo?.publishDate,
      dateModified: rdCalc.seo?.modifiedDate,
      image: rdCalc.seo?.image ? `${SITE.url}${rdCalc.seo.image}` : undefined,
      mainEntityOfPage: { "@type": "WebPage", "@id:": `${SITE.url}/${locale}/${rdCalc.seo?.slug || ""}` },
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
      <Heading title={rdCalc.site?.heading ?? "rdCalc Calculator"} />

      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 8 }}>
            <RDCalculator rd={rdCalc} />
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

            <article aria-labelledby="what-is-rd-calculator" className="finance-article">

              <Image
                src={rdCalc?.seo?.image}
                alt="RD Calculator - Recurring Deposit Calculator Online India"
                className="img-fluid mb-4 img-rounded"
                width={763}
                height={429}
                layout="responsive"
                objectFit="contain"
                style={{ marginTop: '20px' }}
              />


              <header>
                <h2 id="what-is-rd-calculator" className="finance-sub-heading">
                  {rdCalc.article.intro.heading}
                </h2>

                {rdCalc.article.intro.paragraphs.map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </header>

              <section aria-labelledby={rdCalc.article.whatIsSection.id}>
                <h3 id={rdCalc.article.whatIsSection.id} className="finance-sub-heading">
                  {rdCalc.article.whatIsSection.heading}
                </h3>

                {rdCalc.article.whatIsSection.paragraphs.map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </section>

              <section aria-labelledby={rdCalc.article.whyUseSection.id}>
                <h3 id={rdCalc.article.whyUseSection.id} className="finance-sub-heading">
                  {rdCalc.article.whyUseSection.heading}
                </h3>

                <p>{rdCalc.article.whyUseSection.intro}</p>

                <ul className="ou-list">
                  {rdCalc.article.whyUseSection.points.map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>

                <p>{rdCalc.article.whyUseSection.conclusion}</p>
              </section>

              <section aria-labelledby={rdCalc.article.howItWorksSection.id}>
                <h3 id={rdCalc.article.howItWorksSection.id} className="finance-sub-heading">
                  {rdCalc.article.howItWorksSection.heading}
                </h3>

                {rdCalc.article.howItWorksSection.paragraphs.map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </section>

              <section aria-labelledby={rdCalc.article.inputsSection.id}>
                <h3 id={rdCalc.article.inputsSection.id} className="finance-sub-heading">
                  {rdCalc.article.inputsSection.heading}
                </h3>

                <p>{rdCalc.article.inputsSection.intro}</p>

                <ol className="ou-list">
                  {rdCalc.article.inputsSection.points.map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ol>

                <p>{rdCalc.article.inputsSection.conclusion}</p>
              </section>

              <section aria-labelledby={rdCalc.article.formulaSection.id}>
                <h3 id={rdCalc.article.formulaSection.id} className="finance-sub-heading">
                  {rdCalc.article.formulaSection.heading}
                </h3>

                <p>{rdCalc.article.formulaSection.intro}</p>

                <ol className="ou-list">
                  {rdCalc.article.formulaSection.steps.map((step, idx) => (
                    <li key={idx}>
                      <pre style={{ fontFamily: "monospace", margin: "4px 0" }}>{step}</pre>
                    </li>
                  ))}
                </ol>

                <ul className="ou-list">
                  {rdCalc.article.formulaSection.notes.map((note, idx) => (
                    <li key={idx}>
                      <em>{note}</em>
                    </li>
                  ))}
                </ul>
              </section>

              <section aria-labelledby={rdCalc.article.stepsSection.id}>
                <h3 id={rdCalc.article.stepsSection.id} className="finance-sub-heading">
                  {rdCalc.article.stepsSection.heading}
                </h3>

                <p>{rdCalc.article.stepsSection.intro}</p>

                <ol className="ou-list">
                  {rdCalc.article.stepsSection.steps.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>

                <p>{rdCalc.article.stepsSection.conclusion}</p>
              </section>

              <section aria-labelledby={rdCalc.article.exampleSection.id}>
                <h3 id={rdCalc.article.exampleSection.id} className="finance-sub-heading">
                  {rdCalc.article.exampleSection.heading}
                </h3>

                <p>{rdCalc.article.exampleSection.intro}</p>

                <ol className="ou-list">
                  {rdCalc.article.exampleSection.steps.map((step, idx) => (
                    <li key={idx}>
                      <pre style={{ fontFamily: "monospace", margin: "4px 0" }}>{step}</pre>
                    </li>
                  ))}
                </ol>

                <p>{rdCalc.article.exampleSection.conclusion}</p>
              </section>

              <section aria-labelledby={rdCalc.article.typesSection.id}>
                <h3 id={rdCalc.article.typesSection.id} className="finance-sub-heading">
                  {rdCalc.article.typesSection.heading}
                </h3>

                <p>{rdCalc.article.typesSection.intro}</p>

                <ul className="ou-list">
                  {rdCalc.article.typesSection.points.map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>

                <p>{rdCalc.article.typesSection.conclusion}</p>
              </section>

              <section aria-labelledby={rdCalc.article.seniorRatesRDSection.id}>
                <h3 id={rdCalc.article.seniorRatesRDSection.id} className="finance-sub-heading">
                  {rdCalc.article.seniorRatesRDSection.heading}
                </h3>

                <p>{rdCalc.article.seniorRatesRDSection.intro}</p>

                <ol className="ou-list">
                  {rdCalc.article.seniorRatesRDSection.steps.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>

                <h4 className="finance-sub-heading-h4">{rdCalc.article.seniorRatesRDSection.example.title}</h4>
                <p>{rdCalc.article.seniorRatesRDSection.example.body}</p>

                <p>{rdCalc.article.seniorRatesRDSection.conclusion}</p>
              </section>

              <section aria-labelledby={rdCalc.article.withdrawalsPrematureTaxSection.id}>
                <h3 id={rdCalc.article.withdrawalsPrematureTaxSection.id} className="finance-sub-heading">
                  {rdCalc.article.withdrawalsPrematureTaxSection.heading}
                </h3>

                <p>{rdCalc.article.withdrawalsPrematureTaxSection.intro}</p>

                <ul className="ou-list">
                  {rdCalc.article.withdrawalsPrematureTaxSection.points.map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>

                <div style={{ marginTop: 12 }}>
                  <h4 className="finance-sub-heading-h4">{rdCalc.article.withdrawalsPrematureTaxSection.formulaAdjustment.title}</h4>
                  <p>{rdCalc.article.withdrawalsPrematureTaxSection.formulaAdjustment.explanation}</p>
                  <pre style={{ margin: "8px 0", fontFamily: "monospace" }}>
                    {rdCalc.article.withdrawalsPrematureTaxSection.formulaAdjustment.expression}
                  </pre>
                </div>

                <h4 className="finance-sub-heading-h4">{rdCalc.article.withdrawalsPrematureTaxSection.example.title}</h4>
                <p>{rdCalc.article.withdrawalsPrematureTaxSection.example.body}</p>

                <p><em>{rdCalc.article.withdrawalsPrematureTaxSection.note}</em></p>

                <p>{rdCalc.article.withdrawalsPrematureTaxSection.conclusion}</p>
              </section>

              <section aria-labelledby={rdCalc.article.benefitsSection.id}>
                <h3 id={rdCalc.article.benefitsSection.id} className="finance-sub-heading">
                  {rdCalc.article.benefitsSection.heading}
                </h3>

                <p>{rdCalc.article.benefitsSection.intro}</p>

                <ul className="ou-list">
                  {rdCalc.article.benefitsSection.points.map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>

                <p>{rdCalc.article.benefitsSection.conclusion}</p>
              </section>




            </article>
            <FAQAccordion faqs={rdCalc?.faqs ?? []} title="RD (Recurring Deposit) Calculator: FAQs" />



            {/* </Paper> */}
          </Grid>

          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 4 }}>
          </Grid>

        </Grid>
      </Box>
    </Container >






  </>
}