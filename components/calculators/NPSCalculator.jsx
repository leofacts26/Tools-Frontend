// /components/calculators/NPSCalculator.jsx
"use client";
import React, { useMemo } from "react";
import { Box, Grid, Paper, Stack, Typography, Divider } from "@mui/material";
import CustomInput from "../common/CustomInput";
import CustomSlider from "../common/CustomSlider";
import SWPResultsSummary from "../common/SWPResultsSummary";
import useNPSCalculator from "@/hooks/useNPSCalculator";
import { fmtINR } from "@/lib/utils";

const NPSCalculator = ({ nps = {}, retirementAge = 60 }) => {
  const {
    LIMITS,
    monthlyInvestment,
    setMonthlyInvestment,
    annualReturn,
    setAnnualReturn,
    age,
    setAge,
    clampAndSet,
    errors,
    results,
    tenureYears,
  } = useNPSCalculator({
    initial: {
      monthlyInvestment: nps.initialMonthlyInvestment ?? 10000,
      annualReturn: nps.initialReturn ?? 9,
      age: nps.initialAge ?? 20,
    },
    retirementAge,
  });

  const currency = (val) =>
    typeof fmtINR === "function"
      ? fmtINR(val)
      : new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val);

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
      <Box sx={{ mb: 1 }}>
        <Typography variant="h6">NPS (National Pension System) Calculator</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Enter monthly contribution, expected return and your current age. Results assume monthly compounding and deposit at start of month.
        </Typography>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 12 }}>
            {/* Monthly investment */}
            <Box sx={{ mb: 4 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="subtitle1">Investment per month</Typography>
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
                step={500}
                onChange={(e, v) => setMonthlyInvestment(Math.round(v))}
                sx={{ mt: 2 }}
              />
            </Box>

            {/* Expected return */}
            <Box sx={{ mb: 4 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="subtitle1">Expected return (p.a)</Typography>
                <CustomInput
                  value={annualReturn}
                  onChange={(v) => clampAndSet(v, LIMITS.annualReturn, setAnnualReturn)}
                  endAdornment="%"
                  min={LIMITS.annualReturn.min}
                  max={LIMITS.annualReturn.max}
                  error={errors.annualReturn.error}
                  errorMessage={errors.annualReturn.msg}
                  width={100}
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

            {/* Your age */}
            <Box sx={{ mb: 4 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="subtitle1">Your age (yrs)</Typography>
                <CustomInput
                  value={age}
                  onChange={(v) => clampAndSet(v, LIMITS.age, setAge)}
                  endAdornment="Yr"
                  min={LIMITS.age.min}
                  max={LIMITS.age.max}
                  error={errors.age.error}
                  errorMessage={errors.age.msg}
                  width={100}
                />
              </Stack>
              <CustomSlider
                value={typeof age === "number" ? age : LIMITS.age.min}
                min={LIMITS.age.min}
                max={LIMITS.age.max}
                step={1}
                onChange={(e, v) => setAge(Math.round(v))}
                sx={{ mt: 2 }}
              />
            </Box>

            {/* Results summary (common component) */}
            <SWPResultsSummary
              fh={nps?.results?.totalInvestment ?? "Total investment"}
              sh={nps?.results?.interestEarned ?? "Interest earned"}
              th={nps?.results?.maturityAmount ?? "Maturity amount"}
              investedAmount={results.totalInvestment}
              estimatedReturns={results.interestEarned}
              totalValue={results.maturityAmount}
              currency={fmtINR || currency}
            />

            {/* Min annuity investment */}
            <Box sx={{ mt: 2 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle2">Min. annuity investment</Typography>
                <Typography variant="h6">{currency(results.minAnnuityInvestment)}</Typography>
              </Stack>

              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                (Assumes 40% of maturity is used to purchase annuity; 60% may be taken as lump sum.)
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Tenure until retirement: {tenureYears} year{tenureYears !== 1 ? "s" : ""} (retirement age {retirementAge}).
              </Typography>
            </Box>
          </Grid>

     
        </Grid>
      </Box>
    </Paper>
  );
};

export default NPSCalculator;
