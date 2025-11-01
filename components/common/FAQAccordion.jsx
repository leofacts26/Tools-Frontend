// components/FAQAccordion.jsx
"use client";
import React, { useState, useMemo } from "react";
import {
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  TextField,
  Stack,
  Button,
  InputAdornment,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import UnfoldLessIcon from "@mui/icons-material/UnfoldLess";

const Root = styled(Box)(({ theme }) => ({
  width: "100%",
  maxWidth: 920,
  margin: "0 auto",
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 1.2,
  background: theme.palette.mode === "light" ? "#fff" : theme.palette.background.paper,
  boxShadow: "0 8px 30px rgba(2,6,23,0.06)",
}));

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(1.5),
  "&:before": { display: "none" }, // remove divider line
  boxShadow: "none",
  border: `1px solid ${theme.palette.divider}`,
}));

const SummaryTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: 15,
}));

const AnswerTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  lineHeight: 1.6,
}));

const ControlsRow = styled(Stack)(({ theme }) => ({
  gap: theme.spacing(1.5),
  marginBottom: theme.spacing(2),
  alignItems: "center",
  justifyContent: "space-between",
  flexDirection: "row",
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    alignItems: "stretch",
    gap: theme.spacing(1),
  },
}));

export default function FAQAccordion({ faqs = [], title = "FAQs on SIP Calculator & Investments" }) {
  console.log(faqs, "faqs");
  
  // make sure faqs is an array to avoid undefined errors
  const safeFaqs = Array.isArray(faqs) ? faqs : [];

  const [query, setQuery] = useState("");
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [allExpanded, setAllExpanded] = useState(false);

  const filtered = useMemo(() => {
    const q = (query || "").trim().toLowerCase();
    if (!q) return safeFaqs;
    return safeFaqs.filter((f) => {
      // guard against undefined q/a
      const qText = (f?.q ?? "").toString().toLowerCase();
      const aText = (f?.a ?? "").toString().toLowerCase();
      return qText.includes(q) || aText.includes(q);
    });
  }, [safeFaqs, query]);

  // Toggle one item
  const handleChange = (idx) => (event, isExpanded) => {
    setExpandedIndex(isExpanded ? idx : null);
  };

  // Expand / collapse all
  const toggleAll = () => {
    setAllExpanded((prev) => !prev);
    setExpandedIndex(null); // local expandedIndex used for single-item tracking
  };

  return (
    <Root sx={{mb: 4}}>
      <Stack spacing={2}>
        <Typography variant="h6" sx={{ fontWeight: 800 }} className="finance-heading">
          {title}
        </Typography>

        <ControlsRow direction="row">
          <TextField
            size="small"
            placeholder="Search FAQs (e.g. 'SIP start', 'minimum', 'missed installment')"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ opacity: 0.6 }} />
                </InputAdornment>
              ),
            }}
            sx={{ flex: 1 }}
          />

          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={allExpanded ? <UnfoldLessIcon /> : <UnfoldMoreIcon />}
              onClick={toggleAll}
              size="small"
            >
              {allExpanded ? "Collapse all" : "Expand all"}
            </Button>
          </Stack>
        </ControlsRow>

        <Box>
          {filtered.length === 0 ? (
            <Typography color="text.secondary">
              {safeFaqs.length === 0 ? "No FAQs available." : "No matching FAQs found."}
            </Typography>
          ) : (
            filtered.map((item, idx) => {
              const isExpanded = allExpanded || expandedIndex === idx;
              return (
                <StyledAccordion
                  key={idx}
                  expanded={Boolean(isExpanded)}
                  onChange={handleChange(idx)}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`faq-panel-${idx}-content`}
                    id={`faq-panel-${idx}-header`}
                    sx={{ px: 2, py: 1.25 }}
                  >
                    <SummaryTypography>{item?.q ?? "Untitled question"}</SummaryTypography>
                  </AccordionSummary>

                  <AccordionDetails sx={{ px: 2, py: 1.5 }}>
                    <AnswerTypography>{item?.a ?? "No answer provided."}</AnswerTypography>
                  </AccordionDetails>
                </StyledAccordion>
              );
            })
          )}
        </Box>
      </Stack>
    </Root>
  );
}
