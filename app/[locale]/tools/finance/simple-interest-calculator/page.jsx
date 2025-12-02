import Heading from "@/components/common/Heading";
import PopularCalculators from "@/components/PopularCalculators";
import { Box, Container, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import SWPCalculator from "@/components/calculators/SWPCalculator";
import { createMetadata, SITE } from "@/lib/seo";
import FAQAccordion from "@/components/common/FAQAccordion";
import MFReturnCalculator from "@/components/calculators/MFReturnCalculator";
import SimpleIntrestCalculator from "@/components/calculators/SimpleIntrestCalculator";
import Image from 'next/image';





export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || SITE.defaultLocale;

  // Load localized JSON content
  const common =
    (await import(
      `../../../../../messages/${locale}/common.json`
    ).catch(() => ({}))).default || {};

  const pageContent =
    (await import(
      `../../../../../messages/${locale}/sicCalc.json`
    ).catch(() => ({}))).default || {};

  const pageSeo = pageContent.seo || {};

  const opts = {
    title:
      pageSeo.title ||
      pageContent.site?.heading ||
      common.site?.name ||
      SITE.name,

    description: pageSeo.description || common.site?.description || "",

    slug: pageSeo.slug || "sic-calculator", // fallback slug

    image: pageSeo.image || common.site?.defaultImage || "",

    locale,

    isArticle: Boolean(pageSeo.isArticle),

    faqs: pageContent.faqs || [],
  };

  return createMetadata(opts);
}




export default async function Page({ params }) {

  const resolvedParams = await params;     // 🔥 FIX
  const locale = resolvedParams.locale;
  const sicCalc = (await import(`../../../../../messages/${locale}/sicCalc.json`)).default;

  // Build JSON-LD for FAQ (if any)
  const faqJsonLd =
    sicCalc.faqs && sicCalc.faqs.length
      ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: sicCalc.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
      : null;

  // Build Article JSON-LD if isArticle true
  const articleJsonLd = sicCalc.seo?.isArticle
    ? {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: sicCalc.seo?.title || sicCalc.site?.heading,
      description: sicCalc.seo?.description || "",
      author: { "@type": "Person", name: sicCalc.seo?.author || "Author" },
      datePublished: sicCalc.seo?.publishDate,
      dateModified: sicCalc.seo?.modifiedDate,
      image: sicCalc.seo?.image ? `${SITE.url}${sicCalc.seo.image}` : undefined,
      mainEntityOfPage: { "@type": "WebPage", "@id:": `${SITE.url}/${locale}/${sicCalc.seo?.slug || ""}` },
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
      <Heading title={"Simple Intrest Calculator"} />

      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 8 }}>
            <SimpleIntrestCalculator si={sicCalc} />
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

            <article aria-labelledby="what-is-sic-calculator" className="finance-article">

              <Image
                src={sicCalc?.seo?.image}
                alt="Simple Interest Calculator"
                className="img-fluid mb-4 img-rounded"
                width={763}
                height={429}
                layout="responsive"
                objectFit="contain"
                style={{ marginTop: '20px' }}
              />


              <header>
                <h2 id="what-is-sic-calculator" className="finance-sub-heading">
                  {sicCalc.article.intro.heading}
                </h2>

                {sicCalc.article.intro.paragraphs.map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </header>

              <section aria-labelledby="what-is-simple-interest" className="finance-article-section">
                <h3 id="what-is-simple-interest" className="finance-sub-heading">
                  {sicCalc.article.whatIs.heading}
                </h3>

                {sicCalc.article.whatIs.paragraphs.map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </section>

              <section aria-labelledby="simple-interest-formula" className="finance-article-section">
                <h3 id="simple-interest-formula" className="finance-sub-heading">
                  {sicCalc.article.formula.heading}
                </h3>

                <p>{sicCalc.article.formula.intro}</p>

                {sicCalc.article.formula.methods.map((method, idx) => (
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
                  {sicCalc.article.formula.definitions.map((def, idx) => (
                    <li key={idx}>{def}</li>
                  ))}
                </ul>

                <p><em>{sicCalc.article.formula.note}</em></p>
              </section>

              <section aria-labelledby={sicCalc.article.howToCalculate.id}>
                <h3 id={sicCalc.article.howToCalculate.id} className="finance-sub-heading">
                  {sicCalc.article.howToCalculate.heading}
                </h3>

                <p>{sicCalc.article.howToCalculate.intro}</p>

                <ol className="ou-list">
                  {sicCalc.article.howToCalculate.steps.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>

                <h4 className="finance-sub-heading-h4">Optional features</h4>
                <ul className="ou-list">
                  {sicCalc.article.howToCalculate.optionalFeatures.map((f, idx) => (
                    <li key={idx}>{f}</li>
                  ))}
                </ul>

                <p><em>{sicCalc.article.howToCalculate.note}</em></p>
              </section>

              <section aria-labelledby="simple-interest-benefits" className="finance-article-section">
                <h3 id="simple-interest-benefits" className="finance-sub-heading">
                  {sicCalc.article.benefits.heading}
                </h3>

                <p>{sicCalc.article.benefits.intro}</p>

                <ul className="un-list">
                  {sicCalc.article.benefits.points.map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>

                <p><em>{sicCalc.article.benefits.note}</em></p>
              </section>

              <section aria-labelledby="simple-interest-advantages" className="finance-article-section">
                <h3 id="simple-interest-advantages" className="finance-sub-heading">
                  {sicCalc.article.advantages.heading}
                </h3>

                <p>{sicCalc.article.advantages.intro}</p>

                <ul className="un-list">
                  {sicCalc.article.advantages.points.map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>

                <p><em>{sicCalc.article.advantages.note}</em></p>
              </section>

              <section aria-labelledby="simple-interest-steps" className="finance-article-section">
                <h3 id="simple-interest-steps" className="finance-sub-heading">
                  {sicCalc.article.steps.heading}
                </h3>

                <p>{sicCalc.article.steps.intro}</p>

                <ol className="ou-list">
                  {sicCalc.article.steps.list.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>

                <p><em>{sicCalc.article.steps.note}</em></p>
              </section>

              <section aria-labelledby="simple-interest-example" className="finance-article-section">
                <h3 id="simple-interest-example" className="finance-sub-heading">
                  {sicCalc.article.example.heading}
                </h3>

                <p>{sicCalc.article.example.intro}</p>

                <ol className="ou-list">
                  {sicCalc.article.example.steps.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>

                <p><em>{sicCalc.article.example.note}</em></p>
              </section>

              <section aria-labelledby="simple-vs-compound" className="finance-article-section">
                <h3 id="simple-vs-compound" className="finance-sub-heading">
                  {sicCalc.article.decision.heading}
                </h3>

                <p>{sicCalc.article.decision.intro}</p>

                <h4>{sicCalc.article.decision.simpleUse.title}</h4>
                <ul className="un-list">
                  {sicCalc.article.decision.simpleUse.points.map((point, idx) => (
                    <li key={`simple-${idx}`}>{point}</li>
                  ))}
                </ul>

                <h4>{sicCalc.article.decision.compoundUse.title}</h4>
                <ul className="un-list">
                  {sicCalc.article.decision.compoundUse.points.map((point, idx) => (
                    <li key={`compound-${idx}`}>{point}</li>
                  ))}
                </ul>

                <p><em>{sicCalc.article.decision.note}</em></p>
              </section>


            </article>

            <FAQAccordion faqs={sicCalc?.faqs ?? []} title="Simple Interest Calculator: FAQs" />




            {/* </Paper> */}
          </Grid>

          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 4 }}>
          </Grid>

        </Grid>
      </Box>
    </Container >





  </>
}