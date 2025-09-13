"use client";
import { Box, Grid, Paper, Stack, Typography, Divider } from "@mui/material";
import { useState, useMemo } from "react";
import CustomInput from "../common/CustomInput";
import CustomSlider from "../common/CustomSlider";
import SWPResultsSummary from "../common/SWPResultsSummary";
import { fmtINR } from "@/lib/utils";

const SWPCalculator = ({ swp }) => {
  const [investment, setInvestment] = useState(500000);
  const [withdrawal, setWithdrawal] = useState(10000);
  const [rate, setRate] = useState(8); // annual rate in %
  const [years, setYears] = useState(5);


  // replace your existing useMemo with this block
  const { totalWithdrawal, finalValue } = useMemo(() => {
    const P = Number(investment) || 0;
    const w_raw = Number(withdrawal) || 0;
    const yrs = Number(years) || 0;
    const N = Math.max(0, Math.round(yrs * 12));
    const annual = Number(rate) || 0;

    // monthly rate using compounding conversion (matching Groww)
    const monthlyRate = Math.pow(1 + annual / 100, 1 / 12) - 1;

    const roundPaise = (x) => Math.round(x * 100) / 100; // two decimals
    const roundRupee = (x) => Math.round(x); // integer rupee for UI

    let balance = roundPaise(P);
    let totalWithdrawn = 0;

    for (let m = 1; m <= N; m++) {
      // 1) apply monthly interest first (compound)
      if (monthlyRate !== 0) {
        balance = roundPaise(balance * (1 + monthlyRate));
      }

      // 2) then withdraw (end-of-month), withdraw rounded to nearest rupee
      const withdrawThisMonth = Math.min(balance, roundRupee(w_raw));
      balance = roundPaise(balance - withdrawThisMonth);
      totalWithdrawn += withdrawThisMonth;

      if (balance <= 0) {
        balance = 0;
        break;
      }
    }

    return { totalWithdrawal: roundRupee(totalWithdrawn), finalValue: roundRupee(balance) };
  }, [investment, withdrawal, rate, years]);



  return (
    <Paper
      elevation={0}
      sx={{
        border: "none",
        borderRadius: 2,
        p: { xs: 2, md: 4 },
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 12 }}>

            {/* Total Investment */}
            <Box sx={{ mb: 4 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                <Typography variant="subtitle1">
                  {swp?.form?.lumpsumInvestment ?? "Total Investment"}
                </Typography>
                <CustomInput
                  value={investment}
                  onChange={setInvestment}
                  startAdornment="₹"
                  aria-label={swp?.form?.lumpsumInvestment ?? "Total Investment"}
                />
              </Stack>

              <CustomSlider
                value={investment}
                min={1000}
                max={5000000}
                step={1000}
                onChange={(e, v) => setInvestment(v)}
                sx={{ mt: 2 }}
                aria-label="Total investment slider"
              />
            </Box>

            {/* Withdrawal per month */}
            <Box sx={{ mb: 4 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                <Typography variant="subtitle1">
                  {swp?.form?.withdrawalLabel ?? "Withdrawal per month"}
                </Typography>
                <CustomInput
                  value={withdrawal}
                  onChange={setWithdrawal}
                  startAdornment="₹"
                  aria-label={swp?.form?.withdrawalLabel ?? "Withdrawal per month"}
                />
              </Stack>

              <CustomSlider
                value={withdrawal}
                min={1000}
                max={200000}
                step={500}
                onChange={(e, v) => setWithdrawal(v)}
                sx={{ mt: 2 }}
                aria-label="Withdrawal slider"
              />
            </Box>

            {/* Expected return rate */}
            <Box sx={{ mb: 4 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                <Typography variant="subtitle1">
                  {swp?.form?.expectedReturn ?? "Expected return rate (p.a)"}
                </Typography>
                <CustomInput
                  value={rate}
                  onChange={setRate}
                  endAdornment="%"
                  aria-label={swp?.form?.expectedReturn ?? "Expected return rate (p.a)"}
                />
              </Stack>

              <CustomSlider
                value={rate}
                min={0}
                max={30}
                step={0.1}
                onChange={(e, v) => setRate(v)}
                sx={{ mt: 2 }}
                aria-label="Expected return slider"
              />
            </Box>

            {/* Time Period */}
            <Box sx={{ mb: 4 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                <Typography variant="subtitle1">
                  {swp?.form?.timePeriod ?? "Time period"}
                </Typography>
                <CustomInput
                  value={years}
                  onChange={setYears}
                  endAdornment="Yr"
                  aria-label={swp?.form?.timePeriod ?? "Time period"}
                />
              </Stack>

              <CustomSlider
                value={years}
                min={1}
                max={50}
                step={1}
                onChange={(e, v) => setYears(v)}
                sx={{ mt: 2 }}
                aria-label="Time period slider"
              />
            </Box>

            {/* Results */}
            <SWPResultsSummary
              fh={swp?.results?.investedAmount ?? "Total investment"}
              sh={swp?.results?.estimatedReturns ?? "Total withdrawal"}
              th={swp?.results?.totalValue ?? "Final value"}
              investedAmount={investment}
              estimatedReturns={totalWithdrawal}
              totalValue={finalValue}
              currency={fmtINR}
            />

          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default SWPCalculator;
