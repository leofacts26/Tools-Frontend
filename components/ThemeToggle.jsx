import React, { useContext } from 'react';
import IconButton from '@mui/material/IconButton';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { ThemeContext } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { mode, setMode } = useContext(ThemeContext);
  const isDark = mode === 'dark';

  const handleToggle = () => {
    setMode(isDark ? 'light' : 'dark');
  };

  return (
    <IconButton color="inherit" onClick={handleToggle} sx={{ mx: 1 }}>
      {isDark ? <LightModeIcon /> : <DarkModeIcon />}
    </IconButton>
  );
}