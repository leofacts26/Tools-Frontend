// components/SIPFormulaBlock.jsx
"use client";
import React from "react";
import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

// Wrapper
const Figure = styled("figure")(({ theme }) => ({
  maxWidth: "100%",
  margin: "1rem 0",
}));

// Caption
const FigCaption = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: "0.5rem",
  fontSize: "1rem",
  [theme.breakpoints.down("sm")]: {
    fontSize: "0.9rem",
  },
}));

// Pre block
const Pre = styled("pre")(({ theme }) => ({
  whiteSpace: "pre-wrap",
  wordWrap: "break-word",
  background: theme.palette.mode === "light" ? "#f9f9f9" : theme.palette.background.default,
  padding: theme.spacing(1.5),
  borderRadius: "8px",
  overflowX: "auto",
  fontSize: "14px",
  lineHeight: 1.6,
  fontFamily:
    "ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', monospace",
  [theme.breakpoints.down("sm")]: {
    fontSize: "13px",
    padding: theme.spacing(1),
  },
}));

// Component with props
export default function SIPFormulaBlock({
  title = "Formula used by a basic SIP Calculator",
  formula = `M = P × [ (1 + i)^n – 1 ] / i × (1 + i)
Where:
M = Maturity amount (final value)
P = Fixed investment amount (monthly SIP)
i = Periodic rate (annual return ÷ 12)
n = Total number of installments (months × years)`,
}) {
  return (
    <Figure>
      <FigCaption component="figcaption">{title}</FigCaption>
      <Pre aria-label="SIP formula">
        <code>{formula}</code>
      </Pre>
    </Figure>
  );
}
