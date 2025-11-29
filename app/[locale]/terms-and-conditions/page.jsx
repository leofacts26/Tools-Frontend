import { Box, Typography, Container } from "@mui/material";
import { createMetadata, SITE } from "@/lib/seo";


export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || "en";

  // load localized common defaults and the page content (sipcalc.json)
  const common = (await import(`../../../messages/${locale}/common.json`).catch(() => ({}))).default || {};
  const pageContent = (await import(`../../../messages/${locale}/pages/terms.json`).catch(() => ({}))).default || {};

  // use the seo block from 1-crore-before-35-real-math.json (user provided)
  const pageSeo = pageContent.seo || {};

  // build opts for createMetadata (your lib/seo.js expects similar keys)
  const opts = {
    title: pageSeo.title || pageContent.site?.heading || common.site?.name || SITE.name,
    description: pageSeo.description || common.site?.description || "",
    slug: pageSeo.slug || "",
    image: pageSeo.image || common.site?.defaultImage || "",
    locale,
    isArticle: Boolean(pageSeo.isArticle),
    publishDate: pageSeo.publishDate,
    modifiedDate: pageSeo.modifiedDate,
    faqs: pageContent.faqs || [],
  };

  // createMetadata returns { title, description, openGraph, alternates, twitter, jsonLd }
  const meta = createMetadata(opts);

  // Build alternates/hreflang entries for all locales configured in SITE
  const alternates = { canonical: meta.openGraph.url, languages: {} };
  for (const lng of SITE.locales) {
    const other = (await import(`../../../messages/${lng}/pages/about.json`).catch(() => ({}))).default || {};
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

  const resolvedParams = await params;
  const locale = resolvedParams?.locale || "en";
  const pageContent = (await import(`../../../messages/${locale}/pages/about.json`).catch(() => ({}))).default || {};


  // Build JSON-LD for FAQ (if any)
  const faqJsonLd =
    pageContent.faqs && pageContent.faqs.length
      ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: pageContent.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
      : null;

  // Build Article JSON-LD if isArticle true
  const articleJsonLd = pageContent.seo?.isArticle
    ? {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: pageContent.seo?.title || pageContent.site?.heading,
      description: pageContent.seo?.description || "",
      author: { "@type": "Person", name: pageContent.seo?.author || "Author" },
      datePublished: pageContent.seo?.publishDate,
      dateModified: pageContent.seo?.modifiedDate,
      image: pageContent.seo?.image ? `${SITE.url}${pageContent.seo.image}` : undefined,
      mainEntityOfPage: { "@type": "WebPage", "@id:": `${SITE.url}/${locale}/${pageContent.seo?.slug || ""}` },
    }
    : null;


  return (
    <Box className="terms-wrapper">
      <Container maxWidth="md">
        <Typography className="terms-title">
          Terms &amp; Conditions
        </Typography>

        <Typography className="terms-subtle">
          Last Updated: 01/11/2025
        </Typography>

        {/* ------------------------------ INTRO ------------------------------ */}
        <Typography className="terms-text">
          Welcome to <strong>GanakaHub.com</strong> (“<em>GanakaHub</em>”,
          “we”, “our”, “us”). These Terms &amp; Conditions (“<em>Terms</em>”)
          govern your access to and use of our website, tools, and services.
          GanakaHub offers a wide variety of online calculators and utilities,
          including:
        </Typography>

        <ul className="terms-list">
          <li>Finance tools (SIP, Lumpsum, EPF, NPS, Gratuity Calculators)</li>
          <li>Student tools (GPA, Attendance Calculator, Study Timer)</li>
          <li>Utility tools (Converters, timers, generators, and more)</li>
        </ul>

        <Typography className="terms-text">
          By accessing or using our website, you agree to comply with and be
          bound by these Terms. If you do not agree, you must stop using
          GanakaHub immediately.
        </Typography>

        {/* ------------------------------ SECTION 1 ------------------------------ */}
        <Typography className="terms-heading">
          1) Eligibility &amp; Acceptance
        </Typography>

        <Typography className="terms-text">
          By using GanakaHub, you confirm that you are at least 18 years old or
          are accessing the website under the supervision of a parent or legal
          guardian. You also agree to follow all applicable laws and
          regulations. If you continue using the site after updates to these
          Terms, it means you accept the revised version.
        </Typography>

        {/* ------------------------------ SECTION 2 ------------------------------ */}
        <Typography className="terms-heading">2) Nature of Services</Typography>

        <Typography className="terms-text">
          GanakaHub provides automated calculators and digital tools intended to
          simplify everyday calculations, improve convenience, and help users
          understand financial or academic concepts. Tools include SIP
          calculators, EPF estimators, loan-related tools, GPA calculators,
          timers, and more.
        </Typography>

        <Typography className="terms-text">
          All results generated by GanakaHub are intended for{" "}
          <strong>informational and educational purposes only</strong>.
          Calculators work on general formulas, assumptions, and user-provided
          inputs. Actual financial or academic outcomes may differ from the
          values shown on our tools.
        </Typography>

        {/* ------------------------------ SECTION 3 ------------------------------ */}
        <Typography className="terms-heading">
          3) No Financial, Legal, or Professional Advice
        </Typography>

        <Typography className="terms-text">
          GanakaHub does <strong>NOT</strong> provide financial, tax, legal,
          educational, investment, or professional advice. The results you see
          in calculators—such as investment returns, interest projections, EPF
          balances, GPA scores, or attendance percentages—are only estimates.
        </Typography>

        <Typography className="terms-text">
          Before making financial, academic, or life decisions, you should
          always consult a qualified professional. GanakaHub is not responsible
          for decisions based on the outputs of our tools.
        </Typography>

        {/* ------------------------------ SECTION 4 ------------------------------ */}
        <Typography className="terms-heading">
          4) Accuracy, Assumptions &amp; Updates
        </Typography>

        <Typography className="terms-text">
          While we make reasonable efforts to ensure accuracy, we do not
          guarantee that our tools, calculators, or content are complete,
          accurate, or up-to-date. Many formulas depend on:
        </Typography>

        <ul className="terms-list">
          <li>Interest rate changes</li>
          <li>Market fluctuations</li>
          <li>Government tax rules</li>
          <li>Institution-specific policies</li>
          <li>Rounding assumptions</li>
        </ul>

        <Typography className="terms-text">
          Since these factors change frequently, your real-world results may
          differ. We may also update or modify tools at any time without
          notice.
        </Typography>

        {/* ------------------------------ SECTION 5 ------------------------------ */}
        <Typography className="terms-heading">5) User Responsibilities</Typography>

        <Typography className="terms-text">You agree to:</Typography>

        <ul className="terms-list">
          <li>Use the tools for personal and non-commercial use only.</li>
          <li>Not copy, scrape, or reverse-engineer our tools or code.</li>
          <li>Not misuse, hack, or disrupt the website in any way.</li>
          <li>
            Ensure the inputs you provide are accurate to receive meaningful
            results.
          </li>
        </ul>

        {/* ------------------------------ SECTION 6 ------------------------------ */}
        <Typography className="terms-heading">6) Accounts &amp; Security</Typography>

        <Typography className="terms-text">
          Currently, GanakaHub does not require user accounts for tool usage.
          If account features are added in the future, you will be responsible
          for safeguarding your login information and reporting any unauthorized
          access.
        </Typography>

        {/* ------------------------------ SECTION 7 ------------------------------ */}
        <Typography className="terms-heading">7) Intellectual Property</Typography>

        <Typography className="terms-text">
          All content on GanakaHub—including logos, UI design, text, tool
          logic, graphics, icons, layout, and code—is protected by copyright and
          intellectual property laws. You may not copy, modify, republish,
          distribute, or sell any part of our website without written
          permission.
        </Typography>

        {/* ------------------------------ SECTION 8 ------------------------------ */}
        <Typography className="terms-heading">
          8) Acceptable Use &amp; Prohibited Conduct
        </Typography>

        <Typography className="terms-text">You agree NOT to:</Typography>

        <ul className="terms-list">
          <li>Scrape or extract large amounts of data from our website.</li>
          <li>Copy or clone any tool, formula, or calculator.</li>
          <li>Use bots or automated systems to overload the server.</li>
          <li>Attempt to bypass security or inject harmful code.</li>
          <li>Use the service for unlawful or fraudulent purposes.</li>
        </ul>

        {/* ------------------------------ SECTION 9 ------------------------------ */}
        <Typography className="terms-heading">
          9) Third-Party Links, Advertisements &amp; Affiliates
        </Typography>

        <Typography className="terms-text">
          GanakaHub may include advertisements, affiliate links, or references
          to third-party websites. These external sites are not controlled by
          GanakaHub.
        </Typography>

        <Typography className="terms-text">
          We are not responsible for their:
        </Typography>

        <ul className="terms-list">
          <li>Accuracy or content</li>
          <li>Privacy practices</li>
          <li>Policies or terms</li>
          <li>Security</li>
        </ul>

        {/* ------------------------------ SECTION 10 ------------------------------ */}
        <Typography className="terms-heading">
          10) Privacy, Data &amp; Cookies
        </Typography>

        <Typography className="terms-text">
          We collect limited anonymous analytics data (browser, device, time
          spent, etc.) to improve site performance. We do NOT collect sensitive
          personal information such as bank details, passwords, or Aadhaar
          information.
        </Typography>

        <Typography className="terms-text">
          Our <strong>Privacy Policy</strong> explains how we use cookies and
          analytics tools.
        </Typography>

        {/* ------------------------------ SECTION 11 ------------------------------ */}
        <Typography className="terms-heading">
          11) Availability &amp; Changes to Services
        </Typography>

        <Typography className="terms-text">
          While we strive for uptime, we do not guarantee that GanakaHub will
          always be available or error-free. We may add, update, restrict, or
          remove tools at any time without notice.
        </Typography>

        {/* ------------------------------ SECTION 12 ------------------------------ */}
        <Typography className="terms-heading">12) Disclaimers</Typography>
        <Typography className="terms-text">
          GanakaHub is provided on an{" "}
          <strong>“as-is” and “as-available”</strong> basis. We do not guarantee
          accuracy, reliability, or completeness. Use of our tools is at your
          own risk.
        </Typography>

        {/* ------------------------------ SECTION 13 ------------------------------ */}
        <Typography className="terms-heading">13) Limitation of Liability</Typography>

        <Typography className="terms-text">
          GanakaHub will not be liable for any financial loss, incorrect
          calculations, data inaccuracies, business damages, or any indirect or
          incidental damages resulting from your use of our tools.
        </Typography>

        {/* ------------------------------ SECTION 14 ------------------------------ */}
        <Typography className="terms-heading">14) Indemnification</Typography>

        <Typography className="terms-text">
          You agree to indemnify GanakaHub from any claims arising from your use
          of the website, violation of these Terms, or infringement of any third
          -party rights.
        </Typography>

        {/* ------------------------------ SECTION 15 ------------------------------ */}
        <Typography className="terms-heading">15) Changes to Terms</Typography>

        <Typography className="terms-text">
          We may update these Terms at any time. Continued use of the website
          after changes means you accept the updated Terms.
        </Typography>

        {/* ------------------------------ SECTION 16 ------------------------------ */}
        <Typography className="terms-heading">
          16) Governing Law &amp; Dispute Resolution
        </Typography>

        <Typography className="terms-text">
          These Terms are governed by the laws of India. Any disputes will be
          handled in the courts of India. Before taking legal action, we request
          that you first attempt to resolve disputes informally by contacting us.
        </Typography>

        {/* ------------------------------ SECTION 17 ------------------------------ */}
        <Typography className="terms-heading">
          17) Severability &amp; Entire Agreement
        </Typography>

        <Typography className="terms-text">
          If any part of these Terms is found to be invalid or unenforceable,
          the rest will continue in effect. These Terms represent the entire
          agreement between you and GanakaHub.
        </Typography>

        {/* ------------------------------ CONTACT ------------------------------ */}
        <Typography className="terms-heading">18) Contact Us</Typography>

        <Typography className="terms-text">
          If you have any questions about these Terms, you can contact us:
          <br />
          <strong>Email:</strong> ganakahub@gmail.com
          <br />
          <strong>Website:</strong> https://www.ganakahub.com
        </Typography>
      </Container>
    </Box>
  );
}
