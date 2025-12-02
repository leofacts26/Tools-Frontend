import FinanceCards from "@/components/cards/FinanceCards";
import { Container, Stack } from "@mui/material";
import { createMetadata, SITE } from "@/lib/seo";



export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || SITE.defaultLocale;

  // Load localized JSON content
  const common =
    (await import(`../../../messages/${locale}/common.json`).catch(() => ({})))
      .default || {};

  const pageContent =
    (await import(
      `../../../messages/${locale}/pages/finance.json`
    ).catch(() => ({}))).default || {};

  const pageSeo = pageContent.seo || {};

  const opts = {
    title:
      pageSeo.title ||
      pageContent.site?.heading ||
      common.site?.name ||
      SITE.name,

    description: pageSeo.description || common.site?.description || "",

    slug: pageSeo.slug || "Finance", // fallback slug

    image: pageSeo.image || common.site?.defaultImage || "",

    locale,

    isArticle: Boolean(pageSeo.isArticle),

    faqs: pageContent.faqs || [],
  };

  return createMetadata(opts);
}





export default async function Page({ params }) {

  const resolvedParams = await params;
  const locale = resolvedParams?.locale || "en";
  const pageContent = (await import(`../../../messages/${locale}/pages/finance.json`).catch(() => ({}))).default || {};


  return (
    <>
      <section className="blog-bg">
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            sx={{ height: "100%", width: "100%", textAlign: "center", mt: 4 }}
          >
            <h1 style={{marginBottom: "0px"}}>{pageContent.hero.title}</h1>
            <p>{pageContent.hero.subtitle}</p>
            <svg
              width="115"
              height="18"
              viewBox="0 0 115 18"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 4c11.5 0 11.5 10 23 10S34.5 4 46 4s11.5 10 23 10S80.5 4 92 4s11.5 10 23 10"
                stroke="#ec407a"
                strokeWidth="8"
                fill="none"
                fillRule="evenodd"
              ></path>
            </svg>

            {/* <p style={{ marginTop: "30px" }}>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam
              pariatur dolores reprehenderit odio culpa officiis iure tenetur
              explicabo exercitationem cum! Impedit repellendus aperiam mollitia
              laudantium et tenetur iure nostrum cupiditate.
            </p> */}
          </Stack>
        </Container>
      </section>

      {/* Cards + pagination */}
      <FinanceCards />
    </>
  );
}
