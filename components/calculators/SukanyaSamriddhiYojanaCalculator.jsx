// /components/calculators/SukanyaSamriddhiYojanaCalculator.jsx
"use client";
import React, { useMemo } from "react";
import { Box, Grid, Paper, Stack, Typography, Divider } from "@mui/material";
import CustomInput from "../common/CustomInput";
import CustomSlider from "../common/CustomSlider";
import SWPResultsSummary from "../common/SWPResultsSummary";
import ResultsChart from "../common/ResultsChart";
import { COLORS, fmtINR } from "@/lib/utils";
import useSSYCalculator from "@/hooks/useSSYCalculator";

const SukanyaSamriddhiYojanaCalculator = ({
  ssy = {},
  depositTiming = "end",
  compounding = 12,
  tuneForGroww = true, // default true to match Groww-like numbers for examples
}) => {
  const {
    LIMITS,
    yearlyInvestment,
    setYearlyInvestment,
    girlAge,
    setGirlAge,
    startYear,
    setStartYear,
    clampAndSet,
    errors,
    results,
  } = useSSYCalculator({
    initial: {
      yearlyInvestment: ssy.initialInvestment ?? 10000,
      girlAge: ssy.initialGirlAge ?? 5,
      startYear: ssy.initialStartYear ?? 2021,
      rate: ssy.initialRate ?? 8.2,
    },
    depositTiming,
    compounding,
    tuneForGroww,
  });

  const displayPieData = useMemo(() => [
    { name: ssy?.chart?.invested ?? "Invested", value: results.investedAmount || 0 },
    { name: ssy?.chart?.returns ?? "Interest", value: results.totalInterest || 0 },
  ], [results, ssy]);

  const currency = (val) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val);

  return (
    <Paper elevation={0} sx={{ border: "none", borderRadius: 2, p: { xs: 2, md: 4 }, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
      <Divider sx={{ mb: 3 }} />
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          {/* Left: Inputs */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {/* Latest SSY rate: {ssy?.initialRate ?? 8.2}% (fixed in UI). Using deposit at year-end + monthly compounding. */}
                {ssy.notes.latestRateNote.replace("{rate}", ssy?.initialRate ?? 8.2)}
              </Typography>
            </Box>

            {/* Yearly investment */}
            <Box sx={{ mb: 4 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                <Typography variant="subtitle1">{ssy.form.yearlyInvestment}</Typography>
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

            {/* Girl's age */}
            <Box sx={{ mb: 4 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                <Typography variant="subtitle1">{ssy.form.girlsAge}</Typography>
                <CustomInput
                  value={girlAge}
                  onChange={(v) => clampAndSet(v, LIMITS.girlAge, setGirlAge)}
                  endAdornment="Yr"
                  min={LIMITS.girlAge.min}
                  max={LIMITS.girlAge.max}
                  error={errors.girlAge.error}
                  errorMessage={errors.girlAge.msg}
                  width={80}
                />
              </Stack>
              <CustomSlider
                value={typeof girlAge === "number" ? girlAge : LIMITS.girlAge.min}
                min={LIMITS.girlAge.min}
                max={LIMITS.girlAge.max}
                step={1}
                onChange={(e, v) => setGirlAge(Math.round(v))}
                sx={{ mt: 2 }}
              />
            </Box>

            {/* Start period (year) */}
            <Box sx={{ mb: 4 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                <Typography variant="subtitle1">{ssy.form.startPeriod}</Typography>
                <CustomInput
                  value={startYear}
                  onChange={(v) => clampAndSet(v, LIMITS.startYear, setStartYear)}
                  min={LIMITS.startYear.min}
                  max={LIMITS.startYear.max}
                  error={errors.startYear.error}
                  errorMessage={errors.startYear.msg}
                  width={100}
                />
              </Stack>

              <CustomSlider
                value={typeof startYear === "number" ? startYear : LIMITS.startYear.min}
                min={LIMITS.startYear.min}
                max={LIMITS.startYear.max}
                step={1}
                onChange={(e, v) => setStartYear(Math.round(v))}
                sx={{ mt: 2 }}
              />
            </Box>

            {/* Results summary */}
            <SWPResultsSummary
              fh={ssy?.results?.investedAmount ?? "Total investment"}
              sh={ssy?.results?.estimatedReturns ?? "Total interest"}
              th={ssy?.results?.totalValue ?? "Maturity value"}
              investedAmount={results.investedAmount}
              estimatedReturns={results.totalInterest}
              totalValue={results.maturityValue}
              currency={fmtINR || currency}
            />

            {/* Maturity Year */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 2 }}>
              <Typography variant="subtitle2">{ssy.results.maturityYear}</Typography>
              <Typography variant="h6">{results.maturityYear}</Typography>
            </Stack>
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
              ariaLabel="SSY investment breakdown"
              emptyMessage="Enter values to see chart"
            />
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ mt: 3 }}>
        <Typography variant="body2" color="text.secondary">
          {ssy.notes.long}
        </Typography>
      </Box>
    </Paper>
  );
};

export default SukanyaSamriddhiYojanaCalculator;
