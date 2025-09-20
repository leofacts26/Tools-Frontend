"use client";
import { Box, Grid, Paper, Stack, Typography } from "@mui/material";
import CustomInput from "../common/CustomInput";
import CustomSlider from "../common/CustomSlider";
import SWPResultsSummary from "../common/SWPResultsSummary";
import { fmtINR } from "@/lib/utils";
import useSWPCalculator from "@/hooks/useSWPCalculator";

const SWPCalculator = ({ swp }) => {
  const {
    LIMITS,
    investment,
    withdrawal,
    rate,
    years,
    setInvestment,
    setWithdrawal,
    setRate,
    setYears,
    clampAndSet,
    errors,
    results,
  } = useSWPCalculator();

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
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid size={12}>
            {/* Total Investment */}
            <Box sx={{ mb: 4 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                <Typography variant="subtitle1">
                  {swp?.form?.lumpsumInvestment ?? "Total Investment"}
                </Typography>
                <CustomInput
                  value={investment}
                  onChange={(v) => clampAndSet(v, LIMITS.investment, setInvestment)}
                  startAdornment="₹"
                  min={LIMITS.investment.min}
                  max={LIMITS.investment.max}
                  error={errors.investment.error}
                  errorMessage={errors.investment.msg}
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

            {/* Withdrawal per month */}
            <Box sx={{ mb: 4 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                <Typography variant="subtitle1">
                  {swp?.form?.withdrawalLabel ?? "Withdrawal per month"}
                </Typography>
                <CustomInput
                  value={withdrawal}
                  onChange={(v) => clampAndSet(v, LIMITS.withdrawal, setWithdrawal)}
                  startAdornment="₹"
                  min={LIMITS.withdrawal.min}
                  max={LIMITS.withdrawal.max}
                  error={errors.withdrawal.error}
                  errorMessage={errors.withdrawal.msg}
                />
              </Stack>
              <CustomSlider
                value={typeof withdrawal === "number" ? withdrawal : LIMITS.withdrawal.min}
                min={LIMITS.withdrawal.min}
                max={LIMITS.withdrawal.max}
                step={500}
                onChange={(e, v) => setWithdrawal(Math.round(v))}
                sx={{ mt: 2 }}
              />
            </Box>

            {/* Expected return rate */}
            <Box sx={{ mb: 4 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                <Typography variant="subtitle1">
                  {swp?.form?.expectedReturn ?? "Expected return rate (p.a)"}
                </Typography>
                <CustomInput
                  value={rate}
                  onChange={(v) => clampAndSet(v, LIMITS.rate, setRate)}
                  endAdornment="%"
                  min={LIMITS.rate.min}
                  max={LIMITS.rate.max}
                  error={errors.rate.error}
                  errorMessage={errors.rate.msg}
                />
              </Stack>
              <CustomSlider
                value={typeof rate === "number" ? rate : LIMITS.rate.min}
                min={LIMITS.rate.min}
                max={LIMITS.rate.max}
                step={0.1}
                onChange={(e, v) => setRate(Math.min(LIMITS.rate.max, Math.max(LIMITS.rate.min, Number(v))))}
                sx={{ mt: 2 }}
              />
            </Box>

            {/* Time Period */}
            <Box sx={{ mb: 4 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                <Typography variant="subtitle1">
                  {swp?.form?.timePeriod ?? "Time period"}
                </Typography>
                <CustomInput
                  value={years}
                  onChange={(v) => clampAndSet(v, LIMITS.years, setYears)}
                  endAdornment="Yr"
                  min={LIMITS.years.min}
                  max={LIMITS.years.max}
                  error={errors.years.error}
                  errorMessage={errors.years.msg}
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

            {/* Results */}
            <SWPResultsSummary
              fh={swp?.results?.investedAmount ?? "Total investment"}
              sh={swp?.results?.estimatedReturns ?? "Total withdrawal"}
              th={swp?.results?.totalValue ?? "Final value"}
              investedAmount={results.investedAmount}
              estimatedReturns={results.totalWithdrawal}
              totalValue={results.finalValue}
              currency={fmtINR}
            />
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default SWPCalculator;
