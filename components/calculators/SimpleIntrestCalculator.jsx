// /components/calculators/SimpleInterestCalculator.jsx
"use client";
import React, { useMemo } from "react";
import { Box, Grid, Paper, Stack, Typography, Divider } from "@mui/material";
import CustomInput from "../common/CustomInput";
import CustomSlider from "../common/CustomSlider";
import SWPResultsSummary from "../common/SWPResultsSummary";
import ResultsChart from "../common/ResultsChart";
import useSimpleInterestCalculator from "@/hooks/useSimpleInterestCalculator";
import { COLORS, fmtINR } from "@/lib/utils";

const SimpleInterestCalculator = ({ si = {} }) => {
  const {
    LIMITS,
    principal,
    setPrincipal,
    rate,
    setRate,
    years,
    setYears,
    clampAndSet,
    errors,
    results,
  } = useSimpleInterestCalculator({
    initial: {
      principal: si.initialPrincipal ?? 100000,
      rate: si.initialRate ?? 6,
      years: si.initialYears ?? 5,
    },
  });

  const currency = (val) =>
    typeof fmtINR === "function"
      ? fmtINR(val)
      : new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val);

  const displayPieData = useMemo(() => [
    { name: si?.chart?.invested ?? "Principal", value: results.investedAmount || 0 },
    { name: si?.chart?.returns ?? "Interest", value: results.estimatedReturns || 0 },
  ], [results, si]);

  return (
    <Paper elevation={0} sx={{ border: "none", borderRadius: 2, p: { xs: 2, md: 4 }, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6">Simple Interest Calculator</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Calculates simple interest using SI = P × R × T / 100 and total amount A = P + SI.
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={2}>
        {/* Inputs */}
        <Grid item xs={12} md={6}>
          {/* Principal */}
          <Box sx={{ mb: 4 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
              <Typography variant="subtitle1">{si.form.principal}</Typography>
              <CustomInput
                value={principal}
                onChange={(v) => clampAndSet(v, LIMITS.principal, setPrincipal)}
                startAdornment="₹"
                min={LIMITS.principal.min}
                max={LIMITS.principal.max}
                error={errors.principal.error}
                errorMessage={errors.principal.msg}
                width={160}
              />
            </Stack>

            <CustomSlider
              value={typeof principal === "number" ? principal : LIMITS.principal.min}
              min={LIMITS.principal.min}
              max={LIMITS.principal.max}
              step={1000}
              onChange={(e, v) => setPrincipal(Math.round(v))}
              sx={{ mt: 2 }}
            />
          </Box>

          {/* Rate */}
          <Box sx={{ mb: 4 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
              <Typography variant="subtitle1">{si.form.interestRate}</Typography>
              <CustomInput
                value={rate}
                onChange={(v) => clampAndSet(v, LIMITS.rate, setRate)}
                endAdornment="%"
                min={LIMITS.rate.min}
                max={LIMITS.rate.max}
                error={errors.rate.error}
                errorMessage={errors.rate.msg}
                width={120}
              />
            </Stack>

            <CustomSlider
              value={typeof rate === "number" ? rate : LIMITS.rate.min}
              min={LIMITS.rate.min}
              max={LIMITS.rate.max}
              step={0.1}
              onChange={(e, v) => setRate(Math.round(v * 10) / 10)}
              sx={{ mt: 2 }}
            />
          </Box>

          {/* Time Period */}
          <Box sx={{ mb: 4 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
              <Typography variant="subtitle1">{si.form.timePeriod}</Typography>
              <CustomInput
                value={years}
                onChange={(v) => clampAndSet(v, LIMITS.years, setYears)}
                endAdornment="Yr"
                min={LIMITS.years.min}
                max={LIMITS.years.max}
                error={errors.years.error}
                errorMessage={errors.years.msg}
                width={110}
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

          {/* Results summary (common component) */}
          <SWPResultsSummary
            fh={si?.results?.investedAmount ?? "Principal amount"}
            sh={si?.results?.estimatedReturns ?? "Total interest"}
            th={si?.results?.totalAmount ?? "Total amount"}
            investedAmount={results.investedAmount}
            estimatedReturns={results.estimatedReturns}
            totalValue={results.totalAmount}
            currency={fmtINR || currency}
          />
        </Grid>

        {/* Chart / visual */}
        <Grid item xs={12} md={6} display="flex" alignItems="center" justifyContent="center">
          <ResultsChart
            data={displayPieData}
            colors={COLORS}
            width={320}
            height={320}
            innerRadius={70}
            outerRadius={100}
            currencyFn={currency}
            ariaLabel="Simple interest breakdown"
            emptyMessage="Enter values to see chart"
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default SimpleInterestCalculator;
