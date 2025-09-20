// /hooks/useCalculator.jsx
"use client";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { calculateSIP, calculateLumpsum, annualToMonthlyRate } from "@/lib/calc";

/**
 * useCalculator - reusable hook that centralizes state + calculation logic
 *
 * options:
 *  - initial: { amount, years, annualReturn }
 *  - mode: 'sip' | 'lumpsum' (default 'sip')
 *  - routeMap: { sip: '/tools/finance/sip-calculator', lumpsum: '/tools/finance/lumpsum-calculator' }
 *  - pathnamePrefix: locale prefix e.g. '/en' or '' (optional)
 *
 * Behavior: when the UI clears an input ("" / null / undefined), this hook will store 0
 * so the UI immediately shows error states like amount < min, annualReturn < min, years < min.
 */
export default function useCalculator({
  initial = {},
  mode = "sip",
  routeMap = {},
  pathnamePrefix = "",
} = {}) {
  const pathname = usePathname();
  const router = useRouter();

  const tabFromPath = (p) => (typeof p === "string" && p.includes("lumpsum") ? 1 : 0);

  const [tab, setTab] = useState(() => {
    try {
      const inferred = tabFromPath(pathname);
      return typeof inferred === "number" ? inferred : mode === "lumpsum" ? 1 : 0;
    } catch {
      return mode === "lumpsum" ? 1 : 0;
    }
  });

  // internal numeric state (always numbers)
  const [amountState, setAmountState] = useState(() => initial.amount ?? (tab === 1 ? 100000 : 25000));
  const [yearsState, setYearsState] = useState(() => initial.years ?? 10);
  const [annualReturnState, setAnnualReturnState] = useState(() => initial.annualReturn ?? 12);

  // Expose "safe" setter wrappers that convert cleared values to 0 and coerce to Number
  const setAmount = (v) => {
    if (v === "" || v === null || typeof v === "undefined") {
      setAmountState(0);
      return;
    }
    const n = Number(v);
    setAmountState(Number.isFinite(n) ? n : 0);
  };

  const setYears = (v) => {
    if (v === "" || v === null || typeof v === "undefined") {
      setYearsState(0);
      return;
    }
    const n = Number(v);
    setYearsState(Number.isFinite(n) ? n : 0);
  };

  const setAnnualReturn = (v) => {
    if (v === "" || v === null || typeof v === "undefined") {
      setAnnualReturnState(0);
      return;
    }
    const n = Number(v);
    setAnnualReturnState(Number.isFinite(n) ? n : 0);
  };

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // keep tab synced to pathname if it changes externally
  useEffect(() => {
    const inferred = tabFromPath(pathname);
    if (typeof inferred === "number" && inferred !== tab) {
      setTab(inferred);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // compute monthly rate from the numeric annual return
  const monthlyRate = useMemo(() => annualToMonthlyRate(annualReturnState), [annualReturnState]);

  // Use the numeric state for calculations
  const results = useMemo(() => {
    if (tab === 1) {
      return calculateLumpsum({ amount: amountState, annualReturn: annualReturnState, years: yearsState });
    }
    return calculateSIP({ amount: amountState, annualReturn: annualReturnState, years: yearsState });
  }, [tab, amountState, annualReturnState, yearsState]);

  const pieData = useMemo(() => {
    return [
      { name: "Invested", value: results.totalInvested },
      { name: "Returns", value: Math.max(0, results.gain) },
    ];
  }, [results]);

  const handleTabChange = (e, v) => {
    setTab(v);
    const target = v === 1 ? routeMap.lumpsum : routeMap.sip;
    if (target) {
      const prefix = pathnamePrefix ?? "";
      router.push(`${prefix}${target}`);
    }
  };

  return {
    mounted,
    tab,
    setTab,
    // expose numeric state and wrapper setters
    amount: amountState,
    setAmount,
    years: yearsState,
    setYears,
    annualReturn: annualReturnState,
    setAnnualReturn,
    monthlyRate,
    results,
    pieData,
    handleTabChange,
  };
}
