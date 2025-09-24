// /hooks/useNSCCalculator.js
"use client";
import { useMemo, useState } from "react";

/**
 * useNSCCalculator - simple hook for NSC calculator
 *
 * Defaults:
 *  - principal: 100000
 *  - rate: 6 (% p.a)
 *  - years: 5 (fixed)
 *  - frequency: "Yearly" | "Half-Yearly" (toggle)
 *
 * Limits:
 *  - principal: 1000 .. 10,000,000
 *  - rate: 1 .. 10
 */
export default function useNSCCalculator({ initial = {} } = {}) {
  const DEFAULTS = {
    principal: typeof initial.principal !== "undefined" ? initial.principal : 100000,
    rate: typeof initial.rate !== "undefined" ? initial.rate : 6,
    years: typeof initial.years !== "undefined" ? initial.years : 5, // fixed
    frequency: initial.frequency ?? "Yearly",
  };

  const LIMITS = {
    principal: { min: 1000, max: 10000000 },
    rate: { min: 1, max: 10 },
    years: { min: 5, max: 5 }, // NSC tenure fixed at 5 years in UI (disabled)
  };

  // UI state
  const [principal, setPrincipal] = useState(DEFAULTS.principal);
  const [rate, setRate] = useState(DEFAULTS.rate);
  const [years /* not setter */, ] = useState(DEFAULTS.years);
  const [frequency, setFrequency] = useState(DEFAULTS.frequency);

  // clamp-and-set helper: preserve empty -> 0 (so UI shows errors), clamp only to max while typing
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

  // cycle frequency between Yearly <-> Half-Yearly
  const cycleFrequency = () => {
    setFrequency((f) => (f === "Yearly" ? "Half-Yearly" : "Yearly"));
  };

  // validation errors/messages
  const errors = {
    principal: {
      error: Number(principal) < LIMITS.principal.min,
      msg: `Minimum value allowed is ${LIMITS.principal.min}`,
    },
    rate: {
      error: Number(rate) < LIMITS.rate.min,
      msg: `Minimum value allowed is ${LIMITS.rate.min}%`,
    },
  };

  // core calculation: A = P * (1 + r/n)^(n * t)
  const results = useMemo(() => {
    const P = Number(principal) || 0;
    const R = Number(rate) || 0;
    const t = Number(years) || 0;
    const n = frequency === "Half-Yearly" ? 2 : 1;

    // If any required input is zero/invalid -> show invested = P, others computed with safe values
    if (P <= 0 || R <= 0 || t <= 0) {
      const invested = Math.round(P);
      return {
        investedAmount: invested,
        totalInterest: 0,
        totalAmount: invested,
        n,
        years: t,
      };
    }

    const r = R / 100;
    const amount = P * Math.pow(1 + r / n, n * t);
    const interest = amount - P;

    const round = (v) => Math.round(v || 0);

    return {
      investedAmount: round(P),
      totalInterest: round(interest),
      totalAmount: round(amount),
      n,
      years: t,
    };
  }, [principal, rate, years, frequency]);

  return {
    LIMITS,
    principal,
    setPrincipal,
    rate,
    setRate,
    years,
    frequency,
    cycleFrequency,
    clampAndSet,
    errors,
    results,
  };
}
