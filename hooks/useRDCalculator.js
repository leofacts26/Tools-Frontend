// /hooks/useRDCalculator.js
"use client";
import { useMemo, useState } from "react";

/**
 * useRDCalculator
 *
 * State + calculation for Recurring Deposit (RD) with unit pill (Years <-> Months).
 *
 * Defaults:
 *  - monthlyInvestment: 50000 (min 500, max 1000000)
 *  - rate: 6.5% (min 1, max 15)
 *  - unit: "Years" (cycles to "Months")
 *  - years: 3 (min 1, max 10)
 *  - months: 3 (min 1, max 9)
 *
 * Calculation:
 *  - totalMonths = (years * 12) OR months (depending on unit)
 *  - monthlyRate = r/12
 *  - FV (annuity-due) = P * [ ((1+i)^n - 1) / i ] * (1 + i)
 */
export default function useRDCalculator({ initial = {} } = {}) {
  const DEFAULTS = {
    monthlyInvestment: typeof initial.monthlyInvestment !== "undefined" ? initial.monthlyInvestment : 50000,
    rate: typeof initial.rate !== "undefined" ? initial.rate : 6.5,
    unit: initial.unit ?? "Years", // "Years" or "Months"
    years: typeof initial.years !== "undefined" ? initial.years : 3,
    months: typeof initial.months !== "undefined" ? initial.months : 3,
  };

  const LIMITS = {
    monthlyInvestment: { min: 500, max: 1000000 },
    rate: { min: 1, max: 15 },
    years: { min: 1, max: 10 },
    months: { min: 1, max: 9 },
  };

  // UI state
  const [monthlyInvestment, setMonthlyInvestment] = useState(DEFAULTS.monthlyInvestment);
  const [rate, setRate] = useState(DEFAULTS.rate);
  const [unit, setUnit] = useState(DEFAULTS.unit);
  const [years, setYears] = useState(DEFAULTS.years);
  const [months, setMonths] = useState(DEFAULTS.months);

  // clamp setter (preserve empty -> 0 so UI can show errors)
  const clampAndSet = (raw, limits = {}, setter) => {
    if (raw === "" || raw === null || typeof raw === "undefined") {
      setter(0);
      return;
    }
    let num = Number(raw);
    if (!isFinite(num)) {
      setter(0);
      return;
    }
    if (typeof limits.max === "number" && num > limits.max) num = limits.max;
    setter(num);
  };

  // errors/messages
  const errors = {
    monthlyInvestment: {
      error: Number(monthlyInvestment) < LIMITS.monthlyInvestment.min,
      msg: `Minimum value allowed is ${LIMITS.monthlyInvestment.min}`,
    },
    rate: {
      error: Number(rate) < LIMITS.rate.min,
      msg: `Minimum value allowed is ${LIMITS.rate.min}`,
    },
    years: {
      error: Number(years) < LIMITS.years.min,
      msg: `Minimum value allowed is ${LIMITS.years.min}`,
    },
    months: {
      error: Number(months) < LIMITS.months.min,
      msg: `Minimum value allowed is ${LIMITS.months.min}`,
    },
  };

  // compute total months based on unit
  const totalMonths = useMemo(() => {
    if (unit === "Years") {
      const y = Number(years) || 0;
      return Math.max(0, Math.round(y * 12));
    }
    // Months unit:
    return Math.max(0, Math.round(Number(months) || 0));
  }, [unit, years, months]);

  // RD calculation (annuity-due) and rounding to rupees
  const results = useMemo(() => {
    const P = Number(monthlyInvestment) || 0;
    const r = Number(rate) || 0;
    const n = totalMonths;

    if (P <= 0 || n <= 0 || r <= 0) {
      // Return invested even if others are 0 so UI can show invested=0 or invested=P*n
      return {
        investedAmount: Math.round(P * n),
        estimatedReturns: 0,
        totalValue: Math.round(P * n),
        totalMonths: n,
      };
    }

    const monthlyRate = (r / 100) / 12; // i
    const pow = Math.pow(1 + monthlyRate, n);
    const factor = (pow - 1) / monthlyRate;
    const fv = P * factor * (1 + monthlyRate); // annuity-due

    const invested = P * n;
    const returns = fv - invested;
    const round = (x) => Math.round(x || 0);

    return {
      investedAmount: round(invested),
      estimatedReturns: round(returns),
      totalValue: round(fv),
      totalMonths: n,
    };
  }, [monthlyInvestment, rate, totalMonths]);

  // cycle unit between Years <-> Months and ensure default value if current is falsy/0
  const cycleUnit = () => {
    if (unit === "Years") {
      setUnit("Months");
      if (!months || Number(months) < LIMITS.months.min) setMonths(DEFAULTS.months);
    } else {
      setUnit("Years");
      if (!years || Number(years) < LIMITS.years.min) setYears(DEFAULTS.years);
    }
  };

  return {
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
  };
}
