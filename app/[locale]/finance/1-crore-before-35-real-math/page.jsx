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
  const locale = params?.locale || "en";

  // load localized common defaults and the page content (sipcalc.json)
  const common = (await import(`../../../../messages/${locale}/common.json`).catch(() => ({}))).default || {};
  const crorebefore35 = (await import(`../../../../messages/${locale}/financeBlogs/1-crore-before-35-real-math.json`).catch(() => ({}))).default || {};

  // use the seo block from 1-crore-before-35-real-math.json (user provided)
  const pageSeo = crorebefore35.seo || {};

  // build opts for createMetadata (your lib/seo.js expects similar keys)
  const opts = {
    title: pageSeo.title || crorebefore35.site?.heading || common.site?.name || SITE.name,
    description: pageSeo.description || common.site?.description || "",
    slug: pageSeo.slug || "",
    image: pageSeo.image || common.site?.defaultImage || "",
    locale,
    isArticle: Boolean(pageSeo.isArticle),
    publishDate: pageSeo.publishDate,
    modifiedDate: pageSeo.modifiedDate,
    faqs: crorebefore35.faqs || [],
  };

  // createMetadata returns { title, description, openGraph, alternates, twitter, jsonLd }
  const meta = createMetadata(opts);

  // Build alternates/hreflang entries for all locales configured in SITE
  const alternates = { canonical: meta.openGraph.url, languages: {} };
  for (const lng of SITE.locales) {
    const other = (await import(`../../../../messages/${lng}/financeBlogs/1-crore-before-35-real-math.json`).catch(() => ({}))).default || {};
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
  const crorebefore35 = (await import(`../../../../messages/${locale}/financeBlogs/1-crore-before-35-real-math.json`)).default;


  // Build JSON-LD for FAQ (if any)
  const faqJsonLd =
    crorebefore35.faqs && crorebefore35.faqs.length
      ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: crorebefore35.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
      : null;

  // Build Article JSON-LD if isArticle true
  const articleJsonLd = crorebefore35.seo?.isArticle
    ? {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: crorebefore35.seo?.title || crorebefore35.site?.heading,
      description: crorebefore35.seo?.description || "",
      author: { "@type": "Person", name: crorebefore35.seo?.author || "Author" },
      datePublished: crorebefore35.seo?.publishDate,
      dateModified: crorebefore35.seo?.modifiedDate,
      image: crorebefore35.seo?.image ? `${SITE.url}${crorebefore35.seo.image}` : undefined,
      mainEntityOfPage: { "@type": "WebPage", "@id:": `${SITE.url}/${locale}/${crorebefore35.seo?.slug || ""}` },
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
                <strong>{crorebefore35.site.heading.split("—")[0].trim()}</strong>
                {" — "}{crorebefore35.site.heading.split("—")[1].trim()}
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
                    {crorebefore35.article.tableOfContents.map((item, idx) => (
                      <li key={idx}>
                        {item.title}
                      </li>
                    ))}
                  </ol>

                </Grid>
                <Grid size={{ xs: 12, md: 12, lg: 6 }}>
                  <Image
                    src="/finance/1-crore-before-35-real-math/f-intro-13.854Z.png"
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
                <Grid size={{ xs: 12, md: 8 }}>

                  {/* --- Intro Section --- */}
                  <section className="article-intro">
                    <h2 className="blog-title">{crorebefore35.article.intro.title}</h2>

                    {crorebefore35.article.intro.image && (
                      <Image
                        src={crorebefore35.article.intro.image.src}
                        alt={crorebefore35.article.intro.image.alt || ""}
                        width={800}             // ✅ Adjust as needed
                        height={450}            // ✅ Maintain aspect ratio
                        className="rounded-xl shadow-md w-full md:w-3/4 mx-auto my-4"
                        priority                // ✅ Loads faster for main content image
                      />
                    )}

                    {crorebefore35.article.intro.paragraphs.map((para, idx) => (
                      <p key={idx} className="intro-paragraph">
                        {para}
                      </p>
                    ))}
                  </section>

                  {/* --- Blog Sections --- */}
                  <section className="article-sections">
                    {crorebefore35.article.sections.map((section, idx) => (
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

                {/* --- Sidebar --- */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <Card>
                    <CardContent>
                      <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                        Other Blogs
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>


            <Box>
              <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 'bold', marginBottom: '20px', marginTop: '70px' }}>
                Other Topics You May Like
              </Typography>
              <FinanceCards  excludeTitle="Become a Crorepati Before 35 — The Real Math" />
            </Box>



          </Container>
        </section>






      </article>
    </main>

  </>
}