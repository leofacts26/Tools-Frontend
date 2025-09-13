"use client";
import React, { useMemo, useState } from "react";
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
  LabelList,
} from "recharts";
import CustomInput from "../common/CustomInput";
import CustomSlider from "../common/CustomSlider";
import CustomTooltip from "../common/CustomTooltip";
import { usePathname, useRouter } from "next/navigation";
import { COLORS, fmtINR } from "@/lib/utils";
import SWPResultsSummary from "../common/SWPResultsSummary";


// Gray for invested, Blue for returns

export default function SipCalculator({ sipcalc }) {
  const pathname = usePathname();
  const router = useRouter();

  const tabFromPath = (p) => (p?.includes("lumpsum") ? 1 : 0);
  const [tab, setTab] = useState(() => tabFromPath(pathname));
  const [amount, setAmount] = useState(25000);
  const [years, setYears] = useState(10);
  const [annualReturn, setAnnualReturn] = useState(12);


  React.useEffect(() => {
    const t = tabFromPath(pathname);
    if (t !== tab) setTab(t);
  }, [pathname]);

  // compute monthly rate from annual (compounded)
  const monthlyRate = useMemo(() => {
    const r = annualReturn / 100;
    return Math.pow(1 + r, 1 / 12) - 1;
  }, [annualReturn]);

  const months = years * 12;

  // maturity calculation
  const maturity = useMemo(() => {
    if (tab === 1) {
      // lumpsum formula: FV = P * (1+r)^n
      return amount * Math.pow(1 + annualReturn / 100, years);
    }
    if (monthlyRate === 0) return amount * months;
    const factor = (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate;
    return amount * factor * (1 + monthlyRate);
  }, [tab, amount, years, months, monthlyRate, annualReturn]);

  const totalInvested = tab === 1 ? amount : amount * months;
  const gain = maturity - totalInvested;

  const pieData = [
    { name: sipcalc?.chart?.invested ?? "Invested", value: totalInvested },
    { name: sipcalc?.chart?.returns ?? "Returns", value: gain },
  ];

  const currency = (val) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val);


  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const handleTabChange = (e, v) => {
    setTab(v);
    // preserve locale if path starts with /<locale>/...
    const parts = (pathname || "").split("/").filter(Boolean); // ["en","tools","finance","lumpsum-calculator"]
    const localePrefix = parts.length ? `/${parts[0]}` : "";
    const target = v === 1 ? `${localePrefix}/tools/finance/lumpsum-calculator` : `${localePrefix}/tools/finance/sip-calculator`;
    router.push(target);
  };


  return (
    <>
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

            <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
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
                  />
                </Stack>
                {/* Amount Slider */}
                <CustomSlider
                  value={amount}
                  min={1000}
                  max={tab === 0 ? 200000 : 10000000}
                  step={1000}
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
                currency={fmtINR}
              />




            </Grid>

            {/* Right side results */}
            <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6 }} display="flex" alignItems="center" justifyContent={"center"}>
              <Box >
                <ResponsiveContainer width={320} height={400} aspect={1}>
                  <PieChart tabIndex={-1}>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={70}
                      outerRadius={100}
                      stroke="none"
                      labelLine={false}
                      label={false}
                    >
                      {pieData.map((entry, index) => (
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
    </>
  );
}
