// /components/calculators/SipCalculator.jsx
"use client";
import React, { useMemo } from "react";
import {
  Box,
  Grid,
  Typography,
  Tabs,
  Tab,
  Divider,
  Paper,
  Stack,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

import CustomInput from "../common/CustomInput";
import CustomSlider from "../common/CustomSlider";
import CustomTooltip from "../common/CustomTooltip";
import SWPResultsSummary from "../common/SWPResultsSummary";
import useCalculator from "@/hooks/useCalculator";
import { COLORS, fmtINR } from "@/lib/utils";
import { usePathname } from "next/navigation";
import ResultsChart from "../common/ResultsChart";

export default function SipCalculator({ sipcalc }) {
  const pathname = usePathname();
  const parts = (pathname || "").split("/").filter(Boolean);
  const localePrefix = parts.length ? `/${parts[0]}` : "";

  const {
    mounted,
    tab,
    amount,
    years,
    annualReturn,
    setAmount,
    setYears,
    setAnnualReturn,
    results,
    pieData,
    handleTabChange,
  } = useCalculator({
    initial: { amount: 25000, years: 10, annualReturn: 12 },
    mode: "sip",
    routeMap: {
      sip: "/finance/sip-calculator",
      lumpsum: "/finance/lumpsum-calculator",
    },
    pathnamePrefix: localePrefix,
  });

  // -------------------------
  // Validation rules (controls UI error states)
  // SIP min = 100, Lumpsum min = 500 (choose 500 to match Groww-style example)
  // -------------------------
  const SIP_MIN = 100;
  const LUMPSUM_MIN = 500; // <- changed to 500 so example values (500,5,505) map correctly

  const numericAmount = Number.isFinite(Number(amount)) ? Number(amount) : 0;
  const numericAnnualReturn = Number.isFinite(Number(annualReturn)) ? Number(annualReturn) : 0;
  const numericYears = Number.isFinite(Number(years)) ? Number(years) : 0;

  const amountError = tab === 0 ? numericAmount < SIP_MIN : numericAmount < LUMPSUM_MIN;
  const amountErrorMessage = tab === 0 ? `Minimum value allowed is ${SIP_MIN}` : `Minimum value allowed is ${LUMPSUM_MIN}`;

  const returnError = numericAnnualReturn < 1;
  const returnErrorMessage = "Minimum value allowed is 1";

  const yearsError = numericYears < 1;
  const yearsErrorMessage = "Minimum value allowed is 1";

  // --- safe values for calculation (per-field fallbacks to min when input < min)
  const safeAmount = tab === 1
    ? (numericAmount < LUMPSUM_MIN ? LUMPSUM_MIN : Math.min(numericAmount, 10000000))
    : (numericAmount < SIP_MIN ? SIP_MIN : Math.min(numericAmount, 1000000));

  const safeReturn = numericAnnualReturn < 1 ? 1 : Math.min(numericAnnualReturn, 30);
  const safeYears = numericYears < 1 ? 1 : Math.min(numericYears, 40);

  const roundPaise = (x) => Math.round(x * 100) / 100;
  const roundRupee = (x) => Math.round(x);

  // Compute base (safe) results — used when inputs invalid or when forming display baseline
  const safeResults = useMemo(() => {
    if (tab === 1) {
      // lumpsum formula: FV = P * (1+r)^n
      const p = safeAmount;
      const r = safeReturn / 100;
      const n = safeYears;
      const maturity = roundRupee(p * Math.pow(1 + r, n));
      const totalInvested = roundRupee(p);
      const gain = roundRupee(maturity - totalInvested);
      return { maturity, totalInvested, gain, months: n * 12, monthlyRate: null };
    } else {
      // SIP
      const monthlyAmount = safeAmount;
      const r = safeReturn / 100;
      const monthlyRate = Math.pow(1 + r, 1 / 12) - 1;
      const months = Math.max(0, Math.round(safeYears * 12));
      if (monthlyRate === 0) {
        const totalInvested = roundRupee(monthlyAmount * months);
        return { maturity: totalInvested, totalInvested, gain: 0, months, monthlyRate };
      }
      const factor = (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate;
      const maturity = roundRupee(monthlyAmount * factor * (1 + monthlyRate));
      const totalInvested = roundRupee(monthlyAmount * months);
      const gain = roundRupee(maturity - totalInvested);
      return { maturity, totalInvested, gain, months, monthlyRate };
    }
  }, [tab, safeAmount, safeReturn, safeYears]);

  // If inputs valid, use real results; otherwise use safeResults baseline
  const baseDisplayResults = useMemo(() => {
    const allValid = !amountError && !returnError && !yearsError;
    return allValid ? results : safeResults;
  }, [results, safeResults, amountError, returnError, yearsError]);

  // --- Lumpsum-specific Groww-like dynamic display handling
  // When a lumpsum raw input is exactly 0, show example numbers derived from LUMPSUM_MIN and safeReturn/year
  const displayResults = useMemo(() => {
    if (tab !== 1) {
      return baseDisplayResults;
    }

    // Start from the base (either real or safe)
    let { maturity, totalInvested, gain } = baseDisplayResults;

    // If user set amount exactly 0, show Invested = LUMPSUM_MIN
    if (numericAmount === 0) {
      totalInvested = roundRupee(LUMPSUM_MIN);
    }

    // If user set return exactly 0, show estimated returns = Invested * (safeReturn / 100) (1 year)
    if (numericAnnualReturn === 0) {
      // compute returns on the current displayed invested amount
      const computedGain = roundRupee((totalInvested) * (safeReturn / 100));
      gain = computedGain;
    }

    // If user set years exactly 0, show total value = invested + gain
    if (numericYears === 0) {
      maturity = roundRupee((totalInvested) + (gain));
    }

    return { maturity, totalInvested, gain, months: numericYears * 12, monthlyRate: null };
  }, [tab, baseDisplayResults, numericAmount, numericAnnualReturn, numericYears, safeReturn]);

  const displayPieData = useMemo(() => [
    { name: sipcalc?.chart?.invested ?? "Invested", value: displayResults.totalInvested },
    { name: sipcalc?.chart?.returns ?? "Returns", value: Math.max(0, displayResults.gain) },
  ], [displayResults, sipcalc]);

  const maturity = displayResults.maturity;
  const totalInvested = displayResults.totalInvested;
  const gain = displayResults.gain;

  const currency = (val) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val);

  // Updated monthly/lumpsum max
  const MONTHLY_MAX = 1000000;
  const LUMPSUM_MAX = 10000000;

  return (
    <Paper elevation={0} sx={{ border: "none", borderRadius: 2, p: { xs: 2, md: 4 }, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
      {/* Tabs */}
      {mounted ? (
        <Tabs value={tab} onChange={handleTabChange} aria-label="SIP Tabs">
          <Tab id="tab-sip" aria-controls="tabpanel-sip" label={sipcalc?.tabs?.sip ?? "SIP"} />
          <Tab id="tab-lumpsum" aria-controls="tabpanel-lumpsum" label={sipcalc?.tabs?.lumpsum ?? "Lumpsum"} />
        </Tabs>
      ) : null}
      <Divider sx={{ my: 3 }} />

      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>

          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ mb: 4 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                <Typography variant="subtitle1" gutterBottom>
                  {tab === 0 ? sipcalc?.form?.monthlyInvestment ?? "Monthly investment"
                    : sipcalc?.form?.lumpsumInvestment ?? "Lumpsum investment"}
                </Typography>

                <CustomInput
                  value={amount}
                  onChange={setAmount}
                  startAdornment="₹"
                  error={amountError}
                  errorMessage={amountErrorMessage}
                  min={tab === 0 ? SIP_MIN : LUMPSUM_MIN}
                  max={tab === 0 ? MONTHLY_MAX : LUMPSUM_MAX}
                />
              </Stack>
              {/* Amount Slider */}
              <CustomSlider
                value={amount}
                min={tab === 0 ? SIP_MIN : LUMPSUM_MIN}
                max={tab === 0 ? MONTHLY_MAX : LUMPSUM_MAX}
                step={tab === 0 ? 100 : 1000}
                onChange={(e, v) => setAmount(v)}
                sx={{ mt: 2 }}
              />
            </Box>

            <Box sx={{ mb: 4 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                <Typography variant="subtitle1" gutterBottom>
                  {sipcalc?.form?.expectedReturn ?? "Expected return rate (p.a)"}
                </Typography>
                <CustomInput
                  value={annualReturn}
                  onChange={setAnnualReturn}
                  endAdornment="%"
                  error={returnError}
                  errorMessage={returnErrorMessage}
                  min={1}
                  max={30}
                />
              </Stack>

              {/* Return Rate Slider */}
              <CustomSlider
                value={annualReturn}
                min={1}
                max={30}
                step={0.1}
                onChange={(e, v) => setAnnualReturn(v)}
                sx={{ mt: 2 }}
              />
            </Box>

            <Box>
              <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                <Typography variant="subtitle1" gutterBottom>
                  {sipcalc?.form?.timePeriod ?? "Time period"}
                </Typography>
                <CustomInput
                  value={years}
                  onChange={setYears}
                  endAdornment="Yr"
                  error={yearsError}
                  errorMessage={yearsErrorMessage}
                  min={1}
                  max={40}
                />
              </Stack>

              {/* Years Slider */}
              <CustomSlider
                value={years}
                min={1}
                max={40}
                step={1}
                onChange={(e, v) => setYears(v)}
                sx={{ mt: 2 }}
              />
            </Box>

            <SWPResultsSummary
              fh={sipcalc?.results?.investedAmount ?? "Invested amount"}
              sh={sipcalc?.results?.estimatedReturns ?? "Est. returns"}
              th={sipcalc?.results?.totalValue ?? "Total value"}
              investedAmount={totalInvested}
              estimatedReturns={gain}
              totalValue={maturity}
              currency={fmtINR || currency}
            />
          </Grid>

          {/* Right side results */}
          <Grid size={{ xs: 12, md: 6 }} display="flex" alignItems="center" justifyContent={"center"}>
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
}
