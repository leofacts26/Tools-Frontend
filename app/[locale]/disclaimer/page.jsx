import { Box, Typography, Container } from "@mui/material";

export const metadata = {
  title: "Disclaimer | GanakaHub",
  description:
    "Legal disclaimer for GanakaHub.com covering accuracy, liability, tool limitations, and financial calculation disclaimers.",
};

export default function Page() {
  return (
    <Box className="terms-wrapper">
      <Container maxWidth="md">
        <Typography className="terms-title">Disclaimer</Typography>

        <Typography className="terms-subtle">Last Updated: 01/11/2025</Typography>

        {/* INTRO */}
        <Typography className="terms-text">
          The information, tools, calculators, and content provided on{" "}
          <strong>GanakaHub.com</strong> (“<em>GanakaHub</em>”, “we”, “our”,
          “us”) are intended solely for <strong>general informational and
          educational purposes</strong>. By using this website, you acknowledge
          and agree to the terms outlined in this Disclaimer. If you do not
          agree, please discontinue using GanakaHub.
        </Typography>

        {/* NOT PROFESSIONAL ADVICE */}
        <Typography className="terms-heading">
          1) No Professional Advice (Financial, Legal, Educational, Technical)
        </Typography>

        <Typography className="terms-text">
          GanakaHub does <strong>NOT</strong> provide:
        </Typography>

        <ul className="terms-list">
          <li>Financial or investment advice</li>
          <li>Legal or tax advice</li>
          <li>Educational or academic judgment</li>
          <li>Business or career advice</li>
          <li>Technical engineering guidance</li>
        </ul>

        <Typography className="terms-text">
          All calculations—including SIP, Lumpsum, NPS, EPF, Gratuity,
          loan/interest estimates, GPA calculation, attendance percentages,
          timers, counters, or other results—are<strong> approximations only</strong>.
          They may differ from actual real-world results from banks, employers,
          institutions, or authorities.
        </Typography>

        {/* ACCURACY */}
        <Typography className="terms-heading">
          2) Accuracy, Completeness &amp; Reliability
        </Typography>

        <Typography className="terms-text">
          While we aim to ensure accuracy, GanakaHub makes{" "}
          <strong>no guarantees</strong> that our calculators, tools, charts,
          formulas, or projections are correct, precise, complete, or up to
          date. Many financial calculations depend on variable factors beyond
          our control, including:
        </Typography>

        <ul className="terms-list">
          <li>Market conditions and inflation</li>
          <li>Government tax rules</li>
          <li>Interest rate changes</li>
          <li>Bank or employer policies</li>
          <li>Institution-specific formulas</li>
          <li>Rounding methods</li>
        </ul>

        <Typography className="terms-text">
          Therefore, we cannot guarantee that results displayed by our tools
          will match real-world outcomes.
        </Typography>

        {/* USE AT YOUR OWN RISK */}
        <Typography className="terms-heading">3) Use at Your Own Risk</Typography>

        <Typography className="terms-text">
          By using GanakaHub, you agree that all outputs are{" "}
          <strong>used at your own risk</strong>. Any action you take based on
          information or results on this site is strictly your responsibility.
        </Typography>

        <Typography className="terms-text">
          GanakaHub is not liable for:
        </Typography>

        <ul className="terms-list">
          <li>Financial loss or gain</li>
          <li>Academic decisions made using our tools</li>
          <li>Incorrect projections or calculations</li>
          <li>Investment losses or missed returns</li>
          <li>Loan or interest mismatch</li>
          <li>Employment, salary, or benefit calculations</li>
          <li>Any damages—direct, indirect, incidental, or consequential</li>
        </ul>

        {/* THIRD PARTY */}
        <Typography className="terms-heading">
          4) Third-Party Content, Ads &amp; External Links
        </Typography>

        <Typography className="terms-text">
          GanakaHub may contain links to external websites, advertisements, or
          affiliate products. We do <strong>not control, endorse, or guarantee</strong>:
        </Typography>

        <ul className="terms-list">
          <li>The accuracy of third-party content</li>
          <li>Privacy policies of external websites</li>
          <li>Security or availability of external services</li>
          <li>Claims made by advertisers or affiliates</li>
        </ul>

        <Typography className="terms-text">
          You should independently verify information before relying on any
          linked or third-party content.
        </Typography>

        {/* NO LIABILITY */}
        <Typography className="terms-heading">5) No Warranties</Typography>

        <Typography className="terms-text">
          GanakaHub is provided on an{" "}
          <strong>“as-is” and “as-available”</strong> basis without any express
          or implied warranties. This includes, but is not limited to:
        </Typography>

        <ul className="terms-list">
          <li>Accuracy or completeness of tools</li>
          <li>Continuous availability</li>
          <li>Error-free performance</li>
          <li>Security against malware or attacks</li>
          <li>Suitability for financial decisions</li>
        </ul>

        <Typography className="terms-text">
          You acknowledge that website performance may vary or be interrupted.
        </Typography>

        {/* TECHNICAL ERRORS */}
        <Typography className="terms-heading">
          6) Technical Issues, Tools &amp; System Errors
        </Typography>

        <Typography className="terms-text">
          Calculators and tools may sometimes produce unexpected or incorrect
          outputs due to:
        </Typography>

        <ul className="terms-list">
          <li>Browser incompatibility</li>
          <li>User input mistakes</li>
          <li>Network issues</li>
          <li>Server limitations</li>
          <li>Software bugs or coding errors</li>
        </ul>

        <Typography className="terms-text">
          We do not assume responsibility for such errors or their consequences.
        </Typography>

        {/* NO GUARANTEE */}
        <Typography className="terms-heading">
          7) No Guarantee of Financial Performance or Returns
        </Typography>

        <Typography className="terms-text">
          All investment-related tools (including SIP, Lumpsum, Mutual Fund
          Returns, NPS Projection, and EPF calculators) are based on historical
          data or hypothetical assumptions. Past performance is{" "}
          <strong>not</strong> a guarantee of future returns.
        </Typography>

        {/* NOT LIABLE */}
        <Typography className="terms-heading">8) Limitation of Liability</Typography>

        <Typography className="terms-text">
          To the maximum extent permitted by law, GanakaHub is not liable for:
        </Typography>

        <ul className="terms-list">
          <li>Financial loss of any kind</li>
          <li>Career or academic impact</li>
          <li>Errors in calculations or predictions</li>
          <li>Delay or failure of services</li>
          <li>Inaccurate or outdated tool results</li>
        </ul>

        <Typography className="terms-text">
          Your sole remedy for dissatisfaction with the site is to stop using
          it.
        </Typography>

        {/* CHANGES */}
        <Typography className="terms-heading">9) Updates to This Disclaimer</Typography>

        <Typography className="terms-text">
          We may update this Disclaimer at any time to reflect changes in
          services, tools, or legal requirements. Updated versions will appear
          on this page with a new “Last Updated” date. Continued use of the
          website means you accept the revised Disclaimer.
        </Typography>

        {/* CONTACT */}
        <Typography className="terms-heading">10) Contact Us</Typography>

        <Typography className="terms-text">
          If you have questions regarding this Disclaimer or want clarification,
          you may contact us:
          <br />
          <strong>Email:</strong> ganakahub@gmail.com
          <br />
          <strong>Website:</strong> https://www.ganakahub.com
        </Typography>

        <Typography className="terms-text">
          For any concerns related to accuracy or misuse of information, please
          reach out with details so we can investigate promptly.
        </Typography>
      </Container>
    </Box>
  );
}
