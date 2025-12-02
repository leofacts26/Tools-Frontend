import Heading from "@/components/common/Heading";
import PopularCalculators from "@/components/PopularCalculators";
import { Box, Container, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import SWPCalculator from "@/components/calculators/SWPCalculator";
import { createMetadata, SITE } from "@/lib/seo";
import FAQAccordion from "@/components/common/FAQAccordion";
import Image from 'next/image';





export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || SITE.defaultLocale;

  // Load localized JSON content
  const common =
    (await import(
      `../../../../../messages/${locale}/common.json`
    ).catch(() => ({}))).default || {};

  const pageContent =
    (await import(
      `../../../../../messages/${locale}/swpcalc.json`
    ).catch(() => ({}))).default || {};

  const pageSeo = pageContent.seo || {};

  const opts = {
    title:
      pageSeo.title ||
      pageContent.site?.heading ||
      common.site?.name ||
      SITE.name,

    description: pageSeo.description || common.site?.description || "",

    slug: pageSeo.slug || "swp-calculator", // fallback slug

    image: pageSeo.image || common.site?.defaultImage || "",

    locale,

    isArticle: Boolean(pageSeo.isArticle),

    faqs: pageContent.faqs || [],
  };

  return createMetadata(opts);
}




export default async function Page({ params }) {

  const resolvedParams = await params;     // 🔥 FIX
  const locale = resolvedParams.locale;
  const swp = (await import(`../../../../../messages/${locale}/swpcalc.json`)).default;


  // Build JSON-LD for FAQ (if any)
  const faqJsonLd =
    swp.faqs && swp.faqs.length
      ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: swp.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
      : null;

  // Build Article JSON-LD if isArticle true
  const articleJsonLd = swp.seo?.isArticle
    ? {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: swp.seo?.title || swp.site?.heading,
      description: swp.seo?.description || "",
      author: { "@type": "Person", name: swp.seo?.author || "Author" },
      datePublished: swp.seo?.publishDate,
      dateModified: swp.seo?.modifiedDate,
      image: swp.seo?.image ? `${SITE.url}${swp.seo.image}` : undefined,
      mainEntityOfPage: { "@type": "WebPage", "@id:": `${SITE.url}/${locale}/${swp.seo?.slug || ""}` },
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


    <Container maxWidth="lg">
      <Heading title={swp.site?.heading ?? "SWP (Systematic Withdrawal Plan) Calculator"} />

      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 8 }}>
            <SWPCalculator swp={swp} />
          </Grid>

          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 4 }}>
            <PopularCalculators />
          </Grid>
        </Grid>
      </Box>
    </Container>




    <Container maxWidth="lg">
      <Box sx={{ flexGrow: 1, mt: 3 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 8 }}>
            {/* <Paper elevation={0} sx={{ border: "none", borderRadius: 2, p: { xs: 2, md: 4 }, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}> */}

            <article
              aria-labelledby="swp-intro-heading"
              className="finance-article"
              itemScope
              itemType="https://schema.org/FinancialProduct"
            >

              <Image
                src={swp?.seo?.image}
                alt="SWP (Systematic Withdrawal Plan) Calculator"
                className="img-fluid mb-4 img-rounded"
                width={763}
                height={429}
                layout="responsive"
                objectFit="contain"
                style={{ marginTop: '20px' }}
              />


              <header>
                <h2
                  id="swp-intro-heading"
                  className="finance-sub-heading"
                  itemProp="name"
                >
                  {swp?.article?.intro?.heading ?? "What is an SWP (Systematic Withdrawal Plan)?"}
                </h2>

                {swp?.article?.intro?.paragraphs?.[0] && (
                  <p
                    itemProp="description"
                    dangerouslySetInnerHTML={{ __html: swp.article.intro.paragraphs[0] }}
                  />
                )}

                {swp?.article?.intro?.paragraphs?.[1] && (
                  <p dangerouslySetInnerHTML={{ __html: swp.article.intro.paragraphs[1] }} />
                )}
              </header>


              <section aria-labelledby="swp-how-it-works" className="finance-section">
                <h3 id="swp-how-it-works" className="finance-sub-subheading">
                  {swp?.article?.howItWorks?.heading ?? "How Does SWP Work?"}
                </h3>

                <ol className="ou-list" aria-label="How SWP works list">
                  {swp?.article?.howItWorks?.steps?.map((step, idx) => (
                    <li key={idx}>
                      <strong>{step.title}:</strong> {step.description}
                    </li>
                  ))}
                </ol>

                <div className="example-box" role="region" aria-label="SWP example">
                  <h4 className="example-heading">
                    {swp?.article?.howItWorks?.example?.title ?? "Example"}
                  </h4>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: swp?.article?.howItWorks?.example?.body ?? ""
                    }}
                  />
                </div>
              </section>


              <section aria-labelledby="swp-why-invest" className="finance-section">
                <h3 id="swp-why-invest" className="finance-sub-subheading">
                  {swp?.article?.whyInvest?.heading ?? "Why Do Investors Choose SWP?"}
                </h3>

                <ul className="ou-list" aria-label="SWP benefits">
                  {swp?.article?.whyInvest?.points?.map((point, idx) => (
                    <li key={idx}>
                      <strong>{point.title}:</strong> {point.description}
                    </li>
                  ))}
                </ul>
              </section>



              <section
                aria-labelledby="swp-calculator"
                className="finance-section"
                itemScope
                itemType="https://schema.org/Tool"
              >
                <h2 id="swp-calculator" className="finance-sub-heading">
                  {swp?.article?.calculator?.heading ?? "What is an SWP Calculator?"}
                </h2>

                {swp?.article?.calculator?.paragraphs?.map((para, idx) => (
                  <p
                    key={idx}
                    itemProp={idx === 0 ? "description" : undefined}
                    dangerouslySetInnerHTML={{ __html: para }}
                  />
                ))}

                <section aria-labelledby="swp-calculator-benefits">
                  <h3 id="swp-calculator-benefits" className="finance-sub-subheading">
                    {swp?.article?.calculator?.benefits?.heading ??
                      "How an SWP Calculator Helps Investors"}
                  </h3>
                  <ul className="ou-list">
                    {swp?.article?.calculator?.benefits?.points?.map((point, idx) => (
                      <li key={idx}>
                        <strong>{point.title}:</strong> {point.description}
                      </li>
                    ))}
                  </ul>
                </section>
              </section>



              <section
                aria-labelledby="swp-how-it-works"
                className="finance-section"
                itemScope
                itemType="https://schema.org/HowTo"
              >
                <h2 id="swp-how-it-works" className="finance-sub-heading">
                  {swp?.article?.howCalculatorWorks?.heading ??
                    "How Does an SWP Calculator Work?"}
                </h2>

                <p
                  dangerouslySetInnerHTML={{
                    __html: swp?.article?.howCalculatorWorks?.intro ?? ""
                  }}
                />

                {/* Example Section */}
                <section aria-labelledby="swp-example">
                  <h3 id="swp-example" className="finance-sub-subheading">
                    {swp?.article?.howCalculatorWorks?.example?.heading ??
                      "Example Calculation"}
                  </h3>

                  <p
                    dangerouslySetInnerHTML={{
                      __html: swp?.article?.howCalculatorWorks?.example?.intro ?? ""
                    }}
                  />

                  <div className="example-box" role="region" aria-label="SWP summary example">
                    <h4 className="example-heading">
                      {swp?.article?.howCalculatorWorks?.example?.summary?.title ??
                        "Summary"}
                    </h4>
                    <ul className="ou-list">
                      {swp?.article?.howCalculatorWorks?.example?.summary?.points?.map(
                        (point, idx) => (
                          <li key={idx}>
                            <strong>{point.label}:</strong> {point.value}
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                  <p
                    dangerouslySetInnerHTML={{
                      __html:
                        swp?.article?.howCalculatorWorks?.example?.conclusion ?? ""
                    }}
                  />
                </section>

                {/* Why Matters Section */}
                <section aria-labelledby="swp-why-matters">
                  <h3 id="swp-why-matters" className="finance-sub-subheading">
                    {swp?.article?.howCalculatorWorks?.whyMatters?.heading ??
                      "Why This Matters"}
                  </h3>

                  <ul className="ou-list">
                    {swp?.article?.howCalculatorWorks?.whyMatters?.points?.map(
                      (point, idx) => (
                        <li
                          key={idx}
                          dangerouslySetInnerHTML={{ __html: point }}
                        />
                      )
                    )}
                  </ul>

                  <p
                    dangerouslySetInnerHTML={{
                      __html:
                        swp?.article?.howCalculatorWorks?.whyMatters?.conclusion ?? ""
                    }}
                  />
                </section>
              </section>



              <section
                aria-labelledby="swp-benefits"
                className="finance-section"
                itemScope
                itemType="https://schema.org/Thing"
              >
                <h2 id="swp-benefits" className="finance-sub-heading">
                  {swp?.article?.benefitsCalculator?.heading ??
                    "Benefits of Using an SWP Calculator"}
                </h2>

                <p
                  dangerouslySetInnerHTML={{
                    __html: swp?.article?.benefitsCalculator?.intro ?? ""
                  }}
                />

                <section aria-labelledby="swp-key-benefits">
                  <h3 id="swp-key-benefits" className="finance-sub-subheading">
                    {swp?.article?.benefitsCalculator?.keyBenefits?.heading ??
                      "Key Benefits"}
                  </h3>
                  <ul className="ou-list">
                    {swp?.article?.benefitsCalculator?.keyBenefits?.points?.map(
                      (point, idx) => (
                        <li key={idx}>
                          <strong>{point.title}:</strong> {point.description}
                        </li>
                      )
                    )}
                  </ul>
                </section>

                <p
                  dangerouslySetInnerHTML={{
                    __html: swp?.article?.benefitsCalculator?.conclusion ?? ""
                  }}
                />
              </section>


              <section
                aria-labelledby="swp-guide"
                className="finance-section"
                itemScope
                itemType="https://schema.org/HowTo"
              >
                <h2 id="swp-guide" className="finance-sub-heading">
                  {swp?.article?.guide?.heading ?? "Step-by-Step Guide: How to Use an SWP Calculator"}
                </h2>

                <p
                  dangerouslySetInnerHTML={{ __html: swp?.article?.guide?.intro ?? "" }}
                />

                <section aria-labelledby="swp-steps">
                  <h3 id="swp-steps" className="finance-sub-subheading">
                    {swp?.article?.guide?.stepsHeading ?? "Steps to Use the SWP Calculator"}
                  </h3>

                  <ul className="ou-list">
                    {swp?.article?.guide?.steps?.map((step, idx) => (
                      <li key={idx}>
                        <strong>{step.title}:</strong> {step.description}
                      </li>
                    ))}
                  </ul>
                </section>

                <section aria-labelledby="swp-why-important">
                  <h3 id="swp-why-important" className="finance-sub-subheading">
                    {swp?.article?.guide?.whyHeading ?? "Why This Matters"}
                  </h3>

                  <p
                    dangerouslySetInnerHTML={{ __html: swp?.article?.guide?.whyText ?? "" }}
                  />
                </section>
              </section>



              <section
                aria-labelledby="swp-example"
                className="finance-section"
                itemScope
                itemType="https://schema.org/HowTo"
              >
                <h2 id="swp-example" className="finance-sub-heading">
                  {swp?.article?.example?.heading ?? "Example of SWP Calculation"}
                </h2>

                <p
                  dangerouslySetInnerHTML={{ __html: swp?.article?.example?.intro ?? "" }}
                />

                {swp?.article?.example?.scenario?.map((para, idx) => (
                  <p key={idx} dangerouslySetInnerHTML={{ __html: para }} />
                ))}

                <section aria-labelledby="swp-summary">
                  <h3 id="swp-summary" className="finance-sub-subheading">
                    {swp?.article?.example?.summary?.heading ?? "SWP Calculation Summary"}
                  </h3>
                  <ul className="ou-list">
                    {swp?.article?.example?.summary?.items?.map((item, idx) => (
                      <li key={idx}>
                        <strong>{item.label}:</strong> {item.value}
                      </li>
                    ))}
                  </ul>
                </section>

                <section aria-labelledby="swp-schedule">
                  <h3 id="swp-schedule" className="finance-sub-subheading">
                    {swp?.article?.example?.schedule?.heading ?? "Sample Withdrawal Schedule"}
                  </h3>

                  <TableContainer component={Paper}>
                    <Table aria-label="SWP Table">
                      <TableHead>
                        <TableRow>
                          <TableCell style={{ fontWeight: 600 }}>Month</TableCell>
                          <TableCell style={{ fontWeight: 600 }}>Opening Balance</TableCell>
                          <TableCell style={{ fontWeight: 600 }}>Withdrawal</TableCell>
                          <TableCell style={{ fontWeight: 600 }}>Closing Balance*</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {swp?.article?.example?.schedule?.tableRows?.map((row, rowIndex) => (
                          <TableRow key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                              <TableCell key={cellIndex}>{cell}</TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <p>
                    <em>{swp?.article?.example?.schedule?.footnote ?? "*Balances shown after adjusting for returns."}</em>
                  </p>
                </section>

                <section aria-labelledby="swp-meaning">
                  <h3 id="swp-meaning" className="finance-sub-subheading">
                    {swp?.article?.example?.meaning?.heading ?? "What This Means"}
                  </h3>
                  {swp?.article?.example?.meaning?.paragraphs?.map((p, idx) => (
                    <p key={idx} dangerouslySetInnerHTML={{ __html: p }} />
                  ))}
                </section>
              </section>




              <section
                aria-labelledby="swp-users"
                className="finance-section"
                itemScope
                itemType="https://schema.org/Audience"
              >
                <h2 id="swp-users" className="finance-sub-heading">
                  {swp?.article?.users?.heading ?? "Who Should Use an SWP Calculator?"}
                </h2>

                <p
                  dangerouslySetInnerHTML={{
                    __html:
                      swp?.article?.users?.intro ??
                      "An <strong>SWP Calculator</strong> is useful for anyone who wants to balance <strong>regular income and long-term investment growth</strong>. It is especially helpful for people who need predictable cash flow without liquidating their entire investment."
                  }}
                />

                <section aria-labelledby="swp-ideal-users">
                  <h3 id="swp-ideal-users" className="finance-sub-subheading">
                    {swp?.article?.users?.ideal?.heading ??
                      "Ideal Users of an SWP Calculator"}
                  </h3>
                  <ul className="ou-list">
                    {swp?.article?.users?.ideal?.points?.map((point, idx) => (
                      <li key={idx}>
                        <strong>{point.title}:</strong> {point.description}
                      </li>
                    ))}
                  </ul>
                </section>

                <section aria-labelledby="swp-why-use">
                  <h3 id="swp-why-use" className="finance-sub-subheading">
                    {swp?.article?.users?.why?.heading ?? "Why Use It?"}
                  </h3>
                  <p
                    dangerouslySetInnerHTML={{
                      __html:
                        swp?.article?.users?.why?.text ??
                        "By showing exactly <strong>how much you can withdraw</strong> and <strong>how long your funds will last</strong>, an <strong>SWP Calculator for mutual funds</strong> helps different types of investors plan better and avoid the risk of running out of money too early."
                    }}
                  />
                </section>
              </section>



              <section
                aria-labelledby="swp-advantages"
                className="finance-section"
                itemScope
                itemType="https://schema.org/Thing"
              >
                <h2 id="swp-advantages" className="finance-sub-heading">
                  {swp?.article?.advantages?.heading ?? "Key Advantages of SWP"}
                </h2>

                <p
                  dangerouslySetInnerHTML={{
                    __html:
                      swp?.article?.advantages?.intro ??
                      "A <strong>Systematic Withdrawal Plan (SWP)</strong> offers several advantages over traditional savings options like Fixed Deposits (FDs) or Recurring Deposits (RDs). While FDs and RDs provide safety and fixed returns, SWPs bring in <strong>flexibility, tax efficiency, and growth potential</strong>—making them a preferred choice for many investors."
                  }}
                />

                <section aria-labelledby="swp-why-better">
                  <h3 id="swp-why-better" className="finance-sub-subheading">
                    {swp?.article?.advantages?.whyBetter?.heading ?? "Why SWP is Better"}
                  </h3>
                  <ul className="ou-list">
                    {swp?.article?.advantages?.whyBetter?.points?.map((point, idx) => (
                      <li key={idx}>
                        <strong>{point.title}:</strong> {point.description}
                      </li>
                    ))}
                  </ul>
                </section>

                <p
                  dangerouslySetInnerHTML={{
                    __html:
                      swp?.article?.advantages?.conclusion ??
                      "In short, an SWP combines the <strong>predictability of income</strong> with the <strong>potential of investment growth</strong>, making it a smarter alternative for modern investors."
                  }}
                />
              </section>




              <section
                aria-labelledby="swp-considerations"
                className="finance-section"
                itemScope
                itemType="https://schema.org/Thing"
              >
                <h2 id="swp-considerations" className="finance-sub-heading">
                  {swp?.article?.considerations?.heading ?? "Things to Keep in Mind While Using an SWP Calculator"}
                </h2>

                <p
                  dangerouslySetInnerHTML={{
                    __html:
                      swp?.article?.considerations?.intro ??
                      "While an <strong>SWP Calculator</strong> gives you quick and accurate projections, it’s important to remember that the results are <strong>based on assumptions</strong>. Mutual funds are market-linked, which means your actual returns can differ from what the calculator shows. Keeping a few points in mind will help you plan better:"
                  }}
                />

                <section aria-labelledby="swp-important-considerations">
                  <h3 id="swp-important-considerations" className="finance-sub-subheading">
                    {swp?.article?.considerations?.important?.heading ?? "Important Considerations"}
                  </h3>

                  <ul className="ou-list">
                    {swp?.article?.considerations?.important?.points?.map((point, idx) => (
                      <li key={idx}>
                        <strong>{point.title}:</strong> {point.description}
                      </li>
                    ))}
                  </ul>
                </section>

                <p
                  dangerouslySetInnerHTML={{
                    __html:
                      swp?.article?.considerations?.conclusion ??
                      "In short, an <strong>SWP Calculator for mutual funds</strong> is a powerful planning tool — but always use realistic assumptions and align it with your financial goals."
                  }}
                />
              </section>




              <section
                aria-labelledby="why-our-swp-calculator"
                className="finance-section"
                itemScope
                itemType="https://schema.org/Tool"
              >
                <h2 id="why-our-swp-calculator" className="finance-sub-heading">
                  {swp?.article?.whyOurCalculator?.heading ?? "Why Use Our SWP Calculator?"}
                </h2>

                <p
                  dangerouslySetInnerHTML={{
                    __html:
                      swp?.article?.whyOurCalculator?.intro1 ??
                      "With so many financial tools available online, you might wonder why you should choose our <strong>SWP Calculator</strong>. The answer is simple — we built it to be <strong>fast, accurate, and completely user-friendly</strong>."
                  }}
                />

                <p
                  dangerouslySetInnerHTML={{
                    __html:
                      swp?.article?.whyOurCalculator?.intro2 ??
                      "Our calculator doesn’t just show you numbers; it gives you a <strong>clear financial roadmap</strong>. By entering your investment details, you instantly see your total withdrawals, remaining balance, and final maturity value — all in one place."
                  }}
                />

                <section aria-labelledby="swp-difference">
                  <h3 id="swp-difference" className="finance-sub-subheading">
                    {swp?.article?.whyOurCalculator?.difference?.heading ??
                      "What Makes Our SWP Calculator Different?"}
                  </h3>
                  <ul className="ou-list">
                    {swp?.article?.whyOurCalculator?.difference?.points?.map((point, idx) => (
                      <li key={idx}>
                        <strong>{point.title}:</strong> {point.description}
                      </li>
                    ))}
                  </ul>
                </section>

                <p
                  dangerouslySetInnerHTML={{
                    __html:
                      swp?.article?.whyOurCalculator?.conclusion ??
                      "In short, our <strong>Systematic Withdrawal Plan Calculator</strong> is more than just a tool — it’s your <strong>personal investment planner</strong>, helping you make smart decisions with confidence."
                  }}
                />
              </section>



              <section
                aria-labelledby="swp-conclusion"
                className="finance-section conclusion-section"
                itemScope
                itemType="https://schema.org/WebPageElement"
              >
                <h2 id="swp-conclusion" className="finance-sub-heading">
                  {swp?.article?.conclusion?.heading ?? "Conclusion: Plan Smarter with an SWP Calculator"}
                </h2>

                {swp?.article?.conclusion?.paragraphs?.map((p, idx) => (
                  <p key={idx} dangerouslySetInnerHTML={{ __html: p }} />
                ))}

                <div className="cta-box" role="region" aria-label="Call to action">
                  <p dangerouslySetInnerHTML={{ __html: swp?.article?.conclusion?.cta?.lead ?? "✅ <strong>Take the next step today!</strong>" }} />
                  <p dangerouslySetInnerHTML={{ __html: swp?.article?.conclusion?.cta?.body ?? "Use our <strong>free SWP Calculator</strong> now and start planning your withdrawals with confidence. Turn your investments into a steady income stream — smart, flexible, and tailored to your goals." }} />
                </div>
              </section>




            </article>

            <FAQAccordion faqs={swp?.faqs ?? []}  title="SWP (Systematic Withdrawal Plan) Calculator: FAQs" />


            {/* </Paper> */}
          </Grid>

          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 4 }}>
          </Grid>

        </Grid>
      </Box>
    </Container >

  </>
}