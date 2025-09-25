// /hooks/useStepUpSipCalculator.js
"use client";
import { useMemo, useState } from "react";

/**
 * useStepUpSipCalculator
 *
 * State + calculation for a Step-Up SIP
 *
 * Defaults:
 *  - monthlyInvestment: 25000
 *  - stepUpPct: 10 (% per year)
 *  - annualReturn: 12 (% p.a)
 *  - years: 10
 *
 * Limits:
 *  - monthlyInvestment: 100 .. 1,000,000
 *  - stepUpPct: 1 .. 50
 *  - annualReturn: 1 .. 30
 *  - years: 1 .. 40
 */
export default function useStepUpSipCalculator({ initial = {} } = {}) {
  const DEFAULTS = {
    monthlyInvestment: typeof initial.monthlyInvestment !== "undefined" ? initial.monthlyInvestment : 25000,
    stepUpPct: typeof initial.stepUpPct !== "undefined" ? initial.stepUpPct : 10,
    annualReturn: typeof initial.annualReturn !== "undefined" ? initial.annualReturn : 12,
    years: typeof initial.years !== "undefined" ? initial.years : 10,
  };

  const LIMITS = {
    monthlyInvestment: { min: 100, max: 1000000 },
    stepUpPct: { min: 1, max: 50 },
    annualReturn: { min: 1, max: 30 },
    years: { min: 1, max: 40 },
  };

  // UI state
  const [monthlyInvestment, setMonthlyInvestment] = useState(DEFAULTS.monthlyInvestment);
  const [stepUpPct, setStepUpPct] = useState(DEFAULTS.stepUpPct);
  const [annualReturn, setAnnualReturn] = useState(DEFAULTS.annualReturn);
  const [years, setYears] = useState(DEFAULTS.years);

  // clampAndSet: preserve empty -> 0 (so we can show errors), clamp only to max while typing
  const clampAndSet = (raw, { max } = {}, setter) => {
    if (raw === "" || raw === null || typeof raw === "undefined") {
      setter(0);
      return;
    }
    let num = Number(raw);
    if (!isFinite(num)) {
      setter(0);
      return;
    }
    if (typeof max === "number" && num > max) num = max;
    setter(num);
  };

  // validation errors/messages
  const errors = {
    monthlyInvestment: {
      error: Number(monthlyInvestment) < LIMITS.monthlyInvestment.min,
      msg: `Minimum value allowed is ${LIMITS.monthlyInvestment.min}`,
    },
    stepUpPct: {
      error: Number(stepUpPct) < LIMITS.stepUpPct.min,
      msg: `Minimum value allowed is ${LIMITS.stepUpPct.min}%`,
    },
    annualReturn: {
      error: Number(annualReturn) < LIMITS.annualReturn.min,
      msg: `Minimum value allowed is ${LIMITS.annualReturn.min}%`,
    },
    years: {
      error: Number(years) < LIMITS.years.min,
      msg: `Minimum value allowed is ${LIMITS.years.min}`,
    },
  };

  // Safe values used for calculation (so UI doesn't break when errors present)
  const safeMonthlyInvestment =
    Number(monthlyInvestment) >= LIMITS.monthlyInvestment.min
      ? Math.min(LIMITS.monthlyInvestment.max, Number(monthlyInvestment))
      : LIMITS.monthlyInvestment.min;

  const safeStepUpPct =
    Number(stepUpPct) >= LIMITS.stepUpPct.min
      ? Math.min(LIMITS.stepUpPct.max, Number(stepUpPct))
      : LIMITS.stepUpPct.min;

  const safeAnnualReturn =
    Number(annualReturn) >= LIMITS.annualReturn.min
      ? Math.min(LIMITS.annualReturn.max, Number(annualReturn))
      : LIMITS.annualReturn.min;

  const safeYears =
    Number(years) >= LIMITS.years.min
      ? Math.min(LIMITS.years.max, Number(years))
      : LIMITS.years.min;

  // Core simulator: iterate month-by-month, contributions at start of each month, then apply monthly interest
  const results = useMemo(() => {
    // choose whether we use actual raw inputs or safe values for calculation
    const anyError =
      errors.monthlyInvestment.error ||
      errors.stepUpPct.error ||
      errors.annualReturn.error ||
      errors.years.error;

    const M0 = anyError ? safeMonthlyInvestment : (Number(monthlyInvestment) || 0);
    const step = anyError ? safeStepUpPct : (Number(stepUpPct) || 0);
    const annual = anyError ? safeAnnualReturn : (Number(annualReturn) || 0);
    const yrs = anyError ? safeYears : (Number(years) || 0);

    const months = Math.max(0, Math.round(yrs * 12));
    // monthly rate from annual (compounded)
    const monthlyRate = monthlyRateFromAnnual(annual);

    const roundPaise = (x) => Math.round(x * 100) / 100;
    const roundRupee = (x) => Math.round(x);

    let balance = 0.0;
    let totalInvested = 0;

    for (let m = 0; m < months; m++) {
      // determine which year (0-based) we're in
      const yearIndex = Math.floor(m / 12);
      const multiplier = Math.pow(1 + step / 100, yearIndex);
      const contribution = roundRupee(M0 * multiplier);

      // contribution at start of month
      balance = roundPaise(balance + contribution);
      totalInvested += contribution;

      // then apply monthly interest
      if (monthlyRate !== 0) {
        balance = roundPaise(balance * (1 + monthlyRate));
      }
    }

    const maturity = roundRupee(balance);
    const gain = maturity - totalInvested;

    return {
      months,
      monthlyRate,
      investedAmount: totalInvested,
      estimatedReturns: gain,
      totalValue: maturity,
    };
  }, [
    monthlyInvestment,
    stepUpPct,
    annualReturn,
    years,
    // include errors and safe values
    errors.monthlyInvestment.error,
    errors.stepUpPct.error,
    errors.annualReturn.error,
    errors.years.error,
  ]);

  return {
    LIMITS,
    monthlyInvestment,
    setMonthlyInvestment,
    stepUpPct,
    setStepUpPct,
    annualReturn,
    setAnnualReturn,
    years,
    setYears,
    clampAndSet,
    errors,
    results,
  };
}

// helper: convert annual percentage to effective monthly rate (compounded)
function monthlyRateFromAnnual(annualPercent) {
  const r = Number(annualPercent) / 100;
  if (!isFinite(r) || r === 0) return 0;
  return Math.pow(1 + r, 1 / 12) - 1;
}
