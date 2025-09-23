// /hooks/useSimpleInterestCalculator.js
"use client";
import { useMemo, useState } from "react";

/**
 * useSimpleInterestCalculator
 *
 * Simple Interest state + calculation.
 *
 * Defaults:
 *  - principal: 100000
 *  - rate: 6 (% p.a)
 *  - years: 5
 *
 * Limits:
 *  - principal: 1000 .. 10,000,000
 *  - rate: 1 .. 50
 *  - years: 1 .. 30
 */
export default function useSimpleInterestCalculator({ initial = {} } = {}) {
  const DEFAULTS = {
    principal: typeof initial.principal !== "undefined" ? initial.principal : 100000,
    rate: typeof initial.rate !== "undefined" ? initial.rate : 6,
    years: typeof initial.years !== "undefined" ? initial.years : 5,
  };

  const LIMITS = {
    principal: { min: 1000, max: 10000000 },
    rate: { min: 1, max: 50 },
    years: { min: 1, max: 30 },
  };

  const [principal, setPrincipal] = useState(DEFAULTS.principal);
  const [rate, setRate] = useState(DEFAULTS.rate);
  const [years, setYears] = useState(DEFAULTS.years);

  // clampAndSet: preserve empty -> 0 (so UI shows errors); clamp only to max while typing
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

  // validation metadata
  const errors = {
    principal: {
      error: Number(principal) < LIMITS.principal.min,
      msg: `Minimum value allowed is ${LIMITS.principal.min}`,
    },
    rate: {
      error: Number(rate) < LIMITS.rate.min,
      msg: `Minimum value allowed is ${LIMITS.rate.min}%`,
    },
    years: {
      error: Number(years) < LIMITS.years.min,
      msg: `Minimum value allowed is ${LIMITS.years.min}`,
    },
  };

  // calculation
  const results = useMemo(() => {
    const P = Number(principal) || 0;
    const R = Number(rate) || 0;
    const T = Number(years) || 0;

    // If invalid / zero inputs: return sensible zeros (invested shows P*1? we'll show P as invested)
    if (P <= 0 || R <= 0 || T <= 0) {
      const invested = Math.round(P);
      return {
        investedAmount: invested,
        estimatedReturns: 0,
        totalAmount: invested,
      };
    }

    // Simple interest: SI = P * R * T / 100
    const si = (P * R * T) / 100;
    const A = P + si;

    const round = (x) => Math.round(x || 0);

    return {
      investedAmount: round(P),
      estimatedReturns: round(si),
      totalAmount: round(A),
    };
  }, [principal, rate, years]);

  return {
    LIMITS,
    principal,
    setPrincipal,
    rate,
    setRate,
    years,
    setYears,
    clampAndSet,
    errors,
    results,
  };
}
