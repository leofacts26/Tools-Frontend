import { Box, Button, Container, Grid, Stack } from '@mui/material';
import Image from "next/image";
import { createMetadata, SITE } from "@/lib/seo";



export async function generateMetadata({ params }) {
  const locale = (await params)?.locale || SITE.defaultLocale;

  // load localized JSON
  const common =
    (await import(`../../messages/${locale}/common.json`).catch(() => ({})))
      .default || {};
  const homeData =
    (await import(`../../messages/${locale}/pages/home.json`).catch(() => ({})))
      .default || {};

  const pageSeo = homeData.seo || {};

  const opts = {
    title:
      pageSeo.title ||
      homeData.site?.heading ||
      common.site?.name ||
      SITE.name,
    description: pageSeo.description || common.site?.description || "",
    slug: pageSeo.slug || "",
    image: pageSeo.image || common.site?.defaultImage,
    locale,
    isArticle: Boolean(pageSeo.isArticle),
    faqs: homeData.faqs || [],
  };

  // ⭐ RETURN DIRECTLY FROM createMetadata (DO NOT OVERRIDE)
  return createMetadata(opts);
}


export default async function Page({ params }) {

  const resolvedParams = await params;
  const locale = resolvedParams?.locale || "en";
  const homeData = (await import(`../../messages/${locale}/pages/home.json`).catch(() => ({}))).default || {};


  // Build JSON-LD for FAQ (if any)
  const faqJsonLd =
    homeData.faqs && homeData.faqs.length
      ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: homeData.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
      : null;

  // Build Article JSON-LD if isArticle true
  const articleJsonLd = homeData.seo?.isArticle
    ? {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: homeData.seo?.title || homeData.site?.heading,
      description: homeData.seo?.description || "",
      author: { "@type": "Person", name: homeData.seo?.author || "Author" },
      datePublished: homeData.seo?.publishDate,
      dateModified: homeData.seo?.modifiedDate,
      image: homeData.seo?.image ? `${SITE.url}${homeData.seo.image}` : undefined,
      mainEntityOfPage: { "@type": "WebPage", "@id:": `${SITE.url}/${locale}/${homeData.seo?.slug || ""}` },
    }
    : null;



  return (
    <>
      <section className="hero-section">
        <Container maxWidth="lg">
          <Box sx={{ flexGrow: 1, mt: 5, mb: 5 }} >
            <Grid container spacing={4}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Image
                  src="/ganaka-hero.png"
                  alt=""
                  width={800}        // set any width
                  height={500}       // set any height (maintains aspect ratio)
                  style={{
                    height: '500px',
                    width: '100%',
                    objectFit: 'contain',
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }} sx={{ height: "100%" }}>
                <h1 className='hero-title'>{homeData.hero.title}</h1>
                <p>{homeData.hero.subtitle}</p>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 3 }}>
                  <Button
                    sx={{
                      background: "linear-gradient(90deg, #6366F1, #8B5CF6)",
                      color: "white",
                      fontWeight: 600,
                      px: 3,
                      py: 1.2,
                      borderRadius: "12px",
                      textTransform: "none",
                      boxShadow: "0 4px 10px rgba(99,102,241,0.4)",
                      "&:hover": {
                        background: "linear-gradient(90deg, #4F46E5, #7C3AED)",
                        boxShadow: "0 6px 14px rgba(99,102,241,0.5)"
                      }
                    }}
                  >
                    {homeData.hero.tryButton}
                  </Button>

                  <Button
                    sx={{
                      background: "#111827",
                      color: "#F9FAFB",
                      fontWeight: 600,
                      px: 3,
                      py: 1.2,
                      borderRadius: "12px",
                      textTransform: "none",
                      "&:hover": {
                        background: "#1F2937"
                      }
                    }}
                  >
                    {homeData.hero.exploreButton}
                  </Button>
                </Stack>


              </Grid>
            </Grid>
          </Box>
        </Container>
      </section>
    </>
  )
}