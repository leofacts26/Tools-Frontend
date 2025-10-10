"use client";
import React, { useMemo } from "react";
import { Box, Grid, Paper, Stack, Typography } from "@mui/material";
import CustomInput from "../common/CustomInput";
import CustomSlider from "../common/CustomSlider";
import SWPResultsSummary from "../common/SWPResultsSummary";
import ResultsChart from "../common/ResultsChart";
import { COLORS, fmtINR } from "@/lib/utils";
import useMFCalculator from "@/hooks/useMFCalculator";


const MFReturnCalculator = ({ mf = {} }) => {
  const {
    LIMITS,
    investment,
    annualReturn,
    years,
    setInvestment,
    setAnnualReturn,
    setYears,
    clampAndSet,
    errors,
    results,
  } = useMFCalculator({
    investment: mf.initialInvestment ?? 25000,
    annualReturn: mf.initialReturn ?? 12,
    years: mf.initialYears ?? 10,
  });

  // Prepare pie data for chart (Invested / Returns)
  const displayPieData = useMemo(() => [
    { name: mf?.chart?.invested ?? "Invested", value: results.investedAmount || 0 },
    { name: mf?.chart?.returns ?? "Returns", value: Math.max(0, results.gain) || 0 },
  ], [results, mf]);

  const currency = (val) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val);

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
          {/* Left: Inputs */}
          <Grid item xs={12} md={6}>
            {/* Total Investment (Lumpsum) */}
            <Box sx={{ mb: 4 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                <Typography variant="subtitle1">{mf.results.investedAmount}</Typography>
                <CustomInput
                  value={investment}
                  onChange={(v) => clampAndSet(v, LIMITS.investment, setInvestment)}
                  startAdornment="₹"
                  min={LIMITS.investment.min}
                  max={LIMITS.investment.max}
                  error={errors.investment.error}
                  errorMessage={errors.investment.msg}
                />
              </Stack>

              <CustomSlider
                value={typeof investment === "number" ? investment : LIMITS.investment.min}
                min={LIMITS.investment.min}
                max={LIMITS.investment.max}
                step={1000}
                onChange={(e, v) => setInvestment(Math.round(v))}
                sx={{ mt: 2 }}
              />
            </Box>

            {/* Expected return rate (p.a) */}
            <Box sx={{ mb: 4 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                <Typography variant="subtitle1">{mf.results.estimatedReturns}</Typography>
                <CustomInput
                  value={annualReturn}
                  onChange={(v) => clampAndSet(v, LIMITS.rate, setAnnualReturn)}
                  endAdornment="%"
                  min={LIMITS.rate.min}
                  max={LIMITS.rate.max}
                  error={errors.rate.error}
                  errorMessage={errors.rate.msg}
                />
              </Stack>

              <CustomSlider
                value={typeof annualReturn === "number" ? annualReturn : LIMITS.rate.min}
                min={LIMITS.rate.min}
                max={LIMITS.rate.max}
                step={0.1}
                onChange={(e, v) => setAnnualReturn(Math.round(v * 10) / 10)}
                sx={{ mt: 2 }}
              />
            </Box>

            {/* Time Period */}
            <Box sx={{ mb: 4 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                <Typography variant="subtitle1">{mf.results.totalValue}</Typography>
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

            {/* Results */}
            <SWPResultsSummary
              fh={mf?.results?.investedAmount ?? "Invested amount"}
              sh={mf?.results?.estimatedReturns ?? "Est. returns"}
              th={mf?.results?.totalValue ?? "Total value"}
              investedAmount={results.investedAmount}
              estimatedReturns={results.gain}
              totalValue={results.maturity}
              currency={fmtINR || currency}
            />
          </Grid>

          {/* Right side results */}
          <Grid item xs={12} md={6} display="flex" alignItems="center" justifyContent="center">
            <ResultsChart
              data={displayPieData}
              colors={COLORS}
              width={320}
              height={400}
              innerRadius={70}
              outerRadius={100}
              currencyFn={currency}
              ariaLabel="Investment breakdown"
              emptyMessage="Enter values to see chart"
            />
          </Grid>

        </Grid>
      </Box>
    </Paper>
  );
};

export default MFReturnCalculator;
