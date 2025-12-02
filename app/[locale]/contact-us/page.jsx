import React from "react";
import { Container, Typography, Grid, Paper } from "@mui/material";
import ContactForm from "../../../components/ContactForm";
import SocialLinks from "../../../components/SocialLinks";
import { createMetadata, SITE } from "@/lib/seo";


export async function generateMetadata({ params }) {
  const locale = (await params)?.locale || SITE.defaultLocale;

  // Load localized JSON content
  const common =
    (await import(`../../../messages/${locale}/common.json`).catch(() => ({})))
      .default || {};

  const pageContent =
    (await import(`../../../messages/${locale}/pages/contact.json`).catch(() => ({})))
      .default || {};

  const pageSeo = pageContent.seo || {};

  const opts = {
    title:
      pageSeo.title ||
      pageContent.site?.heading ||
      common.site?.name ||
      SITE.name,

    description: pageSeo.description || common.site?.description || "",

    slug: pageSeo.slug || "contact-us", // fallback slug
    image: pageSeo.image || common.site?.defaultImage || "",
    locale,

    isArticle: Boolean(pageSeo.isArticle),
    faqs: pageContent.faqs || [],
  };

  return createMetadata(opts);
}


export default async function ContactPage({ params }) {

  const resolvedParams = await params;
  const locale = resolvedParams?.locale || "en";
  const pageContent = (await import(`../../../messages/${locale}/pages/contact.json`).catch(() => ({}))).default || {};

  return (
    <Container maxWidth="lg" sx={{ mt: 8, mb: 8 }}>
      <Typography variant="h3" align="center" gutterBottom>
        {pageContent.pageContent?.title || "Get in Touch with GanakaHub"}
      </Typography>
      <Typography variant="h6" align="center" color="textSecondary" gutterBottom>
        {pageContent.pageContent?.subtitle || "We’re here to help. Contact us for feedback, questions, or suggestions."}
      </Typography>


      <Grid container spacing={4} sx={{ mt: 4 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <ContactForm />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 4, borderRadius: 2 }}>
            <Typography sx={{ mt: 2 }}>
              Email: <a href={`mailto:${pageContent.pageContent.contactInfo.email}`}>
                {pageContent.pageContent.contactInfo.email}
              </a>
              <br />
              Website: <a href={pageContent.pageContent.contactInfo.website} target="_blank" rel="noopener noreferrer">
                {pageContent.pageContent.contactInfo.website}
              </a>
            </Typography>
            <Typography variant="subtitle1" sx={{ mt: 3 }}>
              Follow us on social media:
            </Typography>
            <SocialLinks />

            <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 4 }}>
              {pageContent.pageContent?.footerNote}
            </Typography>

          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
