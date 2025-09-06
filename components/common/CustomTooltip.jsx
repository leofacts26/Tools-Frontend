// CustomTooltip.jsx (or inline above your component)
import React from "react";
import { Paper, Stack, Typography, Box } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp"; // optional

export default function CustomTooltip({ active, payload, label, currencyFn }) {
  if (!active || !payload || !payload.length) return null;

  // payload is an array of data points (the pie entries)
  // For pie charts payload[0].payload gives the original entry if needed
  return (
    <Paper
      elevation={3}
      sx={{
        p: 1.25,
        borderRadius: 2,
        minWidth: 160,
        boxShadow: "0 10px 30px rgba(2,6,23,0.08)",
      }}
    >
      <Stack spacing={0.5}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="caption" color="text.secondary">
            {label ?? "Details"}
          </Typography>
          <Box display="flex" gap={1} alignItems="center">
            <TrendingUpIcon fontSize="small" sx={{ color: "primary.main" }} />
            <Typography variant="caption" color="text.secondary">
              {new Date().getFullYear()} {/* optional extra meta */}
            </Typography>
          </Box>
        </Stack>

        {payload.map((entry, i) => {
          const { name, value } = entry.payload ?? entry;
          return (
            <Stack key={i} direction="row" justifyContent="space-between" alignItems="center">
              <Stack direction="row" alignItems="center" spacing={1}>
                <Box sx={{ width: 10, height: 10, borderRadius: 1, bgcolor: entry.color || entry.fill || "#000" }} />
                <Typography variant="body2">{name}</Typography>
              </Stack>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, ml: 1 }}>
                {typeof currencyFn === "function" ? currencyFn(value) : value}
              </Typography>
            </Stack>
          );
        })}
      </Stack>
    </Paper>
  );
}
