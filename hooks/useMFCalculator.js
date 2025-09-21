// /hooks/useMFCalculator.js
"use client";
import { useState, useMemo } from "react";

/**
 * useMFCalculator
 * - Lumpsum mutual fund returns (FV = P * (1 + r)^n)
 * - UI state stores numeric values (clearing an input sets it to 0)
 * - Errors: set when current numeric value < configured min
 * - Calculations use per-field safe values: when value < min, we use min for calculation
 */
export default function useMFCalculator(initial = {}) {
  // defaults: match your example
  const [investment, setInvestment] = useState(() =>
    typeof initial.investment !== "undefined" ? initial.investment : 25000
  );
  const [annualReturn, setAnnualReturn] = useState(() =>
    typeof initial.annualReturn !== "undefined" ? initial.annualReturn : 12
  );
  const [years, setYears] = useState(() =>
    typeof initial.years !== "undefined" ? initial.years : 10
  );

  // limits (updated per request)
  const LIMITS = {
    investment: { min: 500, max: 10000000 }, // min ₹500 (changed)
    rate: { min: 1, max: 50 },               // max 50% (changed)
    years: { min: 1, max: 40 },              // min 1 year
  };

  /**
   * clampAndSet
   * - If user clears field (raw === ""), set value to 0 (so the input shows 0 and error)
   * - Allow values below min to remain (error will show)
   * - Clamp values above max to max
   */
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

  // error flags — true when numeric value is below the min
  const investmentError = Number(investment) < LIMITS.investment.min;
  const rateError = Number(annualReturn) < LIMITS.rate.min || Number(annualReturn) > LIMITS.rate.max;
  const yearsError = Number(years) < LIMITS.years.min;

  const errors = {
    investment: {
      error: investmentError,
      msg: `Minimum value allowed is ${LIMITS.investment.min.toLocaleString()}`,
    },
    rate: {
      error: rateError,
      msg: `Minimum value allowed is ${LIMITS.rate.min} and maximum allowed is ${LIMITS.rate.max}`,
    },
    years: { error: yearsError, msg: `Minimum value allowed is ${LIMITS.years.min}` },
  };

  // safe values for calculation — fallback to min when below min, clamp to max when above
  const safeInvestment =
    Number(investment) < LIMITS.investment.min
      ? LIMITS.investment.min
      : Math.min(LIMITS.investment.max, Number(investment));

  const safeRate =
    Number(annualReturn) < LIMITS.rate.min
      ? LIMITS.rate.min
      : Math.min(LIMITS.rate.max, Number(annualReturn));

  const safeYears =
    Number(years) < LIMITS.years.min ? LIMITS.years.min : Math.min(LIMITS.years.max, Number(years));

  // results (lumpsum FV)
  const results = useMemo(() => {
    const P = Number(safeInvestment);
    const r = Number(safeRate) / 100;
    const n = Number(safeYears);

    const roundRupee = (x) => Math.round(x);

    // FV = P * (1 + r)^n
    const maturity = roundRupee(P * Math.pow(1 + r, n));
    const investedAmount = roundRupee(P);
    const gain = roundRupee(maturity - investedAmount);

    return {
      maturity,
      investedAmount,
      gain,
    };
  }, [safeInvestment, safeRate, safeYears]);

  return {
    LIMITS,
    investment,
    annualReturn,
    years,
    setInvestment,
    setAnnualReturn,
    setYears,
    clampAndSet,
    errors,
    results,
  };
}
