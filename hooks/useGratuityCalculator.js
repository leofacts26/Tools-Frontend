// /hooks/useGratuityCalculator.js
"use client";
import { useMemo, useState } from "react";

/**
 * useGratuityCalculator
 *
 * Uses Groww-style gratuity formula:
 *   G = n * b * 15/26
 * where:
 *   n = years of service rounded to nearest integer
 *   b = last drawn basic salary + DA (monthly)
 *
 * The result is capped at 10,00,000 (₹10 Lakh).
 *
 * UI behavior:
 *  - empty inputs become 0 (show error)
 *  - clamp only to max while typing
 */
export default function useGratuityCalculator({ initial = {} } = {}) {
  const DEFAULTS = {
    monthlySalary: typeof initial.monthlySalary !== "undefined" ? initial.monthlySalary : 60000,
    yearsOfService: typeof initial.yearsOfService !== "undefined" ? initial.yearsOfService : 20,
  };

  const LIMITS = {
    monthlySalary: { min: 10000, max: 100000000 },
    yearsOfService: { min: 5, max: 50 },
    gratuityCap: 1000000, // ₹10,00,000 cap
  };

  const [monthlySalary, setMonthlySalary] = useState(DEFAULTS.monthlySalary);
  const [yearsOfService, setYearsOfService] = useState(DEFAULTS.yearsOfService);

  // clampAndSet: preserve empty -> 0 so UI can show error state; clamp only to max while typing
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

  // validation errors/messages
  const errors = {
    monthlySalary: {
      error: Number(monthlySalary) < LIMITS.monthlySalary.min,
      msg: `Minimum value allowed is ${LIMITS.monthlySalary.min}`,
    },
    yearsOfService: {
      error: Number(yearsOfService) < LIMITS.yearsOfService.min,
      msg: `Minimum value allowed is ${LIMITS.yearsOfService.min}`,
    },
  };

  // results using Groww formula with rounding & cap
  const results = useMemo(() => {
    const P = Number(monthlySalary) || 0;
    const rawYears = Number(yearsOfService) || 0;

    if (P <= 0 || rawYears <= 0) {
      return {
        monthlySalary: Math.round(P),
        yearsOfService: rawYears,
        roundedYears: Math.round(rawYears),
        gratuityRaw: 0,
        gratuityCapped: 0,
        capped: false,
      };
    }

    // Round years to nearest integer (Groww rounds 17.5 -> 18 etc)
    const roundedYears = Math.round(rawYears);

    // Groww formula: G = n * b * 15/26
    const rawGratuity = roundedYears * P * (15 / 26);

    // Cap at ₹10,00,000
    const cap = LIMITS.gratuityCap;
    const gratuityCapped = Math.round(Math.min(rawGratuity, cap));
    const roundedRaw = Math.round(rawGratuity);

    return {
      monthlySalary: Math.round(P),
      yearsOfService: rawYears,
      roundedYears,
      gratuityRaw: roundedRaw,
      gratuityCapped,
      capped: roundedRaw > cap,
      cap,
      formula: `G = ${roundedYears} × ${Math.round(P)} × 15/26 = ${roundedRaw}`,
    };
  }, [monthlySalary, yearsOfService]);

  return {
    LIMITS,
    monthlySalary,
    setMonthlySalary,
    yearsOfService,
    setYearsOfService,
    clampAndSet,
    errors,
    results,
  };
}
