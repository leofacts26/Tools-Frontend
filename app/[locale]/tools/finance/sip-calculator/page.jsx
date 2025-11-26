import { createMetadata, SITE } from "@/lib/seo";
import FAQAccordion from "@/components/common/FAQAccordion";
import { Box, Container, Grid, Paper } from "@mui/material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import PopularCalculators from "@/components/PopularCalculators";
import Heading from "@/components/common/Heading";
import SipCalculator from "@/components/calculators/SipCalculator";
import FormulaBlock from "@/components/common/FormulaBlock";
import Image from 'next/image';



export async function generateMetadata({ params }) {
  const locale = params?.locale || "en";

  // load localized common defaults and the page content (sipcalc.json)
  const common = (await import(`../../../../../messages/${locale}/common.json`).catch(() => ({}))).default || {};
  const sipcalc = (await import(`../../../../../messages/${locale}/sipcalc.json`).catch(() => ({}))).default || {};

  // use the seo block from sipcalc.json (user provided)
  const pageSeo = sipcalc.seo || {};

  // build opts for createMetadata (your lib/seo.js expects similar keys)
  const opts = {
    title: pageSeo.title || sipcalc.site?.heading || common.site?.name || SITE.name,
    description: pageSeo.description || common.site?.description || "",
    slug: pageSeo.slug || "",
    image: pageSeo.image || common.site?.defaultImage || "",
    locale,
    isArticle: Boolean(pageSeo.isArticle),
    publishDate: pageSeo.publishDate,
    modifiedDate: pageSeo.modifiedDate,
    faqs: sipcalc.faqs || [],
  };

  // createMetadata returns { title, description, openGraph, alternates, twitter, jsonLd }
  const meta = createMetadata(opts);

  // Build alternates/hreflang entries for all locales configured in SITE
  const alternates = { canonical: meta.openGraph.url, languages: {} };
  for (const lng of SITE.locales) {
    const other = (await import(`../../../../../messages/${lng}/sipcalc.json`).catch(() => ({}))).default || {};
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
  const sipcalc = (await import(`../../../../../messages/${locale}/sipcalc.json`)).default;

  // Build JSON-LD for FAQ (if any)
  const faqJsonLd =
    sipcalc.faqs && sipcalc.faqs.length
      ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: sipcalc.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
      : null;

  // Build Article JSON-LD if isArticle true
  const articleJsonLd = sipcalc.seo?.isArticle
    ? {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: sipcalc.seo?.title || sipcalc.site?.heading,
      description: sipcalc.seo?.description || "",
      author: { "@type": "Person", name: sipcalc.seo?.author || "Author" },
      datePublished: sipcalc.seo?.publishDate,
      dateModified: sipcalc.seo?.modifiedDate,
      image: sipcalc.seo?.image ? `${SITE.url}${sipcalc.seo.image}` : undefined,
      mainEntityOfPage: { "@type": "WebPage", "@id:": `${SITE.url}/${locale}/${sipcalc.seo?.slug || ""}` },
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
      <Heading title={sipcalc.site?.heading ?? "SIP Calculator"} />

      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 8 }}>
            <SipCalculator sipcalc={sipcalc} />
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

            <article aria-labelledby="What is a SIP Calculator & Why You Need It?" className="finance-article">

              <Image
                src={sipcalc?.seo?.image}
                alt="SIP Calculator - Systematic Investment Plan"
                className="img-fluid mb-4 img-rounded"
                width={763}
                height={429}
                layout="responsive"
                objectFit="contain"
                style={{ marginTop: '20px' }}
              />


              <header>
                <h2 id="What is a SIP Calculator & Why You Need It?" className="finance-sub-heading">
                  {sipcalc.article.whatIsHeading}
                </h2>
                <p>
                  {sipcalc.article.whatIsParagraph}
                </p>
              </header>

              <section aria-labelledby="how-it-works">
                <h3 id="how-it-works" className="finance-sub-heading">{sipcalc.article.howItWorks.heading}</h3>
                <p>
                  {sipcalc.article.howItWorks.paragraph1}
                </p>

                <FormulaBlock
                  title={sipcalc.article.howItWorks.formula.title}
                  formula={sipcalc.article.howItWorks.formula.body}
                />

                <p>
                  <strong>Example:</strong> {sipcalc.article.howItWorks.example}
                </p>
              </section>

              <section aria-labelledby="benefits">
                <h3 id="benefits" className="finance-sub-heading">{sipcalc.article.benefits.heading}</h3>
                <ul className="ou-list">
                  {sipcalc.article.benefits.points.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </section>

              <section aria-labelledby="benefits" >
                <h3 id="benefits" className="finance-sub-heading">{sipcalc.article.benefitsOnline.heading}</h3>
                <p>
                  {sipcalc.article.benefitsOnline.intro}
                </p>
                <ol className="ou-list">
                  {sipcalc.article.benefitsOnline.points.map((point, index) => (
                    <li key={index}>
                      <strong>{point.title}</strong> — {point.description}
                    </li>
                  ))}
                </ol>

                <p>
                  {sipcalc.article.benefitsOnline.conclusion}
                </p>
              </section>

              <section aria-labelledby="sip-formula">
                <h3 id="sip-formula" className="finance-sub-heading">{sipcalc.article.formulaExplained.heading}</h3>
                <p>
                  {sipcalc.article.formulaExplained.intro}
                </p>

                <FormulaBlock
                  title={sipcalc.article.formulaExplained.formula.title}
                  formula={sipcalc.article.formulaExplained.formula.body}
                />
                <p>
                  <strong>Example:</strong> {sipcalc.article.formulaExplained.exampleIntro}
                </p>

                <TableContainer component={Paper}>
                  <Table aria-label="SIP Table">
                    <TableHead>
                      <TableRow>
                        {sipcalc.article.formulaExplained.table.headers.map((header, index) => (
                          <TableCell key={index} style={{ fontWeight: "600" }}>
                            {header}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {sipcalc.article.formulaExplained.table.rows.map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                          {row.map((cell, cellIndex) => (
                            <TableCell key={cellIndex}>{cell}</TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <br />

                <p>{sipcalc.article.formulaExplained.conclusion}</p>
              </section>

              <section aria-labelledby="sip-vs-lumpsum">
                <h3 id="sip-vs-lumpsum" className="finance-sub-heading">{sipcalc.article.sipVsLumpsum.heading}</h3>
                <p>
                  {sipcalc.article.sipVsLumpsum.intro}
                </p>

                <div>
                  <h4 className="finance-sub-heading-h4">{sipcalc.article.sipVsLumpsum.sip.title}</h4>
                  <ul className="ou-list">
                    {sipcalc.article.sipVsLumpsum.sip.points.map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="finance-sub-heading-h4">{sipcalc.article.sipVsLumpsum.lumpsum.title}</h4>
                  <ul className="ou-list">
                    {sipcalc.article.sipVsLumpsum.lumpsum.points.map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                  </ul>
                </div>

                <aside aria-labelledby="key-difference">
                  <h4 id="key-difference" className="finance-sub-heading-h4"> {sipcalc.article.sipVsLumpsum.keyDifference.title}</h4>
                  <p>
                    {sipcalc.article.sipVsLumpsum.keyDifference.points.map((point, index) => (
                      <span key={index}>
                        <strong>{point.label}</strong> → {point.description}
                        <br />
                      </span>
                    ))}
                  </p>
                </aside>

                <p>
                  {sipcalc.article.sipVsLumpsum.conclusion}
                </p>
              </section>

              <section aria-labelledby="how-to-use">
                <h3 id="how-to-use" className="finance-sub-heading">{sipcalc.article.howToUse.heading}</h3>
                <p>
                  {sipcalc.article.howToUse.intro}
                </p>

                <ol className="ou-list">
                  {sipcalc.article.howToUse.steps.map((step, index) => (
                    <li key={index}>
                      <strong>{step.title}</strong> — {step.description}
                      {step.subpoints && (
                        <ul>
                          {step.subpoints.map((sub, subIndex) => (
                            <li key={subIndex}>{sub}</li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ol>

                <p>{sipcalc.article.howToUse.conclusion}</p>

              </section>

              <section aria-labelledby="sip-vs-manual">
                <h3 id="sip-vs-manual" className="finance-sub-heading">{sipcalc.article.sipVsManual.heading}</h3>
                <p>
                  {sipcalc.article.sipVsManual.intro}
                </p>

                <ol className="ou-list">
                  {sipcalc.article.sipVsManual.points.map((point, index) => (
                    <li key={index}>
                      <strong>{point.title}</strong> — {point.description}
                    </li>
                  ))}
                </ol>

                <p>{sipcalc.article.sipVsManual.conclusion}</p>
              </section>

              <section aria-labelledby="reasons-to-use">
                <h3 id="reasons-to-use" className="finance-sub-heading">{sipcalc.article.reasonsToUse.heading}</h3>
                <p>
                  {sipcalc.article.reasonsToUse.intro}
                </p>

                <ol className="ou-list">
                  {sipcalc.article.reasonsToUse.points.map((point, index) => (
                    <li key={index}>
                      <strong>{point.title}</strong> — {point.description}
                    </li>
                  ))}
                </ol>

                <p>{sipcalc.article.reasonsToUse.conclusion}</p>
              </section>

              <section aria-labelledby="sip-mistakes">
                <h3 id="sip-mistakes" className="finance-sub-heading">{sipcalc.article.sipMistakes.heading}</h3>
                <p>{sipcalc.article.sipMistakes.intro}</p>

                <ol className="ou-list">
                  {sipcalc.article.sipMistakes.points.map((point, index) => (
                    <li key={index}>
                      <strong>{point.title}</strong> — {point.description}
                    </li>
                  ))}
                </ol>

                <p>{sipcalc.article.sipMistakes.conclusion}</p>
              </section>

              <section aria-labelledby="final-thoughts">
                <h3 id="final-thoughts" className="finance-sub-heading">{sipcalc.article.finalThoughts.heading}</h3>
                {sipcalc.article.finalThoughts.paragraphs.map((para, index) => (
                  <p key={index}>{para}</p>
                ))}
              </section>


            </article>
            <FAQAccordion faqs={sipcalc?.faqs ?? []} />

            {/* </Paper> */}
          </Grid>

          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 4 }}>
          </Grid>

        </Grid>
      </Box>
    </Container >
  </>
}