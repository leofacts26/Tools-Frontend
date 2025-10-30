 export const navSections = ["finance", "students", "developer", "others", "blog"];

 export const COLORS = ["#EF8275", "#3AA7A3"];

export const fmtINR = (v) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Math.round(v));