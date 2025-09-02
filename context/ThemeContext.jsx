
import React, { createContext, useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const getSystemTheme = () => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
};

export const ThemeContext = createContext({
  mode: 'light',
  setMode: () => {},
});

export const ThemeContextProvider = ({ children }) => {
  const [mode, setMode] = useState(getSystemTheme());

  useEffect(() => {
    const listener = (e) => setMode(e.matches ? 'dark' : 'light');
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', listener);
    return () => window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', listener);
  }, []);

  const theme = createTheme({
    palette: {
      mode,
      primary: { main: '#1976d2' },
      secondary: { main: '#009688' },
      background: {
        default: mode === 'dark' ? '#121212' : '#fff',
        paper: mode === 'dark' ? '#1e1e1e' : '#fff',
      },
      text: {
        primary: mode === 'dark' ? '#e0e0e0' : '#212121',
      },
    },
    typography: {
      fontFamily: 'Roboto, Poppins, Inter, Arial, sans-serif',
      h1: { fontSize: 36, fontWeight: 700 },
      h2: { fontSize: 28, fontWeight: 600 },
      h3: { fontSize: 22 },
      body1: { fontSize: 16 },
      body2: { fontSize: 14 },
    },
  });

  return (
    <ThemeContext.Provider value={{ mode, setMode }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};