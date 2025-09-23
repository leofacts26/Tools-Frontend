// /hooks/useEPFCalculator.js
"use client";
import { useMemo, useState } from "react";

/**
 * useEPFCalculator (Groww-like)
 *
 * Conventions:
 *  - hidden employer contribution = same percentage as employee (included in corpus)
 *  - contributions credited at START of each month (annuity-due)
 *  - salary increase applied at START of each new year (months 13, 25, ...)
 *  - monthly contributions rounded to nearest rupee
 *  - EPF balance tracked to paise and monthly interest applied after contribution
 *
 * API:
 *  useEPFCalculator({
 *    initial: { monthlySalary, age, contributionPct, annualIncrease, rate },
 *    retirementAge = 58,
 *    includeEmployer = true,    // default true: employer added behind the scenes
 *    growwMode = true           // default true: employer -> EPF (no EPS split)
 *  })
 *
 * Returns state setters, LIMITS, errors and results:
 * results: { months, yearsToRetire, investedEmployee, investedEmployer, totalInvested, totalInterest, maturityValue }
 */
export default function useEPFCalculator({
  initial = {},
  retirementAge = 58,
  includeEmployer = true,
  growwMode = true,
} = {}) {
  // UI state (defaults)
  const [monthlySalary, setMonthlySalary] = useState(initial.monthlySalary ?? 50000);
  const [age, setAge] = useState(initial.age ?? 30);
  const [contributionPct, setContributionPct] = useState(initial.contributionPct ?? 12);
  const [annualIncrease, setAnnualIncrease] = useState(initial.annualIncrease ?? 5);
  // rate shown read-only
  const baseRate = Number(initial.rate ?? 8.25);

  // Limits & messages
  const LIMITS = {
    monthlySalary: { min: 1000, max: 500000 },
    age: { min: 15, max: 58 },
    contributionPct: { min: 12, max: 20 },
    annualIncrease: { min: 0, max: 15 },
    rate: { min: 0.01, max: 50 },
  };

  // clamp-and-set helper: preserve empty -> set 0 so UI shows error immediately; clamp only to max while typing
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

  // UI error flags/messages
  const monthlySalaryError = Number(monthlySalary) < LIMITS.monthlySalary.min;
  const ageError = Number(age) < LIMITS.age.min || Number(age) > LIMITS.age.max;
  const contributionError = Number(contributionPct) < LIMITS.contributionPct.min || Number(contributionPct) > LIMITS.contributionPct.max;

  const errors = {
    monthlySalary: { error: monthlySalaryError, msg: `Minimum value allowed is ${LIMITS.monthlySalary.min}` },
    age: { error: ageError, msg: `Minimum value allowed is ${LIMITS.age.min}` },
    contributionPct: { error: contributionError, msg: `Minimum value allowed is ${LIMITS.contributionPct.min}%` },
  };

  // safe values for calculations (fallback to minima and clamp maxima)
  const safeMonthlySalary = Number(monthlySalary) < LIMITS.monthlySalary.min
    ? LIMITS.monthlySalary.min
    : Math.min(LIMITS.monthlySalary.max, Number(monthlySalary));

  const safeAge = Number.isFinite(Number(age)) ? Number(age) : LIMITS.age.min;
  const safeEmployeePct = Number(contributionPct) < LIMITS.contributionPct.min
    ? LIMITS.contributionPct.min
    : Math.min(LIMITS.contributionPct.max, Number(contributionPct));

  // hidden employer percent equals employee pct by default
  const safeEmployerPct = safeEmployeePct;

  const safeAnnualIncrease = Number(annualIncrease) < 0 ? 0 : Math.min(LIMITS.annualIncrease.max, Number(annualIncrease));
  const safeBaseRate = Math.max(LIMITS.rate.min, Math.min(LIMITS.rate.max, Number(baseRate)));

  // Core simulator (Groww-like when growwMode=true)
  const results = useMemo(() => {
    const yearsToRetire = Math.max(0, retirementAge - safeAge);
    const months = Math.max(0, Math.round(yearsToRetire * 12));
    const monthlyRate = (safeBaseRate / 100) / 12;

    // rounding helpers
    const roundPaise = (x) => Math.round(x * 100) / 100; // keep paise for balance
    const roundRupee = (x) => Math.round(x); // contributions rounded to rupee

    let balance = 0.0;
    let salary = Number(safeMonthlySalary);
    const monthlyEmployeePct = safeEmployeePct / 100;
    const monthlyEmployerPct = includeEmployer ? safeEmployerPct / 100 : 0;

    let investedEmployee = 0;
    let investedEmployer = 0;

    for (let m = 1; m <= months; m++) {
      // Apply salary increase at START of new year: months 13, 25, ...
      if (m > 1 && (m - 1) % 12 === 0) {
        salary = roundPaise(salary * (1 + safeAnnualIncrease / 100));
      }

      // Contributions at START of month (annuity-due), rounded to nearest rupee
      const empContribution = roundRupee(salary * monthlyEmployeePct);

      // employer contribution (hidden)
      let emplContribution = 0;
      if (includeEmployer) {
        // Groww-like mode: employer full contribution goes to EPF (no EPS split)
        // If you ever want "real" legal split (EPS 8.33%), change this block to split employer accordingly.
        emplContribution = roundRupee(salary * monthlyEmployerPct);
      }

      // Add contributions first
      balance = roundPaise(balance + empContribution + emplContribution);

      // track invested amounts
      investedEmployee += empContribution;
      investedEmployer += emplContribution;

      // Then apply monthly interest
      balance = roundPaise(balance * (1 + monthlyRate));
    }

    const totalInvested = roundRupee(investedEmployee + investedEmployer);
    const maturityValue = roundRupee(balance);
    const totalInterest = roundRupee(maturityValue - totalInvested);

    return {
      months,
      yearsToRetire,
      investedEmployee: roundRupee(investedEmployee),
      investedEmployer: roundRupee(investedEmployer),
      totalInvested,
      totalInterest,
      maturityValue,
    };
  }, [safeMonthlySalary, safeAge, safeEmployeePct, safeEmployerPct, safeAnnualIncrease, safeBaseRate, retirementAge, includeEmployer, growwMode]);

  return {
    LIMITS,
    monthlySalary,
    setMonthlySalary,
    age,
    setAge,
    contributionPct,
    setContributionPct,
    annualIncrease,
    setAnnualIncrease,
    rate: safeBaseRate, // read-only displayed value
    clampAndSet,
    errors,
    results,
  };
}
