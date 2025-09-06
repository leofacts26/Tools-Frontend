import FAQAccordion from "@/components/common/FAQAccordion";
import SIPFormulaBlock from "@/components/common/SIPFormulaBlock";
import SipCalculator from "@/components/finance/SipCalculator";
import { Box, Container, Grid, Paper } from "@mui/material";






export default async function Page({ params }) {
  const { locale } = params;
  const sipcalc = (await import(`../../../../../messages/${locale}/sipcalc.json`)).default;


  return <>

    <Container maxWidth="lg">
      <header>
        <h1 className="finance-heading">{sipcalc.site?.heading ?? "SIP Calculator"}</h1>
      </header>

      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 8 }}>
            <SipCalculator sipcalc={sipcalc} />
          </Grid>

          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 4 }}>
            <Paper elevation={0} sx={{ border: "none", borderRadius: 2, p: { xs: 2, md: 4 }, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
              <h2 className="finance-sub-heading">Popular Calculator</h2>
              <p>Lumpsum Calculator</p>
              <p>SWP Calculator</p>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>

    <Container maxWidth="lg">

      <Box sx={{ flexGrow: 1, mt: 3 }}>
        <Grid container spacing={2}>
          {/* Main content column (article + calculator) */}
          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 8 }}>
            <Paper elevation={0} sx={{ border: "none", borderRadius: 2, p: { xs: 2, md: 4 }, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>

              <article aria-labelledby="What is a SIP Calculator & Why You Need It?" className="finance-article">
                <header>
                  <h2 id="What is a SIP Calculator & Why You Need It?" className="finance-sub-heading">
                    {sipcalc.article.whatIsHeading}
                  </h2>
                  <p>
                    {sipcalc.article.whatIsParagraph}
                  </p>
                </header>

                <section aria-labelledby="how-it-works">
                  <h3 id="how-it-works" className="finance-sub-heading">{sipcalc.article.howItWorks.heading}</h3>
                  <p>
                    {sipcalc.article.howItWorks.paragraph1}
                  </p>

                  <SIPFormulaBlock
                    title={sipcalc.article.howItWorks.formula.title}
                    formula={sipcalc.article.howItWorks.formula.body}
                  />

                  <p>
                    <strong>Example:</strong> {sipcalc.article.howItWorks.example}
                  </p>
                </section>

                <section aria-labelledby="benefits">
                  <h3 id="benefits" className="finance-sub-heading">{sipcalc.article.benefits.heading}</h3>
                  <ul className="ou-list">
                    {sipcalc.article.benefits.points.map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                  </ul>
                </section>

                <section aria-labelledby="benefits" >
                  <h3 id="benefits" className="finance-sub-heading">{sipcalc.article.benefitsOnline.heading}</h3>
                  <p>
                    {sipcalc.article.benefitsOnline.intro}
                  </p>
                  <ol className="ou-list">
                    {sipcalc.article.benefitsOnline.points.map((point, index) => (
                      <li key={index}>
                        <strong>{point.title}</strong> — {point.description}
                      </li>
                    ))}
                  </ol>

                  <p>
                    {sipcalc.article.benefitsOnline.conclusion}
                  </p>
                </section>

                <section aria-labelledby="sip-formula">
                  <h3 id="sip-formula" className="finance-sub-heading">{sipcalc.article.formulaExplained.heading}</h3>
                  <p>
                    {sipcalc.article.formulaExplained.intro}
                  </p>

                  <SIPFormulaBlock
                    title={sipcalc.article.formulaExplained.formula.title}
                    formula={sipcalc.article.formulaExplained.formula.body}
                  />
                  <p>
                    <strong>Example:</strong> {sipcalc.article.formulaExplained.exampleIntro}
                  </p>

                  <table>
                    <thead>
                      <tr>
                        {sipcalc.article.formulaExplained.table.headers.map((header, index) => (
                          <th key={index}>{header}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sipcalc.article.formulaExplained.table.rows.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          {row.map((cell, cellIndex) => (
                            <td key={cellIndex}>{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <p>{sipcalc.article.formulaExplained.conclusion}</p>
                </section>

                <section aria-labelledby="sip-vs-lumpsum">
                  <h3 id="sip-vs-lumpsum" className="finance-sub-heading">{sipcalc.article.sipVsLumpsum.heading}</h3>
                  <p>
                    {sipcalc.article.sipVsLumpsum.intro}
                  </p>

                  <div>
                    <h4 className="finance-sub-heading-h4">{sipcalc.article.sipVsLumpsum.sip.title}</h4>
                    <ul className="ou-list">
                      {sipcalc.article.sipVsLumpsum.sip.points.map((point, index) => (
                        <li key={index}>{point}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="finance-sub-heading-h4">{sipcalc.article.sipVsLumpsum.lumpsum.title}</h4>
                    <ul className="ou-list">
                      {sipcalc.article.sipVsLumpsum.lumpsum.points.map((point, index) => (
                        <li key={index}>{point}</li>
                      ))}
                    </ul>
                  </div>

                  <aside aria-labelledby="key-difference">
                    <h4 id="key-difference" className="finance-sub-heading-h4"> {sipcalc.article.sipVsLumpsum.keyDifference.title}</h4>
                    <p>
                      {sipcalc.article.sipVsLumpsum.keyDifference.points.map((point, index) => (
                        <span key={index}>
                          <strong>{point.label}</strong> → {point.description}
                          <br />
                        </span>
                      ))}
                    </p>
                  </aside>

                  <p>
                    {sipcalc.article.sipVsLumpsum.conclusion}
                  </p>
                </section>

                <section aria-labelledby="how-to-use">
                  <h3 id="how-to-use" className="finance-sub-heading">{sipcalc.article.howToUse.heading}</h3>
                  <p>
                    {sipcalc.article.howToUse.intro}
                  </p>

                  <ol className="ou-list">
                    {sipcalc.article.howToUse.steps.map((step, index) => (
                      <li key={index}>
                        <strong>{step.title}</strong> — {step.description}
                        {step.subpoints && (
                          <ul>
                            {step.subpoints.map((sub, subIndex) => (
                              <li key={subIndex}>{sub}</li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ol>

                  <p>{sipcalc.article.howToUse.conclusion}</p>

                </section>

                <section aria-labelledby="sip-vs-manual">
                  <h3 id="sip-vs-manual" className="finance-sub-heading">{sipcalc.article.sipVsManual.heading}</h3>
                  <p>
                    {sipcalc.article.sipVsManual.intro}
                  </p>

                  <ol className="ou-list">
                    {sipcalc.article.sipVsManual.points.map((point, index) => (
                      <li key={index}>
                        <strong>{point.title}</strong> — {point.description}
                      </li>
                    ))}
                  </ol>

                  <p>{sipcalc.article.sipVsManual.conclusion}</p>
                </section>

                <section aria-labelledby="reasons-to-use">
                  <h3 id="reasons-to-use" className="finance-sub-heading">{sipcalc.article.reasonsToUse.heading}</h3>
                  <p>
                    {sipcalc.article.reasonsToUse.intro}
                  </p>

                  <ol className="ou-list">
                    {sipcalc.article.reasonsToUse.points.map((point, index) => (
                      <li key={index}>
                        <strong>{point.title}</strong> — {point.description}
                      </li>
                    ))}
                  </ol>

                  <p>{sipcalc.article.reasonsToUse.conclusion}</p>
                </section>

                <section aria-labelledby="sip-mistakes">
                  <h3 id="sip-mistakes" className="finance-sub-heading">{sipcalc.article.sipMistakes.heading}</h3>
                  <p>{sipcalc.article.sipMistakes.intro}</p>

                  <ol className="ou-list">
                    {sipcalc.article.sipMistakes.points.map((point, index) => (
                      <li key={index}>
                        <strong>{point.title}</strong> — {point.description}
                      </li>
                    ))}
                  </ol>

                  <p>{sipcalc.article.sipMistakes.conclusion}</p>
                </section>

                <section aria-labelledby="final-thoughts">
                  <h3 id="final-thoughts" className="finance-sub-heading">{sipcalc.article.finalThoughts.heading}</h3>
                  {sipcalc.article.finalThoughts.paragraphs.map((para, index) => (
                    <p key={index}>{para}</p>
                  ))}
                </section>


              </article>


              <FAQAccordion faqs={sipcalc?.faqs ?? []} />


            </Paper>

          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 4 }}>

          </Grid>
        </Grid>
      </Box>
    </Container >
  </>
}