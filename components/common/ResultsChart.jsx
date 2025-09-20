// /components/common/ResultsChart.jsx
"use client";
import React from "react";
import PropTypes from "prop-types";
import { Box, Typography } from "@mui/material";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  Legend,
} from "recharts";
import CustomTooltip from "./CustomTooltip";

/**
 * ResultsChart
 *
 * Props:
 *  - data: array of { name, value } for pie
 *  - colors: array of hex color strings (defaults to COLORS from utils if available)
 *  - width: number|string passed to ResponsiveContainer.width (default 320)
 *  - height: number|string passed to ResponsiveContainer.height (default 400)
 *  - innerRadius / outerRadius: numeric radii for Pie
 *  - showLegend: boolean
 *  - currencyFn: (number) => string  - function used by CustomTooltip to format values
 *  - ariaLabel: accessible label for the chart (string)
 *  - emptyMessage: message when data is empty or all values are zero
 */
export default function ResultsChart({
  data = [],
  colors = null,
  width = 320,
  height = 400,
  innerRadius = 70,
  outerRadius = 100,
  showLegend = true,
  currencyFn = (v) => String(v),
  ariaLabel = "Results chart",
  emptyMessage = "No data to display",
}) {
  // fallback colors (light grey + blue-ish). Try to use COLORS from utils if available.
  let fallbackColors = ["#A3A3A3", "#3B82F6"];
  try {
    // eslint-disable-next-line global-require, import/no-extraneous-dependencies
    // Attempt to load COLORS from your utils if present; if not, fall back.
    // If your project uses an alias path (e.g. "@/lib/utils"), remove the try/catch and import at top.
    // const { COLORS: imported } = require("@/lib/utils");
    // if (Array.isArray(imported) && imported.length) fallbackColors = imported;
  } catch (e) {
    // ignore
  }

  const palette = Array.isArray(colors) && colors.length ? colors : fallbackColors;

  const sum = (data || []).reduce((s, item) => s + (Number(item?.value) || 0), 0);
  const isEmpty = !data || !data.length || sum === 0;

  if (isEmpty) {
    return (
      <Box
        role="img"
        aria-label={ariaLabel}
        sx={{
          width,
          height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 2,
          bgcolor: "transparent",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          {emptyMessage}
        </Typography>
      </Box>
    );
  }

  return (
    <Box role="img" aria-label={ariaLabel} sx={{ width, height }}>
      <ResponsiveContainer width={width} height={height} aspect={1}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            stroke="none"
            labelLine={false}
            label={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={palette[index % palette.length]} />
            ))}
          </Pie>

          <RechartsTooltip content={(props) => <CustomTooltip {...props} currencyFn={currencyFn} />} />
          {showLegend ? <Legend verticalAlign="bottom" height={36} /> : null}
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
}

ResultsChart.propTypes = {
  data: PropTypes.array,
  colors: PropTypes.array,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  innerRadius: PropTypes.number,
  outerRadius: PropTypes.number,
  showLegend: PropTypes.bool,
  currencyFn: PropTypes.func,
  ariaLabel: PropTypes.string,
  emptyMessage: PropTypes.string,
};
