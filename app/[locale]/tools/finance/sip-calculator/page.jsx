import FAQAccordion from "@/components/common/FAQAccordion";
import SIPFormulaBlock from "@/components/common/SIPFormulaBlock";
import SipCalculator from "@/components/finance/SipCalculator";
import { sipCalculatorsFaqs } from "@/lib/faq-data";
import { Box, Container, Grid, Paper } from "@mui/material";



export default function Page() {
  return <>
    <Container maxWidth="lg">
      <header>
        <h1 className="finance-heading">SIP Calculator</h1>
      </header>

      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 8 }}>
            <SipCalculator id="#sip-calculator" />
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
                    What is a SIP Calculator & Why You Need It?
                  </h2>
                  <p>
                    When it comes to smart investing, one of the most popular tools today is the SIP Calculator.
                    SIP stands for Systematic Investment Plan — a disciplined way of investing a fixed amount in
                    mutual funds at regular intervals (monthly, quarterly or weekly). A SIP Calculator helps you
                    estimate future value using three inputs: monthly investment, expected annual return and tenure.
                  </p>
                </header>

                <section aria-labelledby="how-it-works">
                  <h3 id="how-it-works" className="finance-sub-heading">How Does a SIP Calculator Work?</h3>
                  <p>
                    A SIP Calculator uses compound interest and regular investments to project how consistent
                    contributions grow over time. Instead of investing a lump sum, SIPs let you invest smaller
                    amounts periodically and benefit from rupee cost averaging and compounding.
                  </p>

                  <SIPFormulaBlock
                    title="Formula used by a basic SIP Calculator"
                    formula={`M = P × [ (1 + i)^n – 1 ] / i × (1 + i)
Where:
M = Maturity amount (final value)
P = Fixed investment amount (monthly SIP)
i = Periodic rate (annual return ÷ 12)
n = Total number of installments (months × years)`}
                  />





                  <p>
                    <strong>Example:</strong> Investing ₹5,000/month for 10 years at an expected 12% annual return
                    can yield a maturity value of over ₹11 lakh (approx). The calculator instantly compares scenarios
                    so you can set realistic goals.
                  </p>
                </section>

                <section aria-labelledby="benefits">
                  <h3 id="benefits" className="finance-sub-heading">Why Use a SIP Calculator?</h3>
                  <ul className="ou-list">
                    <li>Quickly estimate future corpus and plan financial goals.</li>
                    <li>Compare different monthly amounts, rates and tenures instantly.</li>
                    <li>Remove guesswork and make disciplined decisions.</li>
                  </ul>
                </section>

                <section aria-labelledby="benefits" >
                  <h3 id="benefits" className="finance-sub-heading">Benefits of Using a SIP Calculator Online</h3>
                  <p>
                    When planning your investments, a SIP Calculator online acts as more than just a
                    number-crunching tool—it becomes your personal financial guide. Here are some of the
                    top benefits:
                  </p>
                  <ol className="ou-list">
                    <li>
                      <strong>Quick &amp; Accurate Estimates</strong> — Manually calculating SIP returns can
                      be tricky because of compounding. A SIP Calculator gives you instant, error-free
                      projections, saving time and effort.
                    </li>
                    <li>
                      <strong>Better Financial Planning</strong> — By showing the future value of your
                      investments, the calculator helps you decide how much to invest regularly to achieve
                      your goals—whether it’s buying a house, creating a retirement fund, or planning for
                      your child’s education.
                    </li>
                    <li>
                      <strong>Easy to Compare Scenarios</strong> — Want to see the difference between
                      investing ₹5,000 vs ₹10,000 a month, or for 10 years vs 15 years? A SIP Calculator
                      lets you compare scenarios instantly, so you can choose the plan that suits your
                      budget and timeline.
                    </li>
                    <li>
                      <strong>Encourages Discipline &amp; Savings Habit</strong> — When you visualize the
                      long-term growth of small, consistent investments, it motivates you to stay
                      disciplined and continue investing regularly.
                    </li>
                  </ol>
                  <p>
                    In short, using a SIP Calculator online ensures you make informed, confident, and
                    goal-oriented investment decisions.
                  </p>
                </section>

                <section aria-labelledby="sip-formula">
                  <h3 id="sip-formula" className="finance-sub-heading">SIP Calculator Formula Explained with Example</h3>
                  <p>
                    At the core of every SIP Calculator lies the power of compounding. The tool uses a
                    simple mathematical formula to project how your investments can grow over time:
                  </p>

                  <SIPFormulaBlock
                    title="SIP Formula"
                    formula={`M = P × [(1 + i)^n – 1] / i × (1 + i)

Where:
M = Maturity amount (final value at the end of investment)
P = Monthly investment (your SIP amount)
i = Periodic rate of return (annual return ÷ 12, compounded)
n = Total number of months (years × 12)`}
                  />





                  <p>
                    <strong>Example:</strong> Suppose you invest ₹10,000 per month for 10 years at an
                    expected return of 12% annually. Here’s how the SIP Calculator projects your growth:
                  </p>

                  <table>
                    <thead>
                      <tr>
                        <th>Monthly SIP (₹)</th>
                        <th>Tenure (Years)</th>
                        <th>Expected Return (p.a.)</th>
                        <th>Maturity Value (₹)</th>
                        <th>Wealth Gain (₹)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>5,000</td>
                        <td>10</td>
                        <td>12%</td>
                        <td>11,61,695</td>
                        <td>5,61,695</td>
                      </tr>
                      <tr>
                        <td>10,000</td>
                        <td>10</td>
                        <td>12%</td>
                        <td>23,23,390</td>
                        <td>11,23,390</td>
                      </tr>
                      <tr>
                        <td>20,000</td>
                        <td>10</td>
                        <td>12%</td>
                        <td>46,46,780</td>
                        <td>22,46,780</td>
                      </tr>
                    </tbody>
                  </table>

                  <p>
                    As you can see, even modest investments grow significantly due to the power of
                    compounding. A SIP Calculator formula ensures you get precise results without manual
                    errors and helps you visualize your wealth journey.
                  </p>
                </section>

                <section aria-labelledby="sip-vs-lumpsum">
                  <h3 id="sip-vs-lumpsum" className="finance-sub-heading">Difference Between SIP Calculator and Lump Sum Calculator</h3>
                  <p>
                    When it comes to mutual fund investments, investors often wonder whether to invest a
                    lump sum amount at once or choose the Systematic Investment Plan (SIP) route. Both
                    approaches have their advantages, and to understand them better, online tools like a
                    SIP Calculator and a Lump Sum Calculator come into play.
                  </p>

                  <div>
                    <h4 className="finance-sub-heading-h4">SIP Calculator</h4>
                    <ul>
                      <li>Designed for those who invest small amounts periodically (monthly/quarterly).</li>
                      <li>
                        Helps you estimate returns by factoring in compounding and rupee cost averaging.
                      </li>
                      <li>
                        Suitable for salaried individuals or anyone who wants to build wealth gradually
                        without timing the market.
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="finance-sub-heading-h4">Lump Sum Calculator</h4>
                    <ul>
                      <li>Useful for investors who put in a one-time large investment.</li>
                      <li>
                        Projects returns based on the invested principal, tenure, and expected return rate.
                      </li>
                      <li>
                        Best suited when you have surplus funds and can tolerate short-term volatility.
                      </li>
                    </ul>
                  </div>

                  <aside aria-labelledby="key-difference">
                    <h4 id="key-difference" className="finance-sub-heading-h4">Key Difference</h4>
                    <p>
                      <strong>SIP Calculator</strong> → focuses on regular, disciplined investments and
                      gradual wealth creation.
                      <br />
                      <strong>Lump Sum Calculator</strong> → shows how a single large investment grows
                      over time.
                    </p>
                  </aside>

                  <p>
                    In short, if you prefer consistency and lower risk, SIP is the way forward. But if you
                    already have a large capital to deploy, lump sum investments might suit you better.
                    Either way, these calculators help you plan smarter and invest wisely.
                  </p>
                </section>

                <section aria-labelledby="how-to-use">
                  <h3 id="how-to-use" className="finance-sub-heading">How to Use a SIP Calculator Step by Step</h3>
                  <p>
                    Using a SIP Calculator is simple, quick, and requires no financial expertise. Whether
                    you’re a beginner or an experienced investor, the calculator helps you project your
                    future wealth in just a few clicks. Here’s a step-by-step guide:
                  </p>

                  <ol className="ou-list">
                    <li>
                      <strong>Enter Your Monthly Investment (SIP Amount)</strong> — Decide how much you
                      want to invest regularly. For example, ₹5,000 per month.
                    </li>
                    <li>
                      <strong>Select the Investment Tenure</strong> — Choose the duration of your
                      investment. Most SIPs run for 5, 10, 15, or 20 years, depending on your goal.
                    </li>
                    <li>
                      <strong>Input the Expected Rate of Return</strong> — This is the annual return rate
                      you expect from your mutual fund (commonly 10–15% for equity funds). The calculator
                      will convert it into a monthly compounded rate automatically.
                    </li>
                    <li>
                      <strong>Get Instant Results</strong> — The calculator will show you:
                      <ul>
                        <li>Total Investment (Principal)</li>
                        <li>Estimated Returns (Wealth Gain)</li>
                        <li>Maturity Value (Principal + Returns)</li>
                      </ul>
                    </li>
                    <li>
                      <strong>Compare &amp; Adjust</strong> — You can easily change the SIP amount,
                      tenure, or expected return to test different scenarios until you find the perfect
                      plan for your goals.
                    </li>
                  </ol>

                  <p>
                    With this simple process, a SIP Calculator online becomes your financial roadmap,
                    helping you set realistic expectations and stay disciplined.
                  </p>
                </section>

                <section aria-labelledby="sip-vs-manual">
                  <h3 id="sip-vs-manual" className="finance-sub-heading">Why SIP Calculator is Better Than Manual Calculation</h3>
                  <p>
                    While it’s possible to calculate SIP returns manually using the compounding formula, in
                    reality, it’s time-consuming, complex, and prone to errors. That’s where a SIP
                    Calculator becomes a game-changer:
                  </p>

                  <ol className="ou-list">
                    <li>
                      <strong>Accuracy You Can Trust</strong> — The SIP maturity formula involves powers,
                      exponents, and compounding rates that can easily be miscalculated on paper or even
                      in spreadsheets. A SIP Calculator online eliminates errors and gives you precise
                      results instantly.
                    </li>
                    <li>
                      <strong>Saves Time &amp; Effort</strong> — Why spend hours crunching numbers when you
                      can get the answer in seconds? A calculator simplifies the process and frees you from
                      repetitive calculations.
                    </li>
                    <li>
                      <strong>Easy to Experiment</strong> — If you want to test different investment
                      amounts, tenures, or expected returns, manual calculation means starting from scratch
                      every time. With a SIP Calculator, you just tweak the inputs and see results
                      immediately.
                    </li>
                    <li>
                      <strong>User-Friendly &amp; Accessible</strong> — Most calculators are available for
                      free online and require no technical knowledge. Anyone—from a college student to a
                      working professional—can use it effortlessly.
                    </li>
                  </ol>

                  <p>
                    In short, a SIP Calculator is faster, smarter, and more reliable than manual
                    calculations, ensuring your financial decisions are based on accurate projections.
                  </p>
                </section>

                <section aria-labelledby="reasons-to-use">
                  <h3 id="reasons-to-use" className="finance-sub-heading">Top Reasons to Use SIP Calculator Before Investing in Mutual Funds</h3>
                  <p>
                    Before starting any investment, especially in mutual funds, it’s important to have
                    clarity on expected outcomes. A SIP Calculator helps you plan smarter by projecting
                    your wealth growth well in advance. Here’s why you should use it before investing:
                  </p>

                  <ol className="ou-list">
                    <li>
                      <strong>Goal-Oriented Planning</strong> — Whether it’s buying a house, creating a
                      retirement corpus, or funding your child’s education, a SIP Calculator helps you
                      align investments with financial goals.
                    </li>
                    <li>
                      <strong>Understand Wealth Creation Potential</strong> — By entering your SIP amount,
                      tenure, and expected return, you can clearly see how much wealth your mutual fund SIP
                      can generate over time.
                    </li>
                    <li>
                      <strong>Compare Multiple Funds or Strategies</strong> — Want to check how a SIP in
                      an equity fund compares to a debt fund? Or how a 10-year investment differs from a
                      15-year one? The calculator makes comparisons effortless.
                    </li>
                    <li>
                      <strong>Avoid Unrealistic Expectations</strong> — Many new investors overestimate
                      returns. A SIP Calculator sets realistic expectations by showing compounded, not
                      inflated, results.
                    </li>
                    <li>
                      <strong>Encourages Long-Term Discipline</strong> — When you see how small investments
                      grow massively over decades, it motivates you to stay consistent and not withdraw
                      prematurely.
                    </li>
                  </ol>

                  <p>
                    In short, using a SIP Calculator before investing in mutual funds gives you confidence,
                    clarity, and a strategy-driven approach to wealth building.
                  </p>
                </section>

                <section aria-labelledby="sip-mistakes">
                  <h3 id="sip-mistakes" className="finance-sub-heading">Common Mistakes People Make While Using SIP Calculator</h3>
                  <p>
                    A SIP Calculator is simple and highly effective, but many investors misuse it due to
                    lack of awareness. Avoiding these mistakes can help you get more accurate results and
                    make better financial decisions:
                  </p>

                  <ol className="ou-list">
                    <li>
                      <strong>Assuming Linear Returns</strong> — Some investors think mutual fund returns
                      are fixed. In reality, they fluctuate with market conditions. A SIP Calculator gives
                      an estimate, not a guarantee.
                    </li>
                    <li>
                      <strong>Using Incorrect Return Rate</strong> — Many users simply divide the annual
                      return by 12 to get the monthly rate. This is wrong because returns are compounded.
                      Always rely on the calculator’s in-built formula for accuracy.
                    </li>
                    <li>
                      <strong>Ignoring Investment Tenure</strong> — Investors often test short tenures like
                      2–3 years, expecting massive gains. SIPs work best in the long term (10–20 years) due
                      to compounding.
                    </li>
                    <li>
                      <strong>Forgetting Exit Load &amp; Taxes</strong> — A SIP Calculator does not include
                      factors like exit load, expense ratio, or taxation. Not considering these may give
                      you an inflated maturity amount.
                    </li>
                    <li>
                      <strong>Not Comparing Different Scenarios</strong> — Some people enter one figure and
                      stop. Smart investors use the SIP Calculator to test different SIP amounts, tenures,
                      and returns before finalizing a plan.
                    </li>
                  </ol>

                  <p>
                    By avoiding these mistakes, you can use the SIP Calculator effectively and set
                    realistic financial goals.
                  </p>
                </section>

                <section aria-labelledby="final-thoughts">
                  <h3 id="final-thoughts" className="finance-sub-heading">Final Thoughts: Why Every Investor Should Use a SIP Calculator</h3>
                  <p>
                    In today’s fast-paced world, where financial planning is as important as career
                    planning, a SIP Calculator has become a must-have tool for every investor. It not only
                    simplifies complex compounding math but also provides clarity and confidence in your
                    investment journey.
                  </p>
                  <p>
                    Whether you’re just starting with a modest monthly SIP of ₹1,000 or planning larger
                    investments, the calculator shows you exactly how your money can grow over time. It
                    empowers you to align your investments with long-term goals like retirement planning,
                    child’s education, or wealth creation.
                  </p>
                  <p>
                    The biggest advantage of a SIP Calculator is its ability to give realistic projections.
                    Unlike assumptions or guesswork, it helps you test multiple scenarios—different SIP
                    amounts, tenure, and expected returns—so you can choose the plan that fits your budget
                    and aspirations.
                  </p>
                  <p>
                    Moreover, by visualizing the power of compounding, investors stay motivated to continue
                    their SIPs without interruption, even during market volatility. This consistency is
                    what builds wealth in the long run.
                  </p>
                  <p>
                    <strong>In conclusion:</strong> If you want to take the guesswork out of investing and
                    make informed, goal-driven financial decisions, using a SIP Calculator online should be
                    your very first step. It’s simple, free, and could be the smartest financial habit you
                    develop today.
                  </p>
                </section>


              </article>


              <FAQAccordion faqs={sipCalculatorsFaqs} />

        </Paper>

          </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 4 }}>

        </Grid>
      </Grid>
    </Box>
  </Container >
  </>
}