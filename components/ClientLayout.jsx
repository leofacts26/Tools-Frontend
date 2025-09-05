"use client";

import { ThemeContextProvider } from "@/context/ThemeContext";
import { LanguageContextProvider } from "@/context/LanguageContext";
import { AppProvider } from "@/context/context";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Submenu from "@/components/Submenu";
import Footer from "@/components/Footer";

export default function ClientLayout({ children, initialTheme }) {
  return (
    <ThemeContextProvider initialTheme={initialTheme}>
      <LanguageContextProvider>
        <AppProvider>
          <div>
            <Navbar />
            <Sidebar />
            <Submenu />
            <main style={{ flex: 1 }}>{children}</main>
            <Footer />
          </div>
        </AppProvider>
      </LanguageContextProvider>
    </ThemeContextProvider>
  );
}
