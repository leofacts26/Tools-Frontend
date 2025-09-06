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
  IconButton,
  Stack,
  Button,
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

// Default FAQs - from user's list
const DEFAULT_FAQS = [
  {
    q: "What is the minimum amount required to start a SIP?",
    a:
      "Most mutual funds allow you to begin a SIP with as little as ₹500 per month, making it accessible to all kinds of investors.",
  },
  {
    q: "Is there a fixed duration for SIP investments?",
    a:
      "No, you can choose your own tenure—short-term (3–5 years) or long-term (10–20 years)—based on your financial goals.",
  },
  {
    q: "Can I stop a SIP midway?",
    a:
      "Yes, SIPs are flexible. You can stop your SIP at any time without penalty, though it is recommended to continue for better compounding benefits.",
  },
  {
    q: "Does SIP guarantee fixed returns?",
    a:
      "No. Returns from SIPs depend on the mutual fund’s market performance. A SIP Calculator only provides an estimate, not guaranteed results.",
  },
  {
    q: "Can I increase my SIP contribution later?",
    a:
      "Yes, many mutual funds allow a Step-Up SIP option, where you can automatically increase your SIP amount annually.",
  },
  {
    q: "Are SIPs only for equity mutual funds?",
    a:
      "Not at all. SIPs can be started in equity, debt, hybrid, and even index funds, depending on your risk profile.",
  },
  {
    q: "How does a SIP Calculator help in financial planning?",
    a:
      "It shows you the projected maturity value of your investments, helping you plan for specific goals like retirement, home purchase, or children’s education.",
  },
  {
    q: "What happens if I miss a SIP installment?",
    a:
      "Missing one or two SIP payments doesn’t cancel your investment. The amount just won’t be deducted for that month, and you can resume from the next cycle.",
  },
  {
    q: "Can I have multiple SIPs at the same time?",
    a:
      "Yes, you can start multiple SIPs across different funds to diversify your portfolio and spread risk.",
  },
  {
    q: "Is SIP suitable for short-term investments?",
    a:
      "SIPs work best for long-term wealth creation. For short-term goals, other investment options like liquid funds or fixed deposits may be more suitable.",
  },
];

export default function FAQAccordion({ faqs = DEFAULT_FAQS, title = "FAQs on SIP Calculator & Investments" }) {
  const [query, setQuery] = useState("");
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [allExpanded, setAllExpanded] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return faqs;
    return faqs.filter(
      (f) => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q)
    );
  }, [faqs, query]);

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
    <Root>
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
              startAdornment: <SearchIcon sx={{ opacity: 0.6, mr: 1 }} />,
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
            <Typography color="text.secondary">No matching FAQs found.</Typography>
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
                    <SummaryTypography>{item.q}</SummaryTypography>
                  </AccordionSummary>

                  <AccordionDetails sx={{ px: 2, py: 1.5 }}>
                    <AnswerTypography>{item.a}</AnswerTypography>
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
