// /components/calculators/CompoundInterestCalculator.jsx
"use client";
import React, { useMemo } from "react";
import {
  Box,
  Grid,
  Paper,
  Stack,
  Typography,
  Divider,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CustomInput from "../common/CustomInput";
import CustomSlider from "../common/CustomSlider";
import SWPResultsSummary from "../common/SWPResultsSummary";
import ResultsChart from "../common/ResultsChart";
import useCompoundInterestCalculator from "@/hooks/useCompoundInterestCalculator";
import { COLORS, fmtINR } from "@/lib/utils";

const CompoundInterestCalculator = ({ ci = {} }) => {
  const {
    LIMITS,
    principal,
    setPrincipal,
    rate,
    setRate,
    years,
    setYears,
    frequency,
    cycleFrequency,
    clampAndSet,
    errors,
    results,
  } = useCompoundInterestCalculator({
    initial: {
      principal: ci.initialPrincipal ?? 100000,
      rate: ci.initialRate ?? 6,
      years: ci.initialYears ?? 5,
      frequency: ci.initialFrequency ?? "Yearly",
    },
  });

  const currency = (val) =>
    typeof fmtINR === "function"
      ? fmtINR(val)
      : new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val);

  const displayPieData = useMemo(() => [
    { name: ci?.chart?.invested ?? "Principal", value: results.investedAmount || 0 },
    { name: ci?.chart?.returns ?? "Interest", value: results.estimatedReturns || 0 },
  ], [results, ci]);

  // focus time input when needed (not required here but kept for parity)
  // UI
  return (
    <Paper elevation={0} sx={{ border: "none", borderRadius: 2, p: { xs: 2, md: 4 }, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6">Compound Interest Calculator</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Calculates compound interest with selectable frequency (Yearly / Half-Yearly / Quarterly).
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={2}>
        {/* Inputs */}
        <Grid item xs={12} md={6}>
          {/* Principal */}
          <Box sx={{ mb: 4 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
              <Typography variant="subtitle1">Principal amount</Typography>
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
              <Typography variant="subtitle1">Rate of interest (p.a)</Typography>
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
              <Typography variant="subtitle1">Time period (years)</Typography>
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

          {/* Compounding frequency (cycle pill) */}
          <Box sx={{ mb: 4 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="subtitle1">Compound frequency</Typography>
              <Box
                component="span"
                onClick={cycleFrequency}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") cycleFrequency(); }}
                sx={{
                  ml: 1,
                  px: 1.2,
                  py: 0.4,
                  borderRadius: "20px",
                  border: "1px solid rgba(0,0,0,0.12)",
                  display: "inline-flex",
                  alignItems: "center",
                  cursor: "pointer",
                  userSelect: "none",
                  backgroundColor: "transparent",
                  "&:hover": { backgroundColor: "action.hover" },
                  fontWeight: 600,
                  fontSize: "0.95rem",
                }}
                aria-label={`Cycle compounding frequency (current: ${frequency})`}
              >
                <span style={{ marginRight: 8 }}>{frequency}</span>
                <ArrowDropDownIcon fontSize="small" />
              </Box>
            </Stack>

            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
              Click the pill to cycle: Yearly → Half-Yearly → Quarterly.
            </Typography>
          </Box>

          {/* Results summary */}
          <SWPResultsSummary
            fh={ci?.results?.investedAmount ?? "Principal amount"}
            sh={ci?.results?.estimatedReturns ?? "Total interest"}
            th={ci?.results?.totalAmount ?? "Total amount"}
            investedAmount={results.investedAmount}
            estimatedReturns={results.estimatedReturns}
            totalValue={results.totalAmount}
            currency={fmtINR || currency}
          />
        </Grid>

        {/* Right: Chart */}
        <Grid item xs={12} md={6} display="flex" alignItems="center" justifyContent="center">
          <ResultsChart
            data={displayPieData}
            colors={COLORS}
            width={320}
            height={320}
            innerRadius={70}
            outerRadius={100}
            currencyFn={currency}
            ariaLabel="Compound interest breakdown"
            emptyMessage="Enter values to see chart"
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default CompoundInterestCalculator;
