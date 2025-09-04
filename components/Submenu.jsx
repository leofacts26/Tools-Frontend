"use client";
import { useGlobalContext } from '@/context/context';
import React, { useState, useRef, useEffect } from 'react';

const Submenu = () => {
  const { isSubmenuOpen, page, location } = useGlobalContext();

  const current = page ?? { page: '', links: [] };
  const title = current.page ?? '';
  const links = Array.isArray(current.links) ? current.links : [];

  const container = useRef(null);
  const [columns, setColumns] = useState('col-2');

  useEffect(() => {
    if (!container.current || !location) return;

    setColumns('col-2');
    const submenu = container.current;
    const { center, bottom } = location;
    submenu.style.left = `${center}px`;
    submenu.style.top = `${bottom}px`;

    if (links.length === 3) setColumns('col-3');
    if (links.length > 3) setColumns('col-4');
  }, [location, links]);

  return (
    <aside className={`${isSubmenuOpen ? 'submenu show' : 'submenu'}`} ref={container}>
      <section>
        <h4>{title}</h4>
        <div className={`submenu-center ${columns}`}>
          {links.map((link, index) => {
            const { url, icon, label } = link;
            return (
              <a key={index} href={url}>
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
