// /components/calculators/FDCalculator.jsx
"use client";
import React, { useMemo } from "react";
import {
  Box,
  Grid,
  Paper,
  Stack,
  Typography,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CustomInput from "../common/CustomInput";
import CustomSlider from "../common/CustomSlider";
import ResultsChart from "../common/ResultsChart";
import SWPResultsSummary from "../common/SWPResultsSummary";
import useFDCalculator from "@/hooks/useFDCalculator";
import { COLORS, fmtINR } from "@/lib/utils";

const FDCalculator = ({ fd = {} }) => {
  const {
    LIMITS,
    investment,
    setInvestment,
    rate,
    setRate,
    unit,
    setUnit,
    years,
    setYears,
    months,
    setMonths,
    days,
    setDays,
    interestType,
    setInterestType,
    clampAndSet,
    cycleUnit,
    errors,
    results,
  } = useFDCalculator({
    initial: {
      investment: fd.initialInvestment ?? 100000,
      rate: fd.initialRate ?? 6.5,
      unit: fd.initialUnit ?? "Years",
      years: fd.initialYears ?? 5,
      months: fd.initialMonths ?? 5,
      days: fd.initialDays ?? 5,
      interestType: fd.initialInterestType ?? "compound",
    },
  });

  const currency = (val) =>
    typeof fmtINR === "function"
      ? fmtINR(val)
      : new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val);

  const displayPieData = useMemo(() => [
    { name: fd?.chart?.invested ?? "Invested", value: results.investedAmount || 0 },
    { name: fd?.chart?.returns ?? "Returns", value: results.estimatedReturns || 0 },
  ], [results, fd]);

  // Focus the time input after cycling units so user can immediately type.
  const handleCycleUnit = () => {
    cycleUnit();
    // focus after DOM update
    setTimeout(() => {
      const el = document.getElementById("fd-time-input");
      if (el && typeof el.focus === "function") el.focus();
    }, 0);
  };

  // Time input component that adapts to `unit`. We give the input a stable id so we can focus it.
  const TimeInput = () => {
    if (unit === "Years") {
      return (
        <CustomInput
          id="fd-time-input"
          value={years}
          onChange={(v) => clampAndSet(v, LIMITS.years, setYears)}
          endAdornment="Yr"
          min={LIMITS.years.min}
          max={LIMITS.years.max}
          error={errors.years.error}
          errorMessage={errors.years.msg}
          width={100}
        />
      );
    }
    if (unit === "Months") {
      return (
        <CustomInput
          id="fd-time-input"
          value={months}
          onChange={(v) => clampAndSet(v, LIMITS.months, setMonths)}
          endAdornment="Mo"
          min={LIMITS.months.min}
          max={LIMITS.months.max}
          error={errors.months.error}
          errorMessage={errors.months.msg}
          width={100}
        />
      );
    }
    // Days
    return (
      <CustomInput
        id="fd-time-input"
        value={days}
        onChange={(v) => clampAndSet(v, LIMITS.days, setDays)}
        endAdornment="Days"
        min={LIMITS.days.min}
        max={LIMITS.days.max}
        error={errors.days.error}
        errorMessage={errors.days.msg}
        width={100}
      />
    );
  };

  return (
    <Paper elevation={0} sx={{ border: "none", borderRadius: 2, p: { xs: 2, md: 4 }, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6">Fixed Deposit Calculator</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Choose amount, tenure and interest type to calculate maturity. Compound interest compounds per selected unit.
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={2}>
        {/* Left: Inputs */}
        <Grid size={{ xs: 12, md: 6 }}>
          {/* Total Investment */}
          <Box sx={{ mb: 4 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="subtitle1">Total Investment</Typography>
              <CustomInput
                value={investment}
                onChange={(v) => clampAndSet(v, LIMITS.investment, setInvestment)}
                startAdornment="₹"
                min={LIMITS.investment.min}
                max={LIMITS.investment.max}
                error={errors.investment.error}
                errorMessage={errors.investment.msg}
                width={140}
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

          {/* Rate */}
          <Box sx={{ mb: 4 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
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

          {/* Time period with cycling pill */}
          <Box sx={{ mb: 4 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
              <Typography variant="subtitle1" component="div">
                Time period{" "}
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
                  aria-label={`Cycle time unit (current: ${unit})`}
                >
                  <span style={{ marginRight: 6 }}>{unit}</span>
                  <ArrowDropDownIcon fontSize="small" />
                </Box>
              </Typography>

              <Stack direction="row" alignItems="center" spacing={1}>
                {/* numeric input changes based on unit */}
                <TimeInput />
              </Stack>
            </Stack>

            {/* slider for current unit */}
            <Box sx={{ mt: 2 }}>
              {unit === "Years" && (
                <CustomSlider
                  value={typeof years === "number" ? years : LIMITS.years.min}
                  min={LIMITS.years.min}
                  max={LIMITS.years.max}
                  step={1}
                  onChange={(e, v) => setYears(Math.round(v))}
                />
              )}
              {unit === "Months" && (
                <CustomSlider
                  value={typeof months === "number" ? months : LIMITS.months.min}
                  min={LIMITS.months.min}
                  max={LIMITS.months.max}
                  step={1}
                  onChange={(e, v) => setMonths(Math.round(v))}
                />
              )}
              {unit === "Days" && (
                <CustomSlider
                  value={typeof days === "number" ? days : LIMITS.days.min}
                  min={LIMITS.days.min}
                  max={LIMITS.days.max}
                  step={1}
                  onChange={(e, v) => setDays(Math.round(v))}
                />
              )}
            </Box>
          </Box>

          {/* Interest type */}
          <Box sx={{ mb: 4 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="subtitle1">Interest type</Typography>
              <ToggleButtonGroup
                size="small"
                value={interestType}
                exclusive
                onChange={(e, v) => {
                  if (v) setInterestType(v);
                }}
                aria-label="Interest type"
              >
                <ToggleButton value="compound">Compound</ToggleButton>
                <ToggleButton value="simple">Simple</ToggleButton>
              </ToggleButtonGroup>
            </Stack>
          </Box>

          {/* Results summary using common component */}
          <SWPResultsSummary
            fh={fd?.results?.investedAmount ?? "Invested amount"}
            sh={fd?.results?.estimatedReturns ?? "Est. returns"}
            th={fd?.results?.totalValue ?? "Total value"}
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
            ariaLabel="FD breakdown"
            emptyMessage="Enter values to see chart"
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default FDCalculator;
