// /components/calculators/RDCalculator.jsx
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
import useRDCalculator from "@/hooks/useRDCalculator";
import { COLORS, fmtINR } from "@/lib/utils";

const RDCalculator = ({ rd = {} }) => {
  const {
    LIMITS,
    monthlyInvestment,
    setMonthlyInvestment,
    rate,
    setRate,
    unit,
    setUnit,
    years,
    setYears,
    months,
    setMonths,
    clampAndSet,
    cycleUnit,
    errors,
    results,
  } = useRDCalculator({
    initial: {
      monthlyInvestment: rd.initialMonthlyInvestment ?? 50000,
      rate: rd.initialRate ?? 6.5,
      unit: rd.initialUnit ?? "Years",
      years: rd.initialYears ?? 3,
      months: rd.initialMonths ?? 3,
    },
  });

  const currency = (val) =>
    typeof fmtINR === "function"
      ? fmtINR(val)
      : new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val);

  const displayPieData = useMemo(() => [
    { name: rd?.chart?.invested ?? "Invested", value: results.investedAmount || 0 },
    { name: rd?.chart?.returns ?? "Returns", value: results.estimatedReturns || 0 },
  ], [results, rd]);

  // focus the time input after cycling so user can type immediately
  const handleCycleUnit = () => {
    cycleUnit();
    setTimeout(() => {
      const el = document.getElementById("rd-time-input");
      if (el && typeof el.focus === "function") el.focus();
    }, 0);
  };

  // Time input adapts to unit; stable id used for focus
  const TimeInput = () => {
    if (unit === "Years") {
      return (
        <CustomInput
          id="rd-time-input"
          value={years}
          onChange={(v) => clampAndSet(v, LIMITS.years, setYears)}
          endAdornment="Yr"
          min={LIMITS.years.min}
          max={LIMITS.years.max}
          error={errors.years.error}
          errorMessage={errors.years.msg}
          width={110}
        />
      );
    }
    // Months
    return (
      <CustomInput
        id="rd-time-input"
        value={months}
        onChange={(v) => clampAndSet(v, LIMITS.months, setMonths)}
        endAdornment="Mo"
        min={LIMITS.months.min}
        max={LIMITS.months.max}
        error={errors.months.error}
        errorMessage={errors.months.msg}
        width={110}
      />
    );
  };

  return (
    <Paper elevation={0} sx={{ border: "none", borderRadius: 2, p: { xs: 2, md: 4 }, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6">Recurring Deposit (RD) Calculator</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Enter monthly deposit, annual rate and tenure. Calculation assumes deposits at the start of the month (annuity-due) and monthly compounding.
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={2}>
        {/* Left: Inputs */}
        <Grid size={{ xs: 12, md: 6 }}>
          {/* Monthly Investment */}
          <Box sx={{ mb: 4 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="subtitle1">{rd.form.monthlyInvestment}</Typography>
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

          {/* Rate */}
          <Box sx={{ mb: 4 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="subtitle1">{rd.form.interestRate}</Typography>
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

          {/* Time period with cycle pill between Years <-> Months */}
          <Box sx={{ mb: 4 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
              <Typography variant="subtitle1" component="div">
                {rd.form.timePeriod}
                <Box
                  component="span"
                  onClick={handleCycleUnit}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleCycleUnit(); }}
                  sx={{
                    ml: 1,
                    px: 1.2,
                    py: 0.3,
                    borderRadius: "20px",
                    border: "1px solid rgba(0,0,0,0.12)",
                    display: "inline-flex",
                    alignItems: "center",
                    cursor: "pointer",
                    userSelect: "none",
                    backgroundColor: "transparent",
                    "&:hover": { backgroundColor: "action.hover" },
                    fontWeight: 600,
                    fontSize: "0.875rem",
                  }}
                  aria-label={`Toggle years/months (current: ${unit})`}
                >
                  <span style={{ marginRight: 6 }}>{unit}</span>
                  <ArrowDropDownIcon fontSize="small" />
                </Box>
              </Typography>

              <Stack direction="row" alignItems="center" spacing={1}>
                <TimeInput />
              </Stack>
            </Stack>

            <Box sx={{ mt: 2 }}>
              {unit === "Years" ? (
                <>
                  <Typography variant="caption" color="text.secondary">Years</Typography>
                  <CustomSlider
                    value={typeof years === "number" ? years : LIMITS.years.min}
                    min={LIMITS.years.min}
                    max={LIMITS.years.max}
                    step={1}
                    onChange={(e, v) => setYears(Math.round(v))}
                    sx={{ mt: 1 }}
                  />
                </>
              ) : (
                <>
                  <Typography variant="caption" color="text.secondary">Months</Typography>
                  <CustomSlider
                    value={typeof months === "number" ? months : LIMITS.months.min}
                    min={LIMITS.months.min}
                    max={LIMITS.months.max}
                    step={1}
                    onChange={(e, v) => setMonths(Math.round(v))}
                    sx={{ mt: 1 }}
                  />
                </>
              )}
            </Box>
          </Box>

          {/* Results summary */}
          <SWPResultsSummary
            fh={rd?.results?.investedAmount ?? "Invested amount"}
            sh={rd?.results?.estimatedReturns ?? "Est. returns"}
            th={rd?.results?.totalValue ?? "Total value"}
            investedAmount={results.investedAmount}
            estimatedReturns={results.estimatedReturns}
            totalValue={results.totalValue}
            currency={fmtINR || currency}
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
            ariaLabel="RD breakdown"
            emptyMessage="Enter values to see chart"
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default RDCalculator;
