// /components/calculators/EPFCalculator.jsx
"use client";
import React from "react";
import { Box, Grid, Paper, Stack, Typography, Divider } from "@mui/material";
import CustomInput from "../common/CustomInput";
import CustomSlider from "../common/CustomSlider";
import { fmtINR } from "@/lib/utils";
import useEPFCalculator from "@/hooks/useEPFCalculator";

const EPFCalculator = ({ epf = {}, retirementAge = 58 }) => {
  const {
    LIMITS,
    monthlySalary,
    setMonthlySalary,
    age,
    setAge,
    contributionPct,
    setContributionPct,
    annualIncrease,
    setAnnualIncrease,
    rate,
    clampAndSet,
    errors,
    results,
  } = useEPFCalculator({
    initial: {
      monthlySalary: epf.initialMonthlySalary ?? 50000,
      age: epf.initialAge ?? 30,
      contributionPct: epf.initialContributionPct ?? 12,
      annualIncrease: epf.initialAnnualIncrease ?? 5,
      rate: epf.initialRate ?? 8.25,
    },
    retirementAge,
    includeEmployer: true,
    growwMode: true,
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
      <Divider sx={{ mb: 3 }} />

      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6">EPF (Groww-like) Calculator</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Includes hidden employer contribution (equal to employee %). Contributions credited at start of month and compounded monthly.
              </Typography>
            </Box>

            {/* Monthly Salary */}
            <Box sx={{ mb: 4 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                <Typography variant="subtitle1">Monthly salary (Basic + DA)</Typography>
                <CustomInput
                  value={monthlySalary}
                  onChange={(v) => clampAndSet(v, LIMITS.monthlySalary, setMonthlySalary)}
                  startAdornment="₹"
                  min={LIMITS.monthlySalary.min}
                  max={LIMITS.monthlySalary.max}
                  error={errors.monthlySalary?.error}
                  errorMessage={errors.monthlySalary?.msg}
                />
              </Stack>
              <CustomSlider
                value={typeof monthlySalary === "number" ? monthlySalary : LIMITS.monthlySalary.min}
                min={LIMITS.monthlySalary.min}
                max={LIMITS.monthlySalary.max}
                step={1000}
                onChange={(e, v) => setMonthlySalary(Math.round(v))}
                sx={{ mt: 2 }}
              />
            </Box>

            {/* Age */}
            <Box sx={{ mb: 4 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                <Typography variant="subtitle1">Your age (yrs)</Typography>
                <CustomInput
                  value={age}
                  onChange={(v) => clampAndSet(v, LIMITS.age, setAge)}
                  endAdornment="Yr"
                  min={LIMITS.age.min}
                  max={LIMITS.age.max}
                  error={errors.age?.error}
                  errorMessage={errors.age?.msg}
                  width={90}
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

            {/* Contribution % */}
            <Box sx={{ mb: 4 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                <Typography variant="subtitle1">Your contribution to EPF</Typography>
                <CustomInput
                  value={contributionPct}
                  onChange={(v) => clampAndSet(v, LIMITS.contributionPct, setContributionPct)}
                  endAdornment="%"
                  min={LIMITS.contributionPct.min}
                  max={LIMITS.contributionPct.max}
                  error={errors.contributionPct?.error}
                  errorMessage={errors.contributionPct?.msg}
                  width={90}
                />
              </Stack>
              <CustomSlider
                value={typeof contributionPct === "number" ? contributionPct : LIMITS.contributionPct.min}
                min={LIMITS.contributionPct.min}
                max={LIMITS.contributionPct.max}
                step={0.1}
                onChange={(e, v) => setContributionPct(Number(v))}
                sx={{ mt: 2 }}
              />
            </Box>

            {/* Annual increase */}
            <Box sx={{ mb: 4 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                <Typography variant="subtitle1">Annual increase in salary</Typography>
                <CustomInput
                  value={annualIncrease}
                  onChange={(v) => clampAndSet(v, LIMITS.annualIncrease, setAnnualIncrease)}
                  endAdornment="%"
                  min={LIMITS.annualIncrease.min}
                  max={LIMITS.annualIncrease.max}
                  width={90}
                />
              </Stack>
              <CustomSlider
                value={typeof annualIncrease === "number" ? annualIncrease : LIMITS.annualIncrease.min}
                min={LIMITS.annualIncrease.min}
                max={LIMITS.annualIncrease.max}
                step={0.1}
                onChange={(e, v) => setAnnualIncrease(Number(v))}
                sx={{ mt: 2 }}
              />
            </Box>

            {/* Rate (disabled) */}
            <Box sx={{ mb: 4 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                <Typography variant="subtitle1">Rate of interest (p.a)</Typography>
                <CustomInput disabled value={rate} endAdornment="%" width={100} />
              </Stack>
            </Box>

            {/* Summary boxes */}
            <Box sx={{ mt: 2, mb: 2, p: 2, borderRadius: 1, backgroundColor: "background.paper", boxShadow: "inset 0 1px 0 rgba(0,0,0,0.02)" }}>
              <Grid container spacing={1}>
                <Grid item xs={4}>
                  <Typography variant="caption" color="text.secondary">Invested</Typography>
                  <Typography variant="h6" sx={{ mt: 0.5 }}>{currency(results.totalInvested)}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="caption" color="text.secondary">Interest</Typography>
                  <Typography variant="h6" sx={{ mt: 0.5 }}>{currency(results.totalInterest)}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="caption" color="text.secondary">Maturity</Typography>
                  <Typography variant="h6" sx={{ mt: 0.5 }}>{currency(results.maturityValue)}</Typography>
                </Grid>
              </Grid>
            </Box>

            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2">You will have accumulated</Typography>
              <Typography variant="h4" sx={{ mt: 1 }}>
                {currency(results.maturityValue)}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                by the time you retire (age {retirementAge}).
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default EPFCalculator;
