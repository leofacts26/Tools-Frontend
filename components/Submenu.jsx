"use client";
import React, { useState, useRef, useEffect } from "react";
import { useGlobalContext } from "@/context/context";
import { usePathname } from "next/navigation";

const Submenu = () => {
  const { isSubmenuOpen, page, location, closeSubmenu } = useGlobalContext();
  const pathname = usePathname();

  const current = page ?? { page: "", links: [] };
  const title = current.page ?? "";
  const links = Array.isArray(current.links) ? current.links : [];

  const container = useRef(null);
  const [columns, setColumns] = useState("col-2");

  // Position & columns
  useEffect(() => {
    if (!container.current || !location) return;

    setColumns("col-2");
    const submenu = container.current;
    const { center, bottom } = location;
    submenu.style.left = `${center}px`;
    submenu.style.top = `${bottom}px`;

    if (links.length === 3) setColumns("col-3");
    if (links.length > 3) setColumns("col-4");
  }, [location, links]);

  // Close on outside click (kept)
  useEffect(() => {
    if (!isSubmenuOpen) return;

    const handleClickOutside = (e) => {
      const el = container.current;
      const onTrigger = e.target?.closest?.(".link-btn");
      if (el && !el.contains(e.target) && !onTrigger) closeSubmenu();
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isSubmenuOpen, closeSubmenu]);

  // ✅ Close on "outside hover" (pointer leaving both submenu and triggers)
  useEffect(() => {
    if (!isSubmenuOpen) return;

    const onMove = (e) => {
      const el = container.current;
      if (!el) return;

      const insideSubmenu = el.contains(e.target);
      const overTrigger = !!e.target?.closest?.(".link-btn");

      if (!insideSubmenu && !overTrigger) {
        closeSubmenu();
      }
    };

    // pointermove is smoother and works for mouse/touch/pen
    document.addEventListener("pointermove", onMove, { passive: true });
    return () => document.removeEventListener("pointermove", onMove);
  }, [isSubmenuOpen, closeSubmenu]);

  // Close on Esc (kept)
  useEffect(() => {
    if (!isSubmenuOpen) return;
    const onKey = (e) => e.key === "Escape" && closeSubmenu();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isSubmenuOpen, closeSubmenu]);

  // Close on route change (kept)
  useEffect(() => {
    if (isSubmenuOpen) closeSubmenu();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <aside
      className={`${isSubmenuOpen ? "submenu show" : "submenu"}`}
      ref={container}
      role="menu"
      aria-hidden={!isSubmenuOpen}
      // Optional: also close when mouse leaves the submenu box itself
      onMouseLeave={() => closeSubmenu()}
    >
      <section>
        <h4>{title}</h4>
        <div className={`submenu-center ${columns}`}>
          {links.map((link, i) => {
            const { url, icon, label } = link;
            return (
              <a key={i} href={url} role="menuitem" tabIndex={isSubmenuOpen ? 0 : -1}>
                {icon}
                {label}
              </a>
            );
          })}
        </div>
      </section>
    </aside>
  );
};

export default Submenu;
