// /components/calculators/StepUpSipCalculator.jsx
"use client";
import React, { useMemo } from "react";
import { Box, Grid, Paper, Stack, Typography, Divider } from "@mui/material";
import CustomInput from "../common/CustomInput";
import CustomSlider from "../common/CustomSlider";
import SWPResultsSummary from "../common/SWPResultsSummary";
import ResultsChart from "../common/ResultsChart";
import useStepUpSipCalculator from "@/hooks/useStepUpSipCalculator";
import { COLORS, fmtINR } from "@/lib/utils";

const StepUpSipCalculator = ({ config = {} }) => {
  const {
    LIMITS,
    monthlyInvestment,
    setMonthlyInvestment,
    stepUpPct,
    setStepUpPct,
    annualReturn,
    setAnnualReturn,
    years,
    setYears,
    clampAndSet,
    errors,
    results,
  } = useStepUpSipCalculator({
    initial: {
      monthlyInvestment: config.initialMonthlyInvestment ?? 25000,
      stepUpPct: config.initialStepUp ?? 10,
      annualReturn: config.initialReturn ?? 12,
      years: config.initialYears ?? 10,
    },
  });

  const currency = (val) =>
    typeof fmtINR === "function"
      ? fmtINR(val)
      : new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val);

  const displayPieData = useMemo(() => [
    { name: config?.chart?.invested ?? "Invested", value: results.investedAmount || 0 },
    { name: config?.chart?.returns ?? "Returns", value: Math.max(0, results.estimatedReturns) || 0 },
  ], [results, config]);

  return (
    <Paper elevation={0} sx={{ border: "none", borderRadius: 2, p: { xs: 2, md: 4 }, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6">Step-Up SIP Calculator</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Monthly contributions with an annual step-up. Contributions are assumed at the start of each month; returns compounded monthly.
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={2}>
        {/* Left: Inputs */}
        <Grid item xs={12} md={6}>
          {/* Monthly investment */}
          <Box sx={{ mb: 4 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
              <Typography variant="subtitle1">Monthly investment</Typography>
              <CustomInput
                value={monthlyInvestment}
                onChange={(v) => clampAndSet(v, LIMITS.monthlyInvestment, setMonthlyInvestment)}
                startAdornment="₹"
                min={LIMITS.monthlyInvestment.min}
                max={LIMITS.monthlyInvestment.max}
                error={errors.monthlyInvestment.error}
                errorMessage={errors.monthlyInvestment.msg}
                width={140}
              />
            </Stack>

            <CustomSlider
              value={typeof monthlyInvestment === "number" ? monthlyInvestment : LIMITS.monthlyInvestment.min}
              min={LIMITS.monthlyInvestment.min}
              max={LIMITS.monthlyInvestment.max}
              step={100}
              onChange={(e, v) => setMonthlyInvestment(Math.round(v))}
              sx={{ mt: 2 }}
            />
          </Box>

          {/* Annual step-up */}
          <Box sx={{ mb: 4 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
              <Typography variant="subtitle1">Annual step up</Typography>
              <CustomInput
                value={stepUpPct}
                onChange={(v) => clampAndSet(v, LIMITS.stepUpPct, setStepUpPct)}
                endAdornment="%"
                min={LIMITS.stepUpPct.min}
                max={LIMITS.stepUpPct.max}
                error={errors.stepUpPct.error}
                errorMessage={errors.stepUpPct.msg}
                width={120}
              />
            </Stack>

            <CustomSlider
              value={typeof stepUpPct === "number" ? stepUpPct : LIMITS.stepUpPct.min}
              min={LIMITS.stepUpPct.min}
              max={LIMITS.stepUpPct.max}
              step={0.1}
              onChange={(e, v) => setStepUpPct(Math.round(v * 10) / 10)}
              sx={{ mt: 2 }}
            />
          </Box>

          {/* Expected return */}
          <Box sx={{ mb: 4 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
              <Typography variant="subtitle1">Expected return rate (p.a)</Typography>
              <CustomInput
                value={annualReturn}
                onChange={(v) => clampAndSet(v, LIMITS.annualReturn, setAnnualReturn)}
                endAdornment="%"
                min={LIMITS.annualReturn.min}
                max={LIMITS.annualReturn.max}
                error={errors.annualReturn.error}
                errorMessage={errors.annualReturn.msg}
                width={120}
              />
            </Stack>

            <CustomSlider
              value={typeof annualReturn === "number" ? annualReturn : LIMITS.annualReturn.min}
              min={LIMITS.annualReturn.min}
              max={LIMITS.annualReturn.max}
              step={0.1}
              onChange={(e, v) => setAnnualReturn(Math.round(v * 10) / 10)}
              sx={{ mt: 2 }}
            />
          </Box>

          {/* Time period */}
          <Box sx={{ mb: 4 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
              <Typography variant="subtitle1">Time period</Typography>
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

          {/* Summary */}
          <SWPResultsSummary
            fh={config?.results?.investedAmount ?? "Invested amount"}
            sh={config?.results?.estimatedReturns ?? "Est. returns"}
            th={config?.results?.totalValue ?? "Total value"}
            investedAmount={results.investedAmount}
            estimatedReturns={results.estimatedReturns}
            totalValue={results.totalValue}
            currency={fmtINR || currency}
          />
        </Grid>

        {/* Right side: chart */}
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
    </Paper>
  );
};

export default StepUpSipCalculator;
