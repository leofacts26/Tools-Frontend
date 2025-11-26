import Heading from "@/components/common/Heading";
import PopularCalculators from "@/components/PopularCalculators";
import { Box, Container, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import SWPCalculator from "@/components/calculators/SWPCalculator";
import { createMetadata, SITE } from "@/lib/seo";
import FAQAccordion from "@/components/common/FAQAccordion";
import EPFCalculator from "@/components/calculators/EPFCalculator";
import GratuityCalculator from "@/components/calculators/GratuityCalculator";
import Image from 'next/image';





export async function generateMetadata({ params }) {
  const locale = params?.locale || "en";

  // load localized common defaults and the page content (sipcalc.json)
  const common = (await import(`../../../../../messages/${locale}/common.json`).catch(() => ({}))).default || {};
  const gratuityCalc = (await import(`../../../../../messages/${locale}/gratuityCalc.json`).catch(() => ({}))).default || {};

  // use the seo block from gratuityCalc.json (user provided)
  const pageSeo = gratuityCalc.seo || {};

  // build opts for createMetadata (your lib/seo.js expects similar keys)
  const opts = {
    title: pageSeo.title || gratuityCalc.site?.heading || common.site?.name || SITE.name,
    description: pageSeo.description || common.site?.description || "",
    slug: pageSeo.slug || "",
    image: pageSeo.image || common.site?.defaultImage || "",
    locale,
    isArticle: Boolean(pageSeo.isArticle),
    publishDate: pageSeo.publishDate,
    modifiedDate: pageSeo.modifiedDate,
    faqs: gratuityCalc.faqs || [],
  };

  // createMetadata returns { title, description, openGraph, alternates, twitter, jsonLd }
  const meta = createMetadata(opts);

  // Build alternates/hreflang entries for all locales configured in SITE
  const alternates = { canonical: meta.openGraph.url, languages: {} };
  for (const lng of SITE.locales) {
    const other = (await import(`../../../../../messages/${lng}/gratuityCalc.json`).catch(() => ({}))).default || {};
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
  const gratuityCalc = (await import(`../../../../../messages/${locale}/gratuityCalc.json`)).default;


  // Build JSON-LD for FAQ (if any)
  const faqJsonLd =
    gratuityCalc.faqs && gratuityCalc.faqs.length
      ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: gratuityCalc.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
      : null;

  // Build Article JSON-LD if isArticle true
  const articleJsonLd = gratuityCalc.seo?.isArticle
    ? {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: gratuityCalc.seo?.title || gratuityCalc.site?.heading,
      description: gratuityCalc.seo?.description || "",
      author: { "@type": "Person", name: gratuityCalc.seo?.author || "Author" },
      datePublished: gratuityCalc.seo?.publishDate,
      dateModified: gratuityCalc.seo?.modifiedDate,
      image: gratuityCalc.seo?.image ? `${SITE.url}${gratuityCalc.seo.image}` : undefined,
      mainEntityOfPage: { "@type": "WebPage", "@id:": `${SITE.url}/${locale}/${gratuityCalc.seo?.slug || ""}` },
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
      <Heading title={"Gratuity Calculator"} />

      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 8 }}>
            <GratuityCalculator config={gratuityCalc} />
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

            <article aria-labelledby="what-is-gratuity-calculator" className="finance-article">

              <Image
                src={gratuityCalc?.seo?.image}
                alt="Gratuity Calculator"
                className="img-fluid mb-4 img-rounded"
                width={763}
                height={429}
                layout="responsive"
                objectFit="contain"
                style={{ marginTop: '20px' }}
              />


              <header>
                <h2 id="what-is-gratuity-calculator" className="finance-sub-heading">
                  {gratuityCalc.article.intro.heading}
                </h2>

                {gratuityCalc.article.intro.paragraphs.map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </header>

              <section aria-labelledby="what-is-gratuity" className="finance-article-section">
                <h3 id="what-is-gratuity" className="finance-sub-heading">
                  {gratuityCalc.article.whatIs.heading}
                </h3>

                {gratuityCalc.article.whatIs.paragraphs.map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </section>

              <section aria-labelledby="gratuity-formula" className="finance-article-section">
                <h3 id="gratuity-formula" className="finance-sub-heading">
                  {gratuityCalc.article.formula.heading}
                </h3>

                <p>{gratuityCalc.article.formula.intro}</p>

                {gratuityCalc.article.formula.methods.map((method, idx) => (
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
                  {gratuityCalc.article.formula.definitions.map((def, idx) => (
                    <li key={idx}>{def}</li>
                  ))}
                </ul>

                <p><em>{gratuityCalc.article.formula.note}</em></p>
              </section>

              <section aria-labelledby="gratuity-how-it-helps" className="finance-article-section">
                <h3 id="gratuity-how-it-helps" className="finance-sub-heading">
                  {gratuityCalc.article.howItHelps.heading}
                </h3>

                <p>{gratuityCalc.article.howItHelps.intro}</p>

                <ul className="un-list">
                  {gratuityCalc.article.howItHelps.points.map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>

                <p><em>{gratuityCalc.article.howItHelps.note}</em></p>
              </section>

              <section aria-labelledby="gratuity-inputs" className="finance-article-section">
                <h3 id="gratuity-inputs" className="finance-sub-heading">
                  {gratuityCalc.article.inputs.heading}
                </h3>

                <p>{gratuityCalc.article.inputs.intro}</p>

                <ol className="ou-list">
                  {gratuityCalc.article.inputs.list.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ol>

                <p><em>{gratuityCalc.article.inputs.note}</em></p>
              </section>

              <section aria-labelledby="how-to-use-gratuity" className="finance-article-section">
                <h3 id="how-to-use-gratuity" className="finance-sub-heading">
                  {gratuityCalc.article.howToUse.heading}
                </h3>

                <p>{gratuityCalc.article.howToUse.intro}</p>

                <ol className="ou-list">
                  {gratuityCalc.article.howToUse.steps.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>

                <p><em>{gratuityCalc.article.howToUse.note}</em></p>
              </section>

              <section aria-labelledby="gratuity-example" className="finance-article-section">
                <h3 id="gratuity-example" className="finance-sub-heading">
                  {gratuityCalc.article.example.heading}
                </h3>

                <p>{gratuityCalc.article.example.intro}</p>

                <ol className="ou-list">
                  {gratuityCalc.article.example.steps.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>

                <p><em>{gratuityCalc.article.example.note}</em></p>
              </section>


              <section aria-labelledby="gratuity-taxation" className="finance-article-section">
                <h3 id="gratuity-taxation" className="finance-sub-heading">
                  {gratuityCalc.article.taxation.heading}
                </h3>

                {gratuityCalc.article.taxation.paragraphs.map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </section>

              <section aria-labelledby="gratuity-advantages" className="finance-article-section">
                <h3 id="gratuity-advantages" className="finance-sub-heading">
                  {gratuityCalc.article.advantages.heading}
                </h3>

                <p>{gratuityCalc.article.advantages.intro}</p>

                <ul className="un-list">
                  {gratuityCalc.article.advantages.points.map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>

                <p><em>{gratuityCalc.article.advantages.note}</em></p>
              </section>

              <section aria-labelledby="gratuity-notes" className="finance-article-section">
                <h3 id="gratuity-notes" className="finance-sub-heading">
                  {gratuityCalc.article.notes.heading}
                </h3>

                <ul className="un-list">
                  {gratuityCalc.article.notes.points.map((note, idx) => (
                    <li key={idx}>{note}</li>
                  ))}
                </ul>
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