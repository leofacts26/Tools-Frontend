// /lib/calc.js
// Pure, testable calculation helpers for SIP / Lumpsum and helpers.

export function annualToMonthlyRate(annualPercent) {
  const r = Number(annualPercent) / 100;
  if (!isFinite(r) || r === 0) return 0;
  return Math.pow(1 + r, 1 / 12) - 1;
}

/**
 * SIP future value (monthly investment)
 * amount: monthly investment (number)
 * annualReturn: percent (e.g., 12)
 * years: number of years
 */
export function calculateSIP({ amount = 0, annualReturn = 0, years = 0 } = {}) {
  const monthlyRate = annualToMonthlyRate(annualReturn);
  const months = Math.max(0, Math.round(Number(years) * 12));
  const monthlyAmount = Number(amount) || 0;

  if (monthlyRate === 0) {
    const totalInvested = monthlyAmount * months;
    return {
      maturity: totalInvested,
      totalInvested,
      gain: 0,
      monthlyRate,
      months,
    };
  }

  const factor = (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate;
  const maturity = monthlyAmount * factor * (1 + monthlyRate);
  const totalInvested = monthlyAmount * months;
  const gain = maturity - totalInvested;

  return {
    maturity,
    totalInvested,
    gain,
    monthlyRate,
    months,
  };
}

/**
 * Lumpsum future value
 * amount: lumpsum principal (number)
 * annualReturn: percent (e.g., 12)
 * years: number of years
 */
export function calculateLumpsum({ amount = 0, annualReturn = 0, years = 0 } = {}) {
  const principal = Number(amount) || 0;
  const r = Number(annualReturn) / 100 || 0;
  const yrs = Number(years) || 0;

  const maturity = principal * Math.pow(1 + r, yrs);
  const totalInvested = principal;
  const gain = maturity - totalInvested;

  return {
    maturity,
    totalInvested,
    gain,
    monthlyRate: null,
    months: yrs * 12,
  };
}
