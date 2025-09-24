// /hooks/useCompoundInterestCalculator.js
"use client";
import { useMemo, useState } from "react";

/**
 * useCompoundInterestCalculator
 *
 * State + calculation for compound interest calculator.
 *
 * Defaults:
 *  - principal: 100000
 *  - rate: 6 (% p.a)
 *  - years: 5
 *  - frequency: "Yearly" (n=1); cycles to Half-Yearly (n=2) then Quarterly (n=4)
 *
 * Limits:
 *  - principal: 1000 .. 10,000,000
 *  - rate: 1 .. 50
 *  - years: 1 .. 30
 */
export default function useCompoundInterestCalculator({ initial = {} } = {}) {
  const DEFAULTS = {
    principal: typeof initial.principal !== "undefined" ? initial.principal : 100000,
    rate: typeof initial.rate !== "undefined" ? initial.rate : 6,
    years: typeof initial.years !== "undefined" ? initial.years : 5,
    frequency: initial.frequency ?? "Yearly", // "Yearly" | "Half-Yearly" | "Quarterly"
  };

  const LIMITS = {
    principal: { min: 1000, max: 10000000 },
    rate: { min: 1, max: 50 },
    years: { min: 1, max: 30 },
  };

  // UI state
  const [principal, setPrincipal] = useState(DEFAULTS.principal);
  const [rate, setRate] = useState(DEFAULTS.rate);
  const [years, setYears] = useState(DEFAULTS.years);
  const [frequency, setFrequency] = useState(DEFAULTS.frequency);

  // clamp-and-set helper: preserve empty -> 0 so we can show errors; clamp to max while typing
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

  // map frequency -> n
  const freqToN = (f) => {
    if (f === "Half-Yearly") return 2;
    if (f === "Quarterly") return 4;
    return 1; // Yearly
  };

  // cycle frequency: Yearly -> Half-Yearly -> Quarterly -> Yearly
  const cycleFrequency = () => {
    if (frequency === "Yearly") setFrequency("Half-Yearly");
    else if (frequency === "Half-Yearly") setFrequency("Quarterly");
    else setFrequency("Yearly");
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
    years: {
      error: Number(years) < LIMITS.years.min,
      msg: `Minimum value allowed is ${LIMITS.years.min}`,
    },
  };

  // calculation: A = P * (1 + r/n)^(n * t)
  const results = useMemo(() => {
    const P = Number(principal) || 0;
    const R = Number(rate) || 0;
    const t = Number(years) || 0;
    const n = freqToN(frequency);

    if (P <= 0 || R <= 0 || t <= 0) {
      // if invalid, return invested = P (rounded), others zero
      const invested = Math.round(P);
      return {
        investedAmount: invested,
        estimatedReturns: 0,
        totalAmount: invested,
        n,
      };
    }

    const r = R / 100;
    const exponent = n * t;
    const base = 1 + r / n;
    const amount = P * Math.pow(base, exponent);
    const interest = amount - P;

    const round = (v) => Math.round(v || 0);

    return {
      investedAmount: round(P),
      estimatedReturns: round(interest),
      totalAmount: round(amount),
      n,
    };
  }, [principal, rate, years, frequency]);

  return {
    LIMITS,
    principal,
    setPrincipal,
    rate,
    setRate,
    years,
    setYears,
    frequency,
    setFrequency,
    cycleFrequency,
    clampAndSet,
    errors,
    results,
  };
}
