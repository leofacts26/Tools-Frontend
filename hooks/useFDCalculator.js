// /hooks/useFDCalculator.js
"use client";
import { useMemo, useState } from "react";

/**
 * useFDCalculator
 *
 * State + calculation for FD calculator with unit-cycling (Years / Months / Days).
 *
 * Default values:
 *  - investment: 100000 (min 5000, max 10000000)
 *  - rate: 6.5% (min 1, max 15)
 *  - unit: "Years"
 *  - years default: 5 (min 1, max 25)
 *  - months default: 5 (min 1, max 11)
 *  - days default: 5 (min 1, max 31)
 *
 * Exposes: clampAndSet, cycleUnit, errors, results
 */
export default function useFDCalculator({
  initial = {},
} = {}) {
  const DEFAULTS = {
    investment: typeof initial.investment !== "undefined" ? initial.investment : 100000,
    rate: typeof initial.rate !== "undefined" ? initial.rate : 6.5,
    unit: initial.unit ?? "Years",
    years: typeof initial.years !== "undefined" ? initial.years : 5,
    months: typeof initial.months !== "undefined" ? initial.months : 5,
    days: typeof initial.days !== "undefined" ? initial.days : 5,
    interestType: initial.interestType ?? "compound",
  };

  const LIMITS = {
    investment: { min: 5000, max: 10000000 },
    rate: { min: 1, max: 15 },
    years: { min: 1, max: 25 },
    months: { min: 1, max: 11 },
    days: { min: 1, max: 31 },
  };

  // state
  const [investment, setInvestment] = useState(DEFAULTS.investment);
  const [rate, setRate] = useState(DEFAULTS.rate);
  const [unit, setUnit] = useState(DEFAULTS.unit); // "Years" | "Months" | "Days"
  const [years, setYears] = useState(DEFAULTS.years);
  const [months, setMonths] = useState(DEFAULTS.months);
  const [days, setDays] = useState(DEFAULTS.days);
  const [interestType, setInterestType] = useState(DEFAULTS.interestType);

  // clamp setter that preserves empty ("") -> 0 (so UI shows error)
  const clampAndSet = (rawValue, { min, max } = {}, setter) => {
    if (rawValue === "" || rawValue === null || typeof rawValue === "undefined") {
      setter(0);
      return;
    }
    let num = Number(rawValue);
    if (!isFinite(num)) {
      setter(0);
      return;
    }
    if (typeof max === "number" && num > max) num = max;
    setter(num);
  };

  // errors and messages
  const errors = {
    investment: {
      error: Number(investment) < LIMITS.investment.min,
      msg: `Minimum value allowed is ${LIMITS.investment.min}`,
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
    days: {
      error: Number(days) < LIMITS.days.min,
      msg: `Minimum value allowed is ${LIMITS.days.min}`,
    },
  };

  // convert current unit/values to a time-in-years (floating)
  const timeInYears = useMemo(() => {
    if (unit === "Years") return Number(years) || 0;
    if (unit === "Months") return (Number(months) || 0) / 12;
    if (unit === "Days") return (Number(days) || 0) / 365;
    return 0;
  }, [unit, years, months, days]);

  // compute compound/simple maturity and breakdown
  const results = useMemo(() => {
    const P = Number(investment) || 0;
    const r = Number(rate) || 0;

    let maturity = 0;
    let estimatedReturns = 0;

    if (interestType === "simple") {
      const tYears = timeInYears;
      const interest = P * (r / 100) * tYears;
      maturity = P + interest;
      estimatedReturns = interest;
    } else {
      // compound
      if (unit === "Years") {
        const t = Number(years) || 0;
        if (t <= 0) {
          maturity = P;
          estimatedReturns = 0;
        } else {
          maturity = P * Math.pow(1 + r / 100, t);
          estimatedReturns = maturity - P;
        }
      } else if (unit === "Months") {
        const m = Number(months) || 0;
        const monthlyRate = (r / 100) / 12;
        if (m <= 0) {
          maturity = P;
          estimatedReturns = 0;
        } else {
          maturity = P * Math.pow(1 + monthlyRate, m);
          estimatedReturns = maturity - P;
        }
      } else if (unit === "Days") {
        const d = Number(days) || 0;
        const dailyRate = (r / 100) / 365;
        if (d <= 0) {
          maturity = P;
          estimatedReturns = 0;
        } else {
          maturity = P * Math.pow(1 + dailyRate, d);
          estimatedReturns = maturity - P;
        }
      } else {
        maturity = P;
        estimatedReturns = 0;
      }
    }

    // rounding to rupee for UI
    const round = (x) => Math.round(x || 0);
    return {
      investedAmount: round(P),
      estimatedReturns: round(estimatedReturns),
      totalValue: round(maturity),
    };
  }, [investment, rate, unit, years, months, days, interestType, timeInYears]);

  // cycleUnit: Years -> Months -> Days -> Years
  const cycleUnit = () => {
    const order = ["Years", "Months", "Days"];
    const idx = order.indexOf(unit);
    const next = order[(idx + 1) % order.length];
    setUnit(next);

    // ensure default value for the newly selected unit (if falsy/0)
    if (next === "Years") {
      if (!years || Number(years) < LIMITS.years.min) setYears(DEFAULTS.years);
    } else if (next === "Months") {
      if (!months || Number(months) < LIMITS.months.min) setMonths(DEFAULTS.months);
    } else {
      if (!days || Number(days) < LIMITS.days.min) setDays(DEFAULTS.days);
    }
  };

  return {
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
  };
}
