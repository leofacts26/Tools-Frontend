import Heading from "@/components/common/Heading";
import PopularCalculators from "@/components/PopularCalculators";
import { Box, Container, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import SWPCalculator from "@/components/calculators/SWPCalculator";
import { createMetadata, SITE } from "@/lib/seo";
import FAQAccordion from "@/components/common/FAQAccordion";
import MFReturnCalculator from "@/components/calculators/MFReturnCalculator";
import FDCalculator from "@/components/calculators/FDCalculator";
import RDCalculator from "@/components/calculators/RDCalculator";
import NSCCalculator from "@/components/calculators/NSCCalculator";
import Image from 'next/image';





export async function generateMetadata({ params }) {
  const locale = params?.locale || "en";

  // load localized common defaults and the page content (sipcalc.json)
  const common = (await import(`../../../../../messages/${locale}/common.json`).catch(() => ({}))).default || {};
  const nscCalc = (await import(`../../../../../messages/${locale}/nscCalc.json`).catch(() => ({}))).default || {};

  // use the seo block from nscCalc.json (user provided)
  const pageSeo = nscCalc.seo || {};

  // build opts for createMetadata (your lib/seo.js expects similar keys)
  const opts = {
    title: pageSeo.title || nscCalc.site?.heading || common.site?.name || SITE.name,
    description: pageSeo.description || common.site?.description || "",
    slug: pageSeo.slug || "",
    image: pageSeo.image || common.site?.defaultImage || "",
    locale,
    isArticle: Boolean(pageSeo.isArticle),
    publishDate: pageSeo.publishDate,
    modifiedDate: pageSeo.modifiedDate,
    faqs: nscCalc.faqs || [],
  };

  // createMetadata returns { title, description, openGraph, alternates, twitter, jsonLd }
  const meta = createMetadata(opts);

  // Build alternates/hreflang entries for all locales configured in SITE
  const alternates = { canonical: meta.openGraph.url, languages: {} };
  for (const lng of SITE.locales) {
    const other = (await import(`../../../../../messages/${lng}/nscCalc.json`).catch(() => ({}))).default || {};
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
  const nscCalc = (await import(`../../../../../messages/${locale}/nscCalc.json`)).default;


  // Build JSON-LD for FAQ (if any)
  const faqJsonLd =
    nscCalc.faqs && nscCalc.faqs.length
      ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: nscCalc.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
      : null;

  // Build Article JSON-LD if isArticle true
  const articleJsonLd = nscCalc.seo?.isArticle
    ? {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: nscCalc.seo?.title || nscCalc.site?.heading,
      description: nscCalc.seo?.description || "",
      author: { "@type": "Person", name: nscCalc.seo?.author || "Author" },
      datePublished: nscCalc.seo?.publishDate,
      dateModified: nscCalc.seo?.modifiedDate,
      image: nscCalc.seo?.image ? `${SITE.url}${nscCalc.seo.image}` : undefined,
      mainEntityOfPage: { "@type": "WebPage", "@id:": `${SITE.url}/${locale}/${nscCalc.seo?.slug || ""}` },
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
      <Heading title={"NSC Calculator"} />

      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 8 }}>
            <NSCCalculator nsc={nscCalc} />
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

            <article aria-labelledby="what-is-nsc-calculator" className="finance-article">

              <Image
                src={nscCalc?.seo?.image}
                alt="From ₹0 to ₹1 Crore"
                className="img-fluid mb-4 img-rounded"
                width={763}
                height={429}
                layout="responsive"
                objectFit="contain"
                style={{ marginTop: '20px' }}
              />


              <header>
                <h2 id="what-is-nsc-calculator" className="finance-sub-heading">
                  {nscCalc.article.intro.heading}
                </h2>

                {nscCalc.article.intro.paragraphs.map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </header>

              <section aria-labelledby="what-is-nsc" className="finance-article-section">
                <h3 id="what-is-nsc" className="finance-sub-heading">
                  {nscCalc.article.whatIs.heading}
                </h3>

                {nscCalc.article.whatIs.paragraphs.map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </section>

              <section aria-labelledby="how-nsc-calculator-helps" className="finance-article-section">
                <h3 id="how-nsc-calculator-helps" className="finance-sub-heading">
                  {nscCalc.article.howItHelps.heading}
                </h3>

                <p>{nscCalc.article.howItHelps.intro}</p>

                <ul className="un-list">
                  {nscCalc.article.howItHelps.points.map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>

                <p><em>{nscCalc.article.howItHelps.note}</em></p>
              </section>

              <section aria-labelledby="nsc-formula" className="finance-article-section">
                <h3 id="nsc-formula" className="finance-sub-heading">
                  {nscCalc.article.formula.heading}
                </h3>

                <p>{nscCalc.article.formula.intro}</p>

                {nscCalc.article.formula.methods.map((method, idx) => (
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
                  {nscCalc.article.formula.definitions.map((def, idx) => (
                    <li key={idx}>{def}</li>
                  ))}
                </ul>

                <p><em>{nscCalc.article.formula.note}</em></p>
              </section>

              <section aria-labelledby="nsc-inputs" className="finance-article-section">
                <h3 id="nsc-inputs" className="finance-sub-heading">
                  {nscCalc.article.inputs.heading}
                </h3>

                <p>{nscCalc.article.inputs.intro}</p>

                <ol className="ou-list">
                  {nscCalc.article.inputs.list.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ol>

                <p><em>{nscCalc.article.inputs.note}</em></p>
              </section>

              <section aria-labelledby="nsc-calculation" className="finance-article-section">
                <h3 id="nsc-calculation" className="finance-sub-heading">
                  {nscCalc.article.calculation.heading}
                </h3>

                <p>{nscCalc.article.calculation.intro}</p>

                <ol className="ou-list">
                  {nscCalc.article.calculation.steps.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>

                <p><em>{nscCalc.article.calculation.example}</em></p>
              </section>

              <section aria-labelledby="how-to-use-nsc" className="finance-article-section">
                <h3 id="how-to-use-nsc" className="finance-sub-heading">
                  {nscCalc.article.howToUse.heading}
                </h3>

                <p>{nscCalc.article.howToUse.intro}</p>

                <ol className="ou-list">
                  {nscCalc.article.howToUse.steps.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>

                <p><em>{nscCalc.article.howToUse.note}</em></p>
              </section>

              <section aria-labelledby="nsc-advantages" className="finance-article-section">
                <h3 id="nsc-advantages" className="finance-sub-heading">
                  {nscCalc.article.advantages.heading}
                </h3>

                <p>{nscCalc.article.advantages.intro}</p>

                <ul className="un-list">
                  {nscCalc.article.advantages.points.map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>

                <p><em>{nscCalc.article.advantages.note}</em></p>
              </section>

              <section aria-labelledby="nsc-notes" className="finance-article-section">
                <h3 id="nsc-notes" className="finance-sub-heading">
                  {nscCalc.article.notes.heading}
                </h3>

                <ul className="un-list">
                  {nscCalc.article.notes.points.map((note, idx) => (
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