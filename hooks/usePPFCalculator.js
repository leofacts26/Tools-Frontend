// /hooks/usePPFCalculator.js
"use client";
import { useMemo, useState } from "react";

/**
 * usePPFCalculator
 *
 * - Annual deposits (annuity-due): deposit at start of each year
 * - Formula used: F = P * ( ((1+i)^n - 1) / i ) * (1 + i)
 *
 * Options:
 *  - initial: { yearlyInvestment, years, rate }
 *
 * UI behaviour:
 *  - clearing an input stores 0 (so error is shown)
 *  - calculations use safe fallbacks (min values) to keep results sensible
 */
export default function usePPFCalculator(initial = {}) {
  const [yearlyInvestment, setYearlyInvestment] = useState(
    typeof initial.yearlyInvestment !== "undefined" ? initial.yearlyInvestment : 10000
  );
  const [years, setYears] = useState(
    typeof initial.years !== "undefined" ? initial.years : 15
  );
  const [rate, setRate] = useState(
    typeof initial.rate !== "undefined" ? initial.rate : 7.1
  );

  // Limits as requested
  const LIMITS = {
    yearlyInvestment: { min: 500, max: 150000 },
    years: { min: 15, max: 50 },
    rate: { min: 0.1, max: 50 },
  };

  // When user clears input (""), set to 0 so the UI shows error immediately.
  // Clamp upper bound to max.
  const clampAndSet = (raw, { max }, setter) => {
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

  // UI errors
  const yearlyInvestmentError = Number(yearlyInvestment) < LIMITS.yearlyInvestment.min;
  const yearsError = Number(years) < LIMITS.years.min;
  const rateError = Number(rate) < LIMITS.rate.min || Number(rate) > LIMITS.rate.max;

  const errors = {
    yearlyInvestment: {
      error: yearlyInvestmentError,
      msg: `Minimum value allowed is ${LIMITS.yearlyInvestment.min}`,
    },
    years: {
      error: yearsError,
      msg: `Minimum value allowed is ${LIMITS.years.min}`,
    },
    rate: {
      error: rateError,
      msg: `Rate must be between ${LIMITS.rate.min}% and ${LIMITS.rate.max}%`,
    },
  };

  // Safe fallback values for calculation (so chart/results never collapse)
  const safeYearlyInvestment = Number(yearlyInvestment) < LIMITS.yearlyInvestment.min
    ? LIMITS.yearlyInvestment.min
    : Math.min(LIMITS.yearlyInvestment.max, Number(yearlyInvestment));

  const safeYears = Number(years) < LIMITS.years.min
    ? LIMITS.years.min
    : Math.min(LIMITS.years.max, Number(years));

  const safeRate = Number(rate) < LIMITS.rate.min
    ? LIMITS.rate.min
    : Math.min(LIMITS.rate.max, Number(rate));

  // Calculation using annuity-due formula
  const results = useMemo(() => {
    const P = Number(safeYearlyInvestment); // yearly deposit
    const n = Number(safeYears);            // number of deposits / years
    const i = Number(safeRate) / 100;       // decimal interest per year

    const roundRupee = (x) => Math.round(x);

    if (i === 0) {
      const maturity = roundRupee(P * n);
      return {
        investedAmount: roundRupee(P * n),
        totalInterest: 0,
        maturityValue: maturity,
      };
    }

    // standard annuity-due future value
    // F = P * ( ((1+i)^n - 1) / i ) * (1 + i)
    const factor = (Math.pow(1 + i, n) - 1) / i;
    const futureValue = P * factor * (1 + i);

    const maturityValue = roundRupee(futureValue);
    const investedAmount = roundRupee(P * n);
    const totalInterest = roundRupee(maturityValue - investedAmount);

    return {
      investedAmount,
      totalInterest,
      maturityValue,
    };
  }, [safeYearlyInvestment, safeYears, safeRate]);

  return {
    LIMITS,
    yearlyInvestment,
    setYearlyInvestment,
    years,
    setYears,
    rate,
    setRate,
    clampAndSet,
    errors,
    results,
  };
}
