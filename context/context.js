"use client"
import sublinks from '@/lib/data';
import React, { useState, useContext } from 'react';
const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
  const [page, setPage] = useState({ page: '', links: [] });
  const [location, setLocation] = useState({});
  const openSidebar = () => {
    setIsSidebarOpen(true);
  };
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };
  // context.js (inside AppProvider)
  const slugify = (s = "") =>
    String(s).trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

  const openSubmenu = (key, loc) => {
    console.log("openSubmenu called with", { key, loc });
    // prefer explicit key property (recommended). fallback to slugified page match.
    const found =
      sublinks.find((s) => s.key === key) ||
      sublinks.find((s) => slugify(s.page) === key);

    console.log("openSubmenu -> found:", found);

    if (!found) {
      setPage({ page: "", links: [] });
      setLocation(loc || { center: 0, bottom: 0 });
      setIsSubmenuOpen(false);
      return;
    }

    setPage(found);
    setLocation(loc || { center: 0, bottom: 0 });
    setIsSubmenuOpen(true);
  };

  const closeSubmenu = () => {
    setIsSubmenuOpen(false);
  };

  return (
    <AppContext.Provider
      value={{
        isSidebarOpen,
        openSidebar,
        closeSidebar,
        isSubmenuOpen,
        openSubmenu,
        closeSubmenu,
        page,
        location,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
// make sure use
export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppContext, AppProvider };
