"use client";
import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";

export const ThemeContext = React.createContext({
  mode: "light",
  toggleTheme: () => {}
});

export function ThemeContextProvider({ initialTheme = "light", children }) {
  const [mode, setMode] = React.useState(initialTheme);

  // keep <html> class in sync
  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", mode === "dark");
    document.documentElement.classList.toggle("light", mode !== "dark");
  }, [mode]);

  // optional: follow system when user hasn't chosen (comment out if you don't want auto follow)
  React.useEffect(() => {
    const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!mq) return;
    const handler = (e) => {
      // follow system only if current equals server default (user hasn't toggled yet)
      // remove this guard if you always want to auto-follow
      // if (mode === initialTheme) setMode(e.matches ? "dark" : "light");
    };
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, [mode, initialTheme]);

  const toggleTheme = React.useCallback(() => {
    setMode(prev => {
      const next = prev === "dark" ? "light" : "dark";
      document.cookie = `theme=${next}; Path=/; Max-Age=${60 * 60 * 24 * 365}`;
      // update html class immediately
      document.documentElement.classList.toggle("dark", next === "dark");
      document.documentElement.classList.toggle("light", next !== "dark");
      return next;
    });
  }, []);

  const theme = React.useMemo(() => createTheme({
    palette: {
      mode,
      primary: { main: "#2CA6A4" },
      background: {
        default: mode === "dark" ? "#000" : "#fff",
        paper: mode === "dark" ? "#161616" : "#fff"
      },
      text: { primary: mode === "dark" ? "#fff" : "#000" }
    },
    typography: {
      fontFamily: "Inter, Roboto, Poppins, Arial, sans-serif"
    }
  }), [mode]);

  const value = React.useMemo(() => ({ mode, toggleTheme }), [mode, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
}
