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
  const blogData = (await import(`../../../../messages/${locale}/financeBlogs/what-the-rich-know-schools-never-taught`).catch(() => ({}))).default || {};

  // use the seo block from what-the-rich-know-schools-never-taught (user provided)
  const pageSeo = blogData.seo || {};

  // build opts for createMetadata (your lib/seo.js expects similar keys)
  const opts = {
    title: pageSeo.title || blogData.site?.heading || common.site?.name || SITE.name,
    description: pageSeo.description || common.site?.description || "",
    slug: pageSeo.slug || "",
    image: pageSeo.image || common.site?.defaultImage || "",
    locale,
    isArticle: Boolean(pageSeo.isArticle),
    publishDate: pageSeo.publishDate,
    modifiedDate: pageSeo.modifiedDate,
    faqs: blogData.faqs || [],
  };

  // createMetadata returns { title, description, openGraph, alternates, twitter, jsonLd }
  const meta = createMetadata(opts);

  // Build alternates/hreflang entries for all locales configured in SITE
  const alternates = { canonical: meta.openGraph.url, languages: {} };
  for (const lng of SITE.locales) {
    const other = (await import(`../../../../messages/${lng}/financeBlogs/what-the-rich-know-schools-never-taught`).catch(() => ({}))).default || {};
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
  const blogData = (await import(`../../../../messages/${locale}/financeBlogs/what-the-rich-know-schools-never-taught`)).default;


  // Build JSON-LD for FAQ (if any)
  const faqJsonLd =
    blogData.faqs && blogData.faqs.length
      ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: blogData.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
      : null;

  // Build Article JSON-LD if isArticle true
  const articleJsonLd = blogData.seo?.isArticle
    ? {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: blogData.seo?.title || blogData.site?.heading,
      description: blogData.seo?.description || "",
      author: { "@type": "Person", name: blogData.seo?.author || "Author" },
      datePublished: blogData.seo?.publishDate,
      dateModified: blogData.seo?.modifiedDate,
      image: blogData.seo?.image ? `${SITE.url}${blogData.seo.image}` : undefined,
      mainEntityOfPage: { "@type": "WebPage", "@id:": `${SITE.url}/${locale}/${blogData.seo?.slug || ""}` },
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
                <strong>{blogData.site.heading.split("—")[0].trim()}</strong>
                {" — "}{blogData.site.heading.split("—")[1].trim()}
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
                    {blogData.article.tableOfContents.map((item, idx) => (
                      <li key={idx}>
                        {item.title}
                      </li>
                    ))}
                  </ol>

                </Grid>
                <Grid size={{ xs: 12, md: 12, lg: 6 }}>
                  <Image
                    src="/finance/how-indians-waste-10000-every-month/I-intro-5.011Z.png"
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
                    <h2 className="blog-title">{blogData.article.intro.title}</h2>

                    {blogData.article.intro.image && (
                      <Image
                        src={blogData.article.intro.image.src}
                        alt={blogData.article.intro.image.alt || ""}
                        width={800}             // ✅ Adjust as needed
                        height={450}            // ✅ Maintain aspect ratio
                        className="rounded-xl shadow-md w-full md:w-3/4 mx-auto my-4"
                        priority                // ✅ Loads faster for main content image
                      />
                    )}

                    {blogData.article.intro.paragraphs.map((para, idx) => (
                      <p key={idx} className="intro-paragraph">
                        {para}
                      </p>
                    ))}
                  </section>

                  {/* --- Blog Sections --- */}
                  <section className="article-sections">
                    {blogData.article.sections.map((section, idx) => (
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

                        {section?.paragraphs?.map((para, pIdx) => (
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
                  <FinanceCards excludeTitle="What the Rich Know That Schools Never Taught You" />
                </Box>
              </Grid>
            </Box>
          </Container>
        </section>




      </article>
    </main>

  </>
}