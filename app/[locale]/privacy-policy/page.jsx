import { Box, Typography, Container } from "@mui/material";

export const metadata = {
  title: "Privacy Policy | GanakaHub",
  description:
    "Privacy Policy for GanakaHub.com describing what data we collect, how we use it, cookies, analytics, security, and your choices.",
};

export default function Page() {
  return (
    <Box className="terms-wrapper">
      <Container maxWidth="md">
        <Typography className="terms-title">
          Privacy Policy
        </Typography>

        <Typography className="terms-subtle">
          Last Updated: 01/11/2025
        </Typography>

        {/* INTRO */}
        <Typography className="terms-text">
          Welcome to <strong>GanakaHub.com</strong> (“<em>GanakaHub</em>”,
          “we”, “our”, “us”). This Privacy Policy explains what information we
          collect, how we use it, and the choices you have. By using our
          website, tools, and services (including finance tools, student tools,
          and utility tools), you agree to the practices described here. If you
          do not agree, please discontinue use of GanakaHub.
        </Typography>

        {/* WHO WE ARE */}
        <Typography className="terms-heading">1) Who We Are</Typography>
        <Typography className="terms-text">
          GanakaHub provides online calculators and utilities designed for
          informational and educational purposes. We respect your privacy and
          aim to collect only what is necessary to operate and improve our
          services.
        </Typography>

        {/* WHAT WE COLLECT */}
        <Typography className="terms-heading">2) Information We Collect</Typography>
        <Typography className="terms-text">
          We primarily collect limited, non-personal information to keep the
          site running smoothly and understand usage patterns. Generally, we do
          <strong> not</strong> require you to create an account or provide
          sensitive data to use our calculators.
        </Typography>
        <Typography className="terms-text">We may collect:</Typography>

        <ul className="terms-list">
          <li>
            <strong>Technical Data:</strong> IP address (often anonymized),
            device type, operating system, browser type/version, language,
            screen size, and general location (country/region).
          </li>
          <li>
            <strong>Usage Data:</strong> pages viewed, time on page, referring
            URLs, buttons clicked, scroll depth, and error logs for debugging.
          </li>
          <li>
            <strong>Cookie Data:</strong> small text files stored on your device
            to remember preferences, measure traffic, and improve experience.
          </li>
          <li>
            <strong>Tool Inputs (Ephemeral):</strong> values you enter into our
            calculators. These are used to compute results in your browser and
            are generally not stored by us unless explicitly stated for a
            feature (e.g., saved preferences in the future).
          </li>
        </ul>

        <Typography className="terms-text">
          We do <strong>not</strong> knowingly collect sensitive personal data
          (such as passwords, bank credentials, Aadhaar numbers, or medical
          records).
        </Typography>

        {/* HOW WE USE */}
        <Typography className="terms-heading">3) How We Use Information</Typography>
        <Typography className="terms-text">
          We use the information we collect to:
        </Typography>
        <ul className="terms-list">
          <li>Operate, maintain, and improve our calculators and website.</li>
          <li>Monitor performance, fix issues, and enhance usability.</li>
          <li>Measure traffic, understand user behavior, and plan new features.</li>
          <li>Protect the site against abuse, fraud, and security threats.</li>
          <li>Comply with legal obligations and enforce our Terms & Conditions.</li>
        </ul>

        {/* LEGAL BASIS */}
        <Typography className="terms-heading">4) Legal Bases (Where Applicable)</Typography>
        <Typography className="terms-text">
          Depending on your region, we may rely on one or more of the following
          legal bases to process your information: <strong>legitimate interests</strong>
          (to operate and secure our services), <strong>consent</strong> (for
          certain cookies/analytics), and <strong>compliance with legal obligations</strong>.
        </Typography>

        {/* COOKIES */}
        <Typography className="terms-heading">5) Cookies & Similar Technologies</Typography>
        <Typography className="terms-text">
          We use cookies and similar technologies to remember preferences,
          analyze traffic, and improve performance. You can manage cookies via
          your browser settings and, where available, a cookie banner or
          preferences panel. Disabling certain cookies may affect site
          functionality.
        </Typography>

        {/* ANALYTICS / ADS */}
        <Typography className="terms-heading">6) Analytics, Advertising & Affiliates</Typography>
        <Typography className="terms-text">
          We may use privacy-conscious analytics tools to measure engagement and
          improve the site. We may also display ads or affiliate links. Third
          parties involved in analytics or ads may set their own cookies and
          collect data as described in their privacy policies. We do not sell
          your personal information.
        </Typography>

        {/* DATA SHARING */}
        <Typography className="terms-heading">7) When We Share Information</Typography>
        <Typography className="terms-text">
          We do not sell your data. We may share limited information with:
        </Typography>
        <ul className="terms-list">
          <li>
            <strong>Service Providers:</strong> vendors who help us operate the
            site (e.g., hosting, analytics, security). They are bound by
            contractual obligations to protect your data.
          </li>
          <li>
            <strong>Legal/Compliance:</strong> when required by law, regulation,
            legal process, or to protect rights, safety, and integrity of
            GanakaHub and its users.
          </li>
          <li>
            <strong>Business Changes:</strong> if we undergo a merger,
            acquisition, or asset transfer, your data may be transferred as part
            of that transaction with appropriate safeguards.
          </li>
        </ul>

        {/* DATA RETENTION */}
        <Typography className="terms-heading">8) Data Retention</Typography>
        <Typography className="terms-text">
          We retain analytics and server logs for only as long as necessary to
          fulfill the purposes outlined in this policy, comply with legal
          obligations, resolve disputes, and enforce agreements. Calculator
          inputs are typically processed in your browser and not stored on our
          servers unless a feature clearly indicates saving preferences.
        </Typography>

        {/* DATA SECURITY */}
        <Typography className="terms-heading">9) Data Security</Typography>
        <Typography className="terms-text">
          We implement reasonable technical and organizational measures to
          protect information against unauthorized access, alteration, or
          destruction. However, no method of transmission or storage is 100%
          secure, and we cannot guarantee absolute security.
        </Typography>

        {/* CHILDREN */}
        <Typography className="terms-heading">10) Children’s Privacy</Typography>
        <Typography className="terms-text">
          GanakaHub is intended for general audiences and not directed to
          children under 13 (or the applicable age in your region). We do not
          knowingly collect personal data from children. If you believe a child
          has provided personal data, please contact us so we can take
          appropriate action.
        </Typography>

        {/* INTERNATIONAL TRANSFERS */}
        <Typography className="terms-heading">11) International Data Transfers</Typography>
        <Typography className="terms-text">
          We may process information on servers located outside your state or
          country. Where required, we implement safeguards designed to protect
          your information during such transfers.
        </Typography>

        {/* YOUR CHOICES */}
        <Typography className="terms-heading">12) Your Choices & Controls</Typography>
        <Typography className="terms-text">
          You can control certain data collection by:
        </Typography>
        <ul className="terms-list">
          <li>Adjusting browser settings to block or delete cookies.</li>
          <li>Using privacy or tracking protection modes where available.</li>
          <li>Opting out of analytics/advertising cookies (where offered).</li>
        </ul>

        {/* YOUR RIGHTS */}
        <Typography className="terms-heading">13) Your Rights</Typography>
        <Typography className="terms-text">
          Depending on your jurisdiction, you may have rights to access, update,
          correct, or delete certain information, or object to/limit processing.
          You may also have the right to withdraw consent where processing is
          based on consent. To exercise these rights, contact us using the
          details below. We may need to verify your identity before responding.
        </Typography>

        {/* THIRD-PARTY LINKS */}
        <Typography className="terms-heading">14) Third-Party Links</Typography>
        <Typography className="terms-text">
          Our website may link to external sites we do not operate. We are not
          responsible for the content or privacy practices of those websites.
          Review their policies before providing any personal information.
        </Typography>

        {/* CHANGES */}
        <Typography className="terms-heading">15) Changes to This Policy</Typography>
        <Typography className="terms-text">
          We may update this Privacy Policy from time to time. Changes will be
          posted on this page with an updated “Last Updated” date. Your
          continued use of GanakaHub after such changes means you accept the
          revised policy. We encourage you to review this page periodically.
        </Typography>

        {/* CONTACT / GRIEVANCE */}
        <Typography className="terms-heading">16) Contact & Grievance</Typography>
        <Typography className="terms-text">
          If you have questions, requests, or complaints regarding privacy, you
          can contact us:
          <br />
          <strong>Email:</strong> ganakahub@gmail.com
          <br />
          <strong>Website:</strong> https://www.ganakahub.com
        </Typography>
        <Typography className="terms-text">
          If you are located in India and wish to raise a concern under
          applicable laws, you may write to our <strong>Grievance Officer</strong> at
          the email above. Please include sufficient details to help us address
          your request (e.g., specific URL, description of the issue, and your
          contact information).
        </Typography>

        {/* FINAL NOTE */}
        <Typography className="terms-text">
          This Privacy Policy is intended to be clear and simple. It does not
          create contractual or legal rights on behalf of any party, except as
          required by applicable law. For how we govern your use of the site,
          please refer to our <strong>Terms &amp; Conditions</strong>.
        </Typography>
      </Container>
    </Box>
  );
}
