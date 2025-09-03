
"use client";
import React from 'react';
import { ThemeContextProvider } from '../../context/ThemeContext';
import { LanguageContextProvider } from '../../context/LanguageContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import '../../styles/index.css';
import Sidebar from '@/components/Sidebar';
import Hero from '@/components/Hero';
import { AppProvider } from '@/context/context';
import Submenu from '@/components/Submenu';

export default function RootLayout({ children }) {
  return (
    <ThemeContextProvider>
      <AppProvider>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Navbar />
          <Sidebar />
          <Hero />
          <Submenu />
          <main style={{ flex: 1 }}>{children}</main>
          <Footer />
        </div>
      </AppProvider>
    </ThemeContextProvider>
  );
}