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
      sip: "/tools/finance/sip-calculator",
      lumpsum: "/tools/finance/lumpsum-calculator",
    },
    pathnamePrefix: localePrefix,
  });

  // Validation rules (controls UI error states)
  const amountError = tab === 0 && (!amount || Number(amount) < 100);
  const amountErrorMessage = "Minimum value allowed is 100";

  const returnError = !annualReturn || Number(annualReturn) < 1;
  const returnErrorMessage = "Minimum value allowed is 1";

  const yearsError = !years || Number(years) < 1;
  const yearsErrorMessage = "Minimum value allowed is 1";

  // --- Clamp / sanitizer: ensure calculations always have sensible minimums
  const safeAmount = tab === 1
    ? Number(amount) >= 1 ? Number(amount) : 100
    : (Number(amount) >= 100 ? Number(amount) : 100);

  const safeReturn = Number(annualReturn) >= 1 ? Number(annualReturn) : 1;
  const safeYears = Number(years) >= 1 ? Number(years) : 1;

  // Compute safeResults for display when inputs invalid
  const safeResults = useMemo(() => {
    if (tab === 1) {
      const p = safeAmount;
      const r = safeReturn / 100;
      const n = safeYears;
      const maturity = p * Math.pow(1 + r, n);
      const totalInvested = p;
      const gain = maturity - totalInvested;
      return { maturity, totalInvested, gain, months: n * 12, monthlyRate: null };
    } else {
      const monthlyAmount = safeAmount;
      const r = safeReturn / 100;
      const monthlyRate = Math.pow(1 + r, 1 / 12) - 1;
      const months = Math.max(0, Math.round(safeYears * 12));
      if (monthlyRate === 0) {
        const totalInvested = monthlyAmount * months;
        return { maturity: totalInvested, totalInvested, gain: 0, months, monthlyRate };
      }
      const factor = (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate;
      const maturity = monthlyAmount * factor * (1 + monthlyRate);
      const totalInvested = monthlyAmount * months;
      const gain = maturity - totalInvested;
      return { maturity, totalInvested, gain, months, monthlyRate };
    }
  }, [tab, safeAmount, safeReturn, safeYears]);

  // Decide whether to use actual results or safeResults for display
  const displayResults = useMemo(() => {
    const allValid = !amountError && !returnError && !yearsError;
    return allValid ? results : safeResults;
  }, [results, safeResults, amountError, returnError, yearsError]);

  const displayPieData = useMemo(() => [
    { name: sipcalc?.chart?.invested ?? "Invested", value: displayResults.totalInvested },
    { name: sipcalc?.chart?.returns ?? "Returns", value: Math.max(0, displayResults.gain) },
  ], [displayResults, sipcalc]);

  const maturity = displayResults.maturity;
  const totalInvested = displayResults.totalInvested;
  const gain = displayResults.gain;

  const currency = (val) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val);

  // Updated monthly max to 1,000,000
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
                  min={tab === 0 ? 100 : 1}
                  max={tab === 0 ? MONTHLY_MAX : LUMPSUM_MAX}
                />
              </Stack>
              {/* Amount Slider */}
              <CustomSlider
                value={amount}
                min={tab === 0 ? 100 : 1}
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
            <Box>
              <ResponsiveContainer width={320} height={400} aspect={1}>
                <PieChart tabIndex={-1}>
                  <Pie
                    data={displayPieData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={70}
                    outerRadius={100}
                    stroke="none"
                    labelLine={false}
                    label={false}
                  >
                    {displayPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={(props) => <CustomTooltip {...props} currencyFn={currency} />}
                  />

                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Grid>

        </Grid>
      </Box>
    </Paper>
  );
}
