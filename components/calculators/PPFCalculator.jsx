// /components/calculators/PPFCalculator.jsx
"use client";
import React, { useMemo } from "react";
import { Box, Grid, Paper, Stack, Typography, Divider } from "@mui/material";
import CustomInput from "../common/CustomInput";
import CustomSlider from "../common/CustomSlider";
import SWPResultsSummary from "../common/SWPResultsSummary";
import ResultsChart from "../common/ResultsChart";
import { COLORS, fmtINR } from "@/lib/utils";
import usePPFCalculator from "@/hooks/usePPFCalculator";

const PPFCalculator = ({ ppf = {} }) => {
  const {
    LIMITS,
    yearlyInvestment,
    setYearlyInvestment,
    years,
    setYears,
    rate,
    setRate,
    clampAndSet,
    errors,
    results,
  } = usePPFCalculator({
    initial: {
      yearlyInvestment: ppf.initialInvestment ?? 10000,
      years: ppf.initialYears ?? 15,
      rate: ppf.initialRate ?? 7.1,
    },
  });

  const displayPieData = useMemo(() => [
    { name: ppf?.chart?.invested ?? "Invested", value: results.investedAmount || 0 },
    { name: ppf?.chart?.returns ?? "Interest", value: results.totalInterest || 0 },
  ], [results, ppf]);

  const currency = (val) =>
    typeof fmtINR === "function"
      ? fmtINR(val)
      : new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val);

  return (
    <Paper elevation={0} sx={{ border: "none", borderRadius: 2, p: { xs: 2, md: 4 }, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
      <Divider sx={{ mb: 3 }} />
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          {/* Left: Inputs */}
          <Grid size={{ xs: 12, md: 6 }}>
          
            {/* Yearly investment */}
            <Box sx={{ mb: 4 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                <Typography variant="subtitle1">{ppf.form.yearlyInvestment}</Typography>
                <CustomInput
                  value={yearlyInvestment}
                  onChange={(v) => clampAndSet(v, LIMITS.yearlyInvestment, setYearlyInvestment)}
                  startAdornment="₹"
                  min={LIMITS.yearlyInvestment.min}
                  max={LIMITS.yearlyInvestment.max}
                  error={errors.yearlyInvestment.error}
                  errorMessage={errors.yearlyInvestment.msg}
                />
              </Stack>
              <CustomSlider
                value={typeof yearlyInvestment === "number" ? yearlyInvestment : LIMITS.yearlyInvestment.min}
                min={LIMITS.yearlyInvestment.min}
                max={LIMITS.yearlyInvestment.max}
                step={100}
                onChange={(e, v) => setYearlyInvestment(Math.round(v))}
                sx={{ mt: 2 }}
              />
            </Box>

            {/* Time period */}
            <Box sx={{ mb: 4 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                <Typography variant="subtitle1">{ppf.form.timePeriod}</Typography>
                <CustomInput
                  value={years}
                  onChange={(v) => clampAndSet(v, LIMITS.years, setYears)}
                  endAdornment="Yr"
                  min={LIMITS.years.min}
                  max={LIMITS.years.max}
                  error={errors.years.error}
                  errorMessage={errors.years.msg}
                />
              </Stack>
              <CustomSlider
                value={typeof years === "number" ? years : LIMITS.years.min}
                min={LIMITS.years.min}
                max={LIMITS.years.max}
                step={1}
                onChange={(e, v) => setYears(Math.round(v))}
                sx={{ mt: 2 }}
              />
            </Box>

            {/* Rate (disabled input only, slider removed) */}
            <Box sx={{ mb: 4 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                <Typography variant="subtitle1">{ppf.form.interestRate}</Typography>
                <CustomInput
                  disabled
                  value={rate}
                  onChange={(v) => clampAndSet(v, LIMITS.rate, setRate)}
                  endAdornment="%"
                  min={LIMITS.rate.min}
                  max={LIMITS.rate.max}
                  error={errors.rate.error}
                  errorMessage={errors.rate.msg}
                  width={100}
                />
              </Stack>
              {/* slider intentionally removed for the rate field */}
            </Box>

            {/* Results summary */}
            <SWPResultsSummary
              fh={ppf?.results?.investedAmount ?? "Invested amount"}
              sh={ppf?.results?.estimatedReturns ?? "Total interest"}
              th={ppf?.results?.totalValue ?? "Maturity value"}
              investedAmount={results.investedAmount}
              estimatedReturns={results.totalInterest}
              totalValue={results.maturityValue}
              currency={currency}
            />
          </Grid>

          {/* Right: Chart */}
          <Grid size={{ xs: 12, md: 6 }} display="flex" alignItems="center" justifyContent="center">
            <ResultsChart
              data={displayPieData}
              colors={COLORS}
              width={320}
              height={400}
              innerRadius={70}
              outerRadius={100}
              currencyFn={currency}
              ariaLabel="PPF investment breakdown"
              emptyMessage="Enter values to see chart"
            />
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default PPFCalculator;
