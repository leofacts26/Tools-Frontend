"use client";
import React from "react";
import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import { styled } from "@mui/material/styles";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

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
  display: "flex",
  alignItems: "center",
  gap: 8,
  [theme.breakpoints.down("sm")]: { fontSize: "0.95rem" },
}));

// Code block
const Pre = styled("pre")(({ theme }) => ({
  whiteSpace: "pre-wrap",
  wordWrap: "break-word",
  background: theme.palette.mode === "light" ? "#f9f9f9" : theme.palette.background.default,
  padding: theme.spacing(1.5),
  borderRadius: "8px",
  overflowX: "auto",
  fontSize: "14px",
  lineHeight: 1.6,
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', monospace",
  border: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.down("sm")]: {
    fontSize: "13px",
    padding: theme.spacing(1),
  },
}));

/**
 * Common formula block
 * Props:
 * - title: string (caption above the formula)
 * - formula: string (plain text formula, supports line breaks)
 * - ariaLabel: string (accessibility label for the <pre>)
 * - showCopy: boolean (copy-to-clipboard button)
 * - sx: MUI sx prop to override wrapper styles
 * - children: optional nodes (e.g., “Where:” legend/definitions)
 */
export default function FormulaBlock({
  title = "Formula",
  formula = "",
  ariaLabel = "formula",
  showCopy = true,
  sx,
  children,
}) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formula);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // ignore
    }
  };

  return (
    <Figure style={sx}>
      <FigCaption component="figcaption" variant="subtitle1">
        {title}
        {showCopy && formula ? (
          <Tooltip title={copied ? "Copied!" : "Copy formula"} arrow>
            <IconButton
              aria-label="copy formula"
              size="small"
              onClick={handleCopy}
              sx={{ ml: "auto" }}
            >
              <ContentCopyIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>
        ) : null}
      </FigCaption>

      <Pre aria-label={ariaLabel}>
        <code>{formula}</code>
      </Pre>

      {/* optional: “Where:” lines, notes, etc. */}
      {children ? <Box sx={{ mt: 1 }}>{children}</Box> : null}
    </Figure>
  );
}
