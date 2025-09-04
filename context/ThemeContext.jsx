"use client";
import React, { createContext, useState, useEffect, useMemo, useCallback } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";

export const ThemeContext = createContext({
  mode: "light",
  setMode: () => {},
  toggleTheme: () => {},
});

/**
 * Props:
 *  - initialTheme: "light" | "dark" (sent from server)
 */
export function ThemeContextProvider({ initialTheme = "light", children }) {
  // ✅ Start with server value to avoid SSR/CSR mismatch
  const [mode, setMode] = useState(initialTheme);

  // Keep <html> class in sync (no flashing/mismatch)
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", mode === "dark");
  }, [mode]);

  // Listen to system changes (optional; only apply if user hasn't toggled)
  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!mq) return;

    const handler = (e) => {
      // Only auto-follow system if current mode equals the server's initialTheme
      // (i.e., user hasn't toggled explicitly)
      if (initialTheme === mode) {
        setMode(e.matches ? "dark" : "light");
      }
    };

    // Safari fallback
    if (mq.addEventListener) mq.addEventListener("change", handler);
    else mq.addListener?.(handler);

    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", handler);
      else mq.removeListener?.(handler);
    };
  }, [mode, initialTheme]);

  // Optional: reflect on body for your styles (safe; runs after mount)
  useEffect(() => {
    document.body.style.backgroundColor = mode === "dark" ? "#000" : "#fff";
    document.body.style.color = mode === "dark" ? "#fff" : "#222";
  }, [mode]);

  const toggleTheme = useCallback(() => {
    setMode((prev) => {
      const next = prev === "light" ? "dark" : "light";
      // Persist choice for next SSR render
      document.cookie = `theme=${next}; Path=/; Max-Age=${60 * 60 * 24 * 365}`;
      // Update <html> immediately
      document.documentElement.classList.toggle("dark", next === "dark");
      return next;
    });
  }, []);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: "#1976d2" },
          background: {
            default: mode === "dark" ? "#000" : "#fff",
            paper: mode === "dark" ? "#222" : "#fff",
          },
          text: {
            primary: mode === "dark" ? "#fff" : "#000",
          },
          action: { active: "#1976d2" },
        },
        typography: {
          fontFamily: "Roboto, Poppins, Inter, Arial, sans-serif",
          h1: { fontSize: 36, fontWeight: 700 },
          h2: { fontSize: 28, fontWeight: 600 },
          h3: { fontSize: 22 },
          body1: { fontSize: 16 },
          body2: { fontSize: 14 },
        },
      }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={{ mode, setMode, toggleTheme }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
}
