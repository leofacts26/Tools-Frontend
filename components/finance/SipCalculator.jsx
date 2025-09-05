"use client";
import React, { useMemo, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  TextField,
  InputAdornment,
  Slider,
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

const COLORS = ["#9e9e9e", "#2196f3"]; // Gray for invested, Blue for returns

export default function SipCalculator() {
  const [tab, setTab] = useState(0); // 0 = SIP, 1 = Lumpsum
  const [amount, setAmount] = useState(25000);
  const [years, setYears] = useState(10);
  const [annualReturn, setAnnualReturn] = useState(12);

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
    { name: "Invested", value: totalInvested },
    { name: "Returns", value: gain },
  ];

  const currency = (val) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val);

  return (
    <Box>
      <Paper elevation={0} sx={{ borderRadius: 2, p: { xs: 2, md: 4 }, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
        {/* Tabs */}
        <Tabs value={tab} onChange={(e, v) => setTab(v)} centered textColor="primary" indicatorColor="primary">
          <Tab label="SIP" sx={{ textTransform: "none", fontWeight: 600 }} />
          <Tab label="Lumpsum" sx={{ textTransform: "none", fontWeight: 600 }} />
        </Tabs>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>

            <Grid size xs={12} md={6}>
              <Box sx={{ mb: 4 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Typography variant="subtitle1" gutterBottom>
                    {tab === 0 ? "Monthly investment" : "Lumpsum investment"}
                  </Typography>
                  <CustomInput amount={amount} setAmount={setAmount} />
                </Stack>
                <Slider
                  value={amount}
                  min={1000}
                  max={tab === 0 ? 200000 : 10000000}
                  step={1000}
                  onChange={(e, v) => setAmount(v)}
                  sx={{ mt: 2 }}
                />
              </Box>

              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Expected return rate (p.a)
                </Typography>
                <TextField
                  fullWidth
                  type="number"
                  value={annualReturn}
                  onChange={(e) => setAnnualReturn(Number(e.target.value))}
                  InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
                />
                
                <Slider
                  value={annualReturn}
                  min={1}
                  max={30}
                  step={0.1}
                  onChange={(e, v) => setAnnualReturn(v)}
                  sx={{ mt: 2 }}
                />
              </Box>

              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Time period
                </Typography>
                <TextField
                  fullWidth
                  type="number"
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  InputProps={{ endAdornment: <InputAdornment position="end">Yr</InputAdornment> }}
                />
                <Slider
                  value={years}
                  min={1}
                  max={40}
                  step={1}
                  onChange={(e, v) => setYears(v)}
                  sx={{ mt: 2 }}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Typography variant="body2" color="text.secondary">
                    Invested amount
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {currency(totalInvested)}
                  </Typography>
                </Stack>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Typography variant="body2" color="text.secondary">
                    Est. returns
                  </Typography>
                  <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
                    {currency(gain)}
                  </Typography>
                </Stack>
              </Box>

              <Box sx={{ mb: 4 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Typography variant="body2" color="text.secondary">
                    Total value
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {currency(maturity)}
                  </Typography>
                </Stack>
              </Box>

            </Grid>

            {/* Right side results */}
            <Grid size xs={12} md={6}>
              <Box sx={{ width: "400px", height: 350 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={70}
                      outerRadius={100}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val) => currency(val)} />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Grid>

          </Grid>
        </Box>


      </Paper>
    </Box>
  );
}
