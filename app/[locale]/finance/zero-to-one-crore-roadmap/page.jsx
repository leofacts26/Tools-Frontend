import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Avatar, Grid, Stack } from '@mui/material';
import Container from '@mui/material/Container';
import LastUpdate from '@/components/LastUpdate';
import Image from 'next/image';
import { createMetadata, SITE } from "@/lib/seo";
import FinanceCards from '@/components/cards/FinanceCards';


export async function generateMetadata({ params }) {
  // ⛔ params is async — you MUST await it
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || "en";

  // load localized common defaults and the page content (sipcalc.json)
  const common = (await import(`../../../../messages/${locale}/common.json`).catch(() => ({}))).default || {};
  const ZtoC = (await import(`../../../../messages/${locale}/financeBlogs/zero-to-crore.json`).catch(() => ({}))).default || {};

  // use the seo block from zero-to-crore.json (user provided)
  const pageSeo = ZtoC.seo || {};

  // build opts for createMetadata (your lib/seo.js expects similar keys)
  const opts = {
    title: pageSeo.title || ZtoC.site?.heading || common.site?.name || SITE.name,
    description: pageSeo.description || common.site?.description || "",
    slug: pageSeo.slug || "",
    image: pageSeo.image || common.site?.defaultImage || "",
    locale,
    isArticle: Boolean(pageSeo.isArticle),
    publishDate: pageSeo.publishDate,
    modifiedDate: pageSeo.modifiedDate,
    faqs: ZtoC.faqs || [],
  };

  // createMetadata returns { title, description, openGraph, alternates, twitter, jsonLd }
  const meta = createMetadata(opts);

  // Build alternates/hreflang entries for all locales configured in SITE
  const alternates = { canonical: meta.openGraph.url, languages: {} };
  for (const lng of SITE.locales) {
    const other = (await import(`../../../../messages/${lng}/financeBlogs/zero-to-crore.json`).catch(() => ({}))).default || {};
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
  const ZtoC = (await import(`../../../../messages/${locale}/financeBlogs/zero-to-crore.json`)).default;


  // Build JSON-LD for FAQ (if any)
  const faqJsonLd =
    ZtoC.faqs && ZtoC.faqs.length
      ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: ZtoC.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
      : null;

  // Build Article JSON-LD if isArticle true
  const articleJsonLd = ZtoC.seo?.isArticle
    ? {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: ZtoC.seo?.title || ZtoC.site?.heading,
      description: ZtoC.seo?.description || "",
      author: { "@type": "Person", name: ZtoC.seo?.author || "Author" },
      datePublished: ZtoC.seo?.publishDate,
      dateModified: ZtoC.seo?.modifiedDate,
      image: ZtoC.seo?.image ? `${SITE.url}${ZtoC.seo.image}` : undefined,
      mainEntityOfPage: { "@type": "WebPage", "@id:": `${SITE.url}/${locale}/${ZtoC.seo?.slug || ""}` },
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



    <main>
      <article>
        <header className="page-title-wrapper">
          <section className="page-title">
            <div style={{ textAlign: 'center', padding: '40px 0px 0px 0px' }}>
              <h1 class="page-heading">
                <strong>{ZtoC.site.heading.split("—")[0].trim()}</strong>
                {" — "}{ZtoC.site.heading.split("—")[1].trim()}
              </h1>
            </div>
          </section>

          <Box sx={{ padding: 2 }}>
            <Stack direction="row" alignItems="center" justifyContent="center" flexWrap="wrap" spacing={5}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar
                  alt="Prasan"
                  src="/prasan.png"
                  sx={{ width: 48, height: 48, marginRight: 1 }}
                />
                <time dateTime="2024-08-16T08:58:46">
                  <Typography variant="body2" color="#ffffff">
                    <LastUpdate />
                  </Typography>
                </time>
              </Box>
            </Stack>
          </Box>

          <Container maxWidth="lg">
            <Box sx={{ flexGrow: 1 }} style={{ padding: '40px 0px 40px 0px' }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 12, lg: 6 }}>
                  <h2 className="table-of-content">Table Of Contents</h2>
                  <ol className="order-list">
                    {ZtoC.article.tableOfContents.map((item, idx) => (
                      <li key={idx}>
                        {item.title}
                      </li>
                    ))}
                  </ol>

                </Grid>
                <Grid size={{ xs: 12, md: 12, lg: 6 }}>
                  <Image
                    src="/finance/zero-to-one-crore/intro-1.088Z.png"
                    alt="From ₹0 to ₹1 Crore"
                    className="img-fluid mb-4 img-rounded"
                    width={763}
                    height={429}
                    layout="responsive"
                    objectFit="contain"
                    style={{ marginTop: '20px' }}
                  />
                </Grid>

              </Grid>
            </Box>
          </Container>
        </header>


        <section id="blog-section">
          <Container>
            <Box sx={{ flexGrow: 1, mt: 4, mb: 4 }}>
              <Grid container spacing={2}>

                <Grid size={{ xs: 12, md: 12, lg: 2 }}>
                  {/* <h3>Left</h3> */}
                </Grid>

                <Grid size={{ xs: 12, md: 8 }}>

                  {/* --- Intro Section --- */}
                  <section className="article-intro">
                    <h2 className="blog-title">{ZtoC.article.intro.title}</h2>

                    {ZtoC.article.intro.image && (
                      <Image
                        src={ZtoC.article.intro.image.src}
                        alt={ZtoC.article.intro.image.alt || ""}
                        width={800}             // ✅ Adjust as needed
                        height={450}            // ✅ Maintain aspect ratio
                        className="rounded-xl shadow-md w-full md:w-3/4 mx-auto my-4"
                        priority                // ✅ Loads faster for main content image
                      />
                    )}

                    {ZtoC.article.intro.paragraphs.map((para, idx) => (
                      <p key={idx} className="intro-paragraph">
                        {para}
                      </p>
                    ))}
                  </section>

                  {/* --- Blog Sections --- */}
                  <section className="article-sections">
                    {ZtoC.article.sections.map((section, idx) => (
                      <div key={idx} className="article-section">
                        <h2 className="section-title">{section.title}</h2>

                        <Box sx={{ mb: 2 }}>
                          {section.image && (
                            <Image
                              src={section.image.src}
                              alt={section.image.alt || ""}
                              width={800}
                              height={450}
                              className="rounded-xl shadow-md w-full md:w-3/4 mx-auto my-4"
                              priority
                            />
                          )}
                        </Box>

                        {section.paragraphs.map((para, pIdx) => (
                          <p key={pIdx} className="section-paragraph">
                            {para}
                          </p>
                        ))}
                      </div>
                    ))}
                  </section>

                </Grid>

                <Grid size={{ xs: 12, md: 12, lg: 2 }}>
                  {/* <h3>Left</h3> */}
                </Grid>

                <Box>
                  <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 'bold', marginBottom: '20px', marginTop: '70px' }}>
                    Other Topics You May Like
                  </Typography>
                  <FinanceCards excludeTitle="From ₹0 to ₹1 Crore: The Step-by-Step Roadmap No One Shows You" />
                </Box>
              </Grid>
            </Box>
          </Container>
        </section>




      </article>
    </main>

  </>
}