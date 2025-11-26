"use client";

import React, { useEffect, useState } from "react";
import { Paper, Typography, Stack } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { loadPopularCalculators } from "../lib/popular-calculators";

const PopularCalculators = () => {
  const pathname = usePathname();
  const [data, setData] = useState({ title: "Popular Calculators", items: [] });

  // derive locale from path: expect routes like /<locale>/... else default to 'en'
  const localeFromPath = (() => {
    try {
      if (!pathname) return "en";
      const parts = pathname.split("/").filter(Boolean);
      return parts.length ? parts[0] : "en";
    } catch (e) {
      return "en";
    }
  })();

  useEffect(() => {
    let mounted = true;
    loadPopularCalculators(localeFromPath).then((obj) => {
      if (mounted) setData(obj || { title: "Popular Calculators", items: [] });
    });
    return () => {
      mounted = false;
    };
  }, [localeFromPath]);

  return (
    <Paper
      elevation={0}
      sx={{
        border: "none",
        borderRadius: 2,
        p: { xs: 2, md: 4 },
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        position: "sticky",
        top: "80px",
      }}
    >
      <h2 className="finance-sub-heading">{data.title || "Popular Calculators"}</h2>

      <Stack spacing={1.5} sx={{ mt: 2 }}>
        {data.items.map((item) => (
          <Link key={item.title} href={item.href} style={{ textDecoration: "none" }}>
            <Typography
              variant="body1"
              sx={{
                color: "primary.main",
                fontWeight: 500,
                cursor: "pointer",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              {item.title}
            </Typography>
          </Link>
        ))}
      </Stack>
    </Paper>
  );
};

export default PopularCalculators;
