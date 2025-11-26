import { createMetadata, SITE } from "@/lib/seo";
import FAQAccordion from "@/components/common/FAQAccordion";
import { Box, Container, Grid, Paper } from "@mui/material";
import Heading from "@/components/common/Heading";
import PopularCalculators from "@/components/PopularCalculators";
import SipCalculator from "@/components/calculators/SipCalculator";
import Image from 'next/image';



export async function generateMetadata({ params }) {
  const locale = params?.locale || "en";

  // load localized common defaults and the page content (sipcalc.json)
  const common = (await import(`../../../../../messages/${locale}/common.json`).catch(() => ({}))).default || {};
  const lumpsumcalc = (await import(`../../../../../messages/${locale}/lumpsumcalc.json`).catch(() => ({}))).default || {};

  // use the seo block from lumpsumcalc.json (user provided)
  const pageSeo = lumpsumcalc.seo || {};

  // build opts for createMetadata (your lib/seo.js expects similar keys)
  const opts = {
    title: pageSeo.title || lumpsumcalc.site?.heading || common.site?.name || SITE.name,
    description: pageSeo.description || common.site?.description || "",
    slug: pageSeo.slug || "",
    image: pageSeo.image || common.site?.defaultImage || "",
    locale,
    isArticle: Boolean(pageSeo.isArticle),
    publishDate: pageSeo.publishDate,
    modifiedDate: pageSeo.modifiedDate,
    faqs: lumpsumcalc.faqs || [],
  };

  // createMetadata returns { title, description, openGraph, alternates, twitter, jsonLd }
  const meta = createMetadata(opts);

  // Build alternates/hreflang entries for all locales configured in SITE
  const alternates = { canonical: meta.openGraph.url, languages: {} };
  for (const lng of SITE.locales) {
    const other = (await import(`../../../../../messages/${lng}/lumpsumcalc.json`).catch(() => ({}))).default || {};
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
  const lumpsumcalc = (await import(`../../../../../messages/${locale}/lumpsumcalc.json`)).default;

  // Build JSON-LD for FAQ (if any)
  const faqJsonLd =
    lumpsumcalc.faqs && lumpsumcalc.faqs.length
      ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: lumpsumcalc.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
      : null;

  // Build Article JSON-LD if isArticle true
  const articleJsonLd = lumpsumcalc.seo?.isArticle
    ? {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: lumpsumcalc.seo?.title || lumpsumcalc.site?.heading,
      description: lumpsumcalc.seo?.description || "",
      author: { "@type": "Person", name: lumpsumcalc.seo?.author || "Author" },
      datePublished: lumpsumcalc.seo?.publishDate,
      dateModified: lumpsumcalc.seo?.modifiedDate,
      image: lumpsumcalc.seo?.image ? `${SITE.url}${lumpsumcalc.seo.image}` : undefined,
      mainEntityOfPage: { "@type": "WebPage", "@id:": `${SITE.url}/${locale}/${lumpsumcalc.seo?.slug || ""}` },
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

      <Heading title={lumpsumcalc.site?.headingLumpsum ?? "Lumpsum Calculator"} />

      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 8 }}>
            <SipCalculator sipcalc={lumpsumcalc} />
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
          {/* Main content column (article + calculator) */}
          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 8 }}>
            {/* <Paper elevation={0} sx={{ border: "none", borderRadius: 2, p: { xs: 2, md: 4 }, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}> */}

            <article aria-labelledby="lumpsum-intro" className="finance-article">

              <Image
                src={lumpsumcalc?.seo?.image}
                alt="From ₹0 to ₹1 Crore"
                className="img-fluid mb-4 img-rounded"
                width={763}
                height={429}
                layout="responsive"
                objectFit="contain"
                style={{ marginTop: '20px' }}
              />



              {/* --- Introduction to Lumpsum Investment --- */}
              <section aria-labelledby="lumpsum-intro">
                <h2 id="lumpsum-intro" className="finance-sub-heading">
                  {lumpsumcalc.article.introduction.heading}
                </h2>
                {lumpsumcalc.article.introduction.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </section>

              {/* --- What is a Lumpsum Calculator? --- */}
              <section aria-labelledby="lumpsum-what-is">
                <h2 id="lumpsum-what-is" className="finance-sub-heading">
                  {lumpsumcalc.article.whatIs.heading}
                </h2>
                {lumpsumcalc.article.whatIs.paragraphs.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </section>

              {/* --- How Does a Lumpsum Calculator Work? --- */}
              <section aria-labelledby="lumpsum-how-it-works">
                <h2 id="lumpsum-how-it-works" className="finance-sub-heading">
                  {lumpsumcalc.article.howItWorks.heading}
                </h2>

                <p>{lumpsumcalc.article.howItWorks.intro}</p>

                <ul className="ou-list">
                  {lumpsumcalc.article.howItWorks.inputs.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>

                <p>{lumpsumcalc.article.howItWorks.resultsIntro}</p>

                <ul className="ou-list">
                  {lumpsumcalc.article.howItWorks.results.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>

                <p><strong>{lumpsumcalc.article.howItWorks.exampleIntro}</strong></p>

                <ul className="ou-list">
                  <li>{lumpsumcalc.article.howItWorks.example.invested}</li>
                  <li>{lumpsumcalc.article.howItWorks.example.returns}</li>
                  <li>{lumpsumcalc.article.howItWorks.example.total}</li>
                </ul>

                <p>{lumpsumcalc.article.howItWorks.conclusion}</p>
              </section>

              <section aria-labelledby="lumpsum-types-of-returns">
                <h2 id="lumpsum-types-of-returns" className="finance-sub-heading">
                  {lumpsumcalc.article.typesOfReturns.heading}
                </h2>

                <p>{lumpsumcalc.article.typesOfReturns.intro}</p>

                <ol className="ou-list">
                  {lumpsumcalc.article.typesOfReturns.returns.map((r, idx) => (
                    <li key={idx}>
                      <strong>{r.title}.</strong> — {r.description}
                    </li>
                  ))}
                </ol>

                <p>{lumpsumcalc.article.typesOfReturns.conclusion}</p>
              </section>

              {/* --- Benefits of Using a Lumpsum Calculator --- */}
              <section aria-labelledby="lumpsum-benefits">
                <h2 id="lumpsum-benefits" className="finance-sub-heading">
                  {lumpsumcalc.article.benefits.heading}
                </h2>

                <p>{lumpsumcalc.article.benefits.intro}</p>

                <ol className="ou-list">
                  {lumpsumcalc.article.benefits.points.map((point, idx) => (
                    <li key={idx}>
                      <strong>{point.title}.</strong> — {point.description}
                    </li>
                  ))}
                </ol>

                <p>{lumpsumcalc.article.benefits.conclusion}</p>
              </section>


              {/* Integration JSX — insert inside your single <article> as a <section> */}
              <section aria-labelledby="lumpsum-how-to-use">
                <h2 id="lumpsum-how-to-use" className="finance-sub-heading">
                  {lumpsumcalc.article.howToUse.heading}
                </h2>

                <p>{lumpsumcalc.article.howToUse.intro}</p>

                <ol className="ou-list">
                  {lumpsumcalc.article.howToUse.steps.map((step, idx) => (
                    <li key={idx}>
                      <strong>{step.title}</strong> — {step.description}
                      {step.example && <div className="example" aria-hidden="true">{step.example}</div>}
                      {step.subpoints && (
                        <ul>
                          {step.subpoints.map((sp, sidx) => (
                            <li key={sidx}>{sp}</li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ol>

                <p>{lumpsumcalc.article.howToUse.conclusion}</p>
              </section>

              {/* --- Lumpsum vs SIP: Which is Better for You? --- */}
              <section aria-labelledby="lumpsum-vs-sip">
                <h2 id="lumpsum-vs-sip" className="finance-sub-heading">
                  {lumpsumcalc.article.sipVsLumpsum.heading}
                </h2>

                <p>{lumpsumcalc.article.sipVsLumpsum.intro}</p>

                <div>
                  <h3 className="finance-sub-heading-h4">{lumpsumcalc.article.sipVsLumpsum.lumpsum.title}</h3>
                  <p>{lumpsumcalc.article.sipVsLumpsum.lumpsum.description}</p>
                </div>

                <div>
                  <h3 className="finance-sub-heading-h4">{lumpsumcalc.article.sipVsLumpsum.sip.title}</h3>
                  <p>{lumpsumcalc.article.sipVsLumpsum.sip.description}</p>
                </div>

                <p><strong>Which is better?</strong> {lumpsumcalc.article.sipVsLumpsum.whichIsBetter}</p>
              </section>

              {/* --- Things to Keep in Mind Before Investing Lumpsum --- */}
              <section aria-labelledby="lumpsum-things-to-keep-in-mind">
                <h2 id="lumpsum-things-to-keep-in-mind" className="finance-sub-heading">
                  {lumpsumcalc.article.thingsToKeepInMind.heading}
                </h2>

                <p>{lumpsumcalc.article.thingsToKeepInMind.intro}</p>

                <ol className="ou-list">
                  {lumpsumcalc.article.thingsToKeepInMind.points.map((point, idx) => (
                    <li key={idx}>
                      <strong>{point.title}.</strong> — {point.description}
                    </li>
                  ))}
                </ol>

                <p>{lumpsumcalc.article.thingsToKeepInMind.conclusion}</p>
              </section>

              {/* --- Conclusion: Smarter Investing with a Lumpsum Calculator --- */}
              <section aria-labelledby="lumpsum-conclusion">
                <h2 id="lumpsum-conclusion" className="finance-sub-heading">
                  {lumpsumcalc.article.conclusion.heading}
                </h2>

                {lumpsumcalc.article.conclusion.paragraphs.map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </section>



            </article>





            <FAQAccordion faqs={lumpsumcalc?.faqs ?? []} />

            {/* </Paper> */}

          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 4 }}>

          </Grid>
        </Grid>
      </Box>
    </Container >
  </>
}