// /components/calculators/GratuityCalculator.jsx
"use client";
import React from "react";
import { Box, Grid, Paper, Stack, Typography, Divider } from "@mui/material";
import CustomInput from "../common/CustomInput";
import CustomSlider from "../common/CustomSlider";
import useGratuityCalculator from "@/hooks/useGratuityCalculator";
import { fmtINR } from "@/lib/utils";

const GratuityCalculator = ({ config = {} }) => {
  const {
    LIMITS,
    monthlySalary,
    setMonthlySalary,
    yearsOfService,
    setYearsOfService,
    clampAndSet,
    errors,
    results,
  } = useGratuityCalculator({
    initial: {
      monthlySalary: config.initialMonthlySalary ?? 60000,
      yearsOfService: config.initialYearsOfService ?? 20,
    },
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
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Formula used: <code>G = n × b × 15/26</code>. Years are rounded to nearest whole year. Gratuity is capped at ₹10,00,000.
              </Typography>
            </Box>

            {/* Monthly Salary */}
            <Box sx={{ mb: 4 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                <Typography variant="subtitle1">Monthly Salary (Basic + DA)</Typography>
                <CustomInput
                  value={monthlySalary}
                  onChange={(v) => clampAndSet(v, LIMITS.monthlySalary, setMonthlySalary)}
                  startAdornment="₹"
                  min={LIMITS.monthlySalary.min}
                  max={LIMITS.monthlySalary.max}
                  error={errors.monthlySalary.error}
                  errorMessage={errors.monthlySalary.msg}
                  width={180}
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

            {/* Years of service */}
            <Box sx={{ mb: 4 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                <Typography variant="subtitle1">Years of service</Typography>
                <CustomInput
                  value={yearsOfService}
                  onChange={(v) => clampAndSet(v, LIMITS.yearsOfService, setYearsOfService)}
                  endAdornment="Yr"
                  min={LIMITS.yearsOfService.min}
                  max={LIMITS.yearsOfService.max}
                  error={errors.yearsOfService.error}
                  errorMessage={errors.yearsOfService.msg}
                  width={120}
                />
              </Stack>
              <CustomSlider
                value={typeof yearsOfService === "number" ? yearsOfService : LIMITS.yearsOfService.min}
                min={LIMITS.yearsOfService.min}
                max={LIMITS.yearsOfService.max}
                step={1}
                onChange={(e, v) => setYearsOfService(Math.round(v))}
                sx={{ mt: 2 }}
              />
            </Box>

            {/* Summary */}
            <Box sx={{ mt: 2, mb: 2, p: 2, borderRadius: 1, backgroundColor: "background.paper", boxShadow: "inset 0 1px 0 rgba(0,0,0,0.02)" }}>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Rounded years</Typography>
                  <Typography variant="h6" sx={{ mt: 0.5 }}>{results.roundedYears}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Cap</Typography>
                  <Typography variant="h6" sx={{ mt: 0.5 }}>{currency(results.cap)}</Typography>
                </Grid>
              </Grid>
            </Box>

            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2">Total gratuity payable</Typography>
              <Typography variant="h4" sx={{ mt: 1 }}>
                {currency(results.gratuityCapped)}
              </Typography>

              <Typography variant="h5" color="text.secondary" sx={{ mt: 1 }}>
                {results.capped ? (
                  <>
                    Raw computed gratuity{" "}
                    <Box component="span" sx={{ fontWeight: 700, display: "inline" }}>
                      {currency(results.gratuityRaw)}
                    </Box>{" "}
                    exceeds cap{" "}
                    <Box component="span" sx={{ fontWeight: 700, display: "inline" }}>
                      {currency(results.cap)}
                    </Box>
                    , so capped.
                  </>
                ) : (
                  <>
                    Computed using formula:{" "}
                    <Box component="span" sx={{ fontWeight: 700, display: "inline" }}>
                      {results.formula}
                    </Box>
                  </>
                )}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default GratuityCalculator;
