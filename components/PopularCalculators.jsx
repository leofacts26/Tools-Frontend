import { Paper, Typography, Stack } from "@mui/material";
import Link from "next/link";

const popularCalculators = [
  { title: "SIP Calculator", href: "/tools/finance/sip-calculator" },
  { title: "Lumpsum Calculator", href: "/tools/finance/lumpsum-calculator" },
  { title: "SWP Calculator", href: "/tools/finance/swp-calculator" },
  { title: "Mutual Fund Return Calculator", href: "/tools/finance/mutual-fund-returns-calculator" },
  { title: "Sukanya Samriddhi Yojana Calculator", href: "/tools/finance/sukanya-samriddhi-yojana-calculator" },
  { title: "PPF Calculator", href: "/tools/finance/ppf-calculator" },
  { title: "EPF Calculator", href: "/tools/finance/epf-calculator" },
  { title: "FD Calculator", href: "/tools/finance/fd-calculator" },
  { title: "NPS Calculator", href: "/tools/finance/nps-calculator" },
  { title: "Simple Intrest Calculator", href: "/tools/finance/simple-interest-calculator" },
  { title: "NSC Calculator", href: "/tools/finance/nsc-calculator" },
  { title: "Step Up SIP Calculator", href: "/tools/finance/step-up-sip-calculator" },
  { title: "Gratuity Calculator", href: "/tools/finance/gratuity-calculator" }
];

const PopularCalculators = () => {
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
      <h2 className="finance-sub-heading">Popular Calculators</h2>

      <Stack spacing={1.5} sx={{ mt: 2 }}>
        {popularCalculators.map((item) => (
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
