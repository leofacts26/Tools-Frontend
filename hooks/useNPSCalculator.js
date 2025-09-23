// /hooks/useNPSCalculator.js
"use client";
import { useMemo, useState } from "react";

/**
 * useNPSCalculator
 *
 * State + calc for NPS (monthly contributions until retirementAge).
 *
 * initial options:
 *  - monthlyInvestment
 *  - annualReturn
 *  - age
 *  - retirementAge (default 60)
 */
export default function useNPSCalculator({
  initial = {},
  retirementAge = 60,
} = {}) {
  const DEFAULTS = {
    monthlyInvestment: typeof initial.monthlyInvestment !== "undefined" ? initial.monthlyInvestment : 10000,
    annualReturn: typeof initial.annualReturn !== "undefined" ? initial.annualReturn : 9,
    age: typeof initial.age !== "undefined" ? initial.age : 20,
  };

  const LIMITS = {
    monthlyInvestment: { min: 500, max: 150000 },
    annualReturn: { min: 8, max: 15 },
    age: { min: 18, max: 60 },
  };

  const [monthlyInvestment, setMonthlyInvestment] = useState(DEFAULTS.monthlyInvestment);
  const [annualReturn, setAnnualReturn] = useState(DEFAULTS.annualReturn);
  const [age, setAge] = useState(DEFAULTS.age);

  // clamp setter: preserve empty -> 0 (so UI shows error), clamp only to max when typing
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

  // basic validation messages
  const errors = {
    monthlyInvestment: {
      error: Number(monthlyInvestment) < LIMITS.monthlyInvestment.min,
      msg: `Minimum value allowed is ${LIMITS.monthlyInvestment.min}`,
    },
    annualReturn: {
      error: Number(annualReturn) < LIMITS.annualReturn.min,
      msg: `Minimum value allowed is ${LIMITS.annualReturn.min}%`,
    },
    age: {
      error: Number(age) < LIMITS.age.min || Number(age) > LIMITS.age.max,
      msg: `Minimum value allowed is ${LIMITS.age.min}`,
    },
  };

  // compute tenure (years) and months until retirement
  const tenureYears = useMemo(() => {
    const a = Number(age) || 0;
    const yrs = Math.max(0, retirementAge - a);
    return yrs;
  }, [age, retirementAge]);

  const totalMonths = useMemo(() => Math.max(0, Math.round(tenureYears * 12)), [tenureYears]);

  // core calculation: monthly annuity (annuity-due), keep paise while computing
  const results = useMemo(() => {
    const P = Number(monthlyInvestment) || 0;
    const r = Number(annualReturn) || 0;
    const n = totalMonths;

    if (P <= 0 || n <= 0 || r <= 0) {
      const invested = Math.round(P * n);
      return {
        totalInvestment: invested,
        interestEarned: 0,
        maturityAmount: invested,
        minAnnuityInvestment: Math.round(invested * 0.4),
        tenureYears,
        totalMonths: n,
      };
    }

    const monthlyRate = (r / 100) / 12; // i
    // compute using paise precision
    const pow = Math.pow(1 + monthlyRate, n);
    const factor = (pow - 1) / monthlyRate;
    const fv = P * factor * (1 + monthlyRate); // annuity-due

    const invested = P * n;
    const interest = fv - invested;

    const round = (v) => Math.round(v || 0);

    const maturityAmount = round(fv);
    const totalInvestment = round(invested);
    const interestEarned = round(interest);
    const minAnnuityInvestment = round(maturityAmount * 0.4);

    return {
      totalInvestment,
      interestEarned,
      maturityAmount,
      minAnnuityInvestment,
      tenureYears,
      totalMonths: n,
    };
  }, [monthlyInvestment, annualReturn, totalMonths, tenureYears]);

  return {
    LIMITS,
    monthlyInvestment,
    setMonthlyInvestment,
    annualReturn,
    setAnnualReturn,
    age,
    setAge,
    clampAndSet,
    errors,
    results,
    tenureYears,
    retirementAge,
  };
}
