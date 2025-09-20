// /hooks/useSWPCalculator.js
"use client";
import { useState, useMemo } from "react";

/**
 * useSWPCalculator
 * - UI state contains raw numeric values (user can type 0 or any number).
 * - Error flags are true when the raw numeric value is below the configured min.
 * - Calculations use safe* values: when raw is empty/0/below-min, the safe value falls back to the min.
 * - Upper bounds (max) are clamped on input.
 */
export default function useSWPCalculator() {
  // defaults (you can change these)
  const [investment, setInvestment] = useState(500000);
  const [withdrawal, setWithdrawal] = useState(10000);
  const [rate, setRate] = useState(8);
  const [years, setYears] = useState(5);

  // limits / mins
  const LIMITS = {
    investment: { min: 10000, max: 10000000 }, // min ₹10k
    withdrawal: { min: 500, max: 1000000 },    // min ₹500
    rate: { min: 1, max: 30 },                 // min 1%
    years: { min: 1, max: 30 },                // min 1 year
  };

  /**
   * clampAndSet
   * - If user clears field (raw === ""), set value to 0 (so input becomes 0)
   * - Allow values below min to remain (so user can type 0, 500 etc.) — error will show
   * - Clamp values above max to max
   */
  const clampAndSet = (raw, { max }, setter) => {
    if (raw === "" || raw === null || typeof raw === "undefined") {
      setter(0); // empty -> set 0 (keeps input numeric)
      return;
    }
    let num = Number(raw);
    if (!isFinite(num)) {
      setter(0);
      return;
    }
    if (num > max) num = max; // clamp only on upper bound
    setter(num);
  };

  // error flags — true when current numeric value is below the configured minimum
  const investmentError = Number(investment) < LIMITS.investment.min;
  const withdrawalError = Number(withdrawal) < LIMITS.withdrawal.min;
  const rateError = Number(rate) < LIMITS.rate.min;
  const yearsError = Number(years) < LIMITS.years.min;

  const errors = {
    investment: { error: investmentError, msg: `Minimum value allowed is ${LIMITS.investment.min.toLocaleString()}` },
    withdrawal: { error: withdrawalError, msg: `Minimum value allowed is ${LIMITS.withdrawal.min}` },
    rate: { error: rateError, msg: `Minimum value allowed is ${LIMITS.rate.min}` },
    years: { error: yearsError, msg: `Minimum value allowed is ${LIMITS.years.min}` },
  };

  // safe values for calculation — per-field fallback to min when input is 0/empty/below-min
  const safeInvestment =
    Number(investment) < LIMITS.investment.min ? LIMITS.investment.min : Math.min(LIMITS.investment.max, Number(investment));

  const safeWithdrawal =
    Number(withdrawal) < LIMITS.withdrawal.min ? LIMITS.withdrawal.min : Math.min(LIMITS.withdrawal.max, Number(withdrawal));

  const safeRate =
    Number(rate) < LIMITS.rate.min ? LIMITS.rate.min : Math.min(LIMITS.rate.max, Number(rate));

  const safeYears =
    Number(years) < LIMITS.years.min ? LIMITS.years.min : Math.min(LIMITS.years.max, Number(years));

  // calculation (monthly compounding then withdrawal)
  const results = useMemo(() => {
    const P = safeInvestment;
    const W = safeWithdrawal;
    const yrs = safeYears;
    const N = Math.max(0, Math.round(yrs * 12));
    const monthlyRate = Math.pow(1 + safeRate / 100, 1 / 12) - 1;

    const roundPaise = (x) => Math.round(x * 100) / 100;
    const roundRupee = (x) => Math.round(x);

    let balance = roundPaise(P);
    let totalWithdrawn = 0;

    for (let m = 1; m <= N; m++) {
      if (monthlyRate !== 0) {
        balance = roundPaise(balance * (1 + monthlyRate));
      }
      const withdrawThisMonth = roundRupee(W);
      balance = roundPaise(balance - withdrawThisMonth);
      totalWithdrawn += withdrawThisMonth;
    }

    return {
      investedAmount: P,
      totalWithdrawal: roundRupee(totalWithdrawn),
      finalValue: roundRupee(balance),
    };
  }, [safeInvestment, safeWithdrawal, safeRate, safeYears]);

  return {
    LIMITS,
    investment,
    withdrawal,
    rate,
    years,
    setInvestment,
    setWithdrawal,
    setRate,
    setYears,
    clampAndSet,
    errors,
    results,
    // helper access if you need it in UI:
    safeValues: { safeInvestment, safeWithdrawal, safeRate, safeYears },
  };
}
