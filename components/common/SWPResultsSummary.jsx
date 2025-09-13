import React from "react";
import { Box, Stack, Typography } from "@mui/material";

const SWPResultsSummary = ({
  investedAmount,
  estimatedReturns,
  totalValue,
  currency,
  fh,
  sh,
  th
}) => {
  return (
    <>
      <Box sx={{ mt: 4, p: 2, borderRadius: 2, bgcolor: "var(--summary-bg)" }}>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Summary
        </Typography>

        <Box sx={{ mt: 2 }}>
          <Box sx={{ mb: 1 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
              <Typography variant="body2" color="text.secondary">
                {fh ? fh : ""}
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600, fontSize: "15px" }}>
                {currency ? currency(investedAmount) : investedAmount}
              </Typography>
            </Stack>
          </Box>


          <Box sx={{ mb: 1 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
              <Typography variant="body2" color="text.secondary">
                {sh ? sh : ""}
              </Typography>
              <Typography
                variant="h6"
                color="primary"
                sx={{ fontWeight: 600, fontSize: "15px" }}
              >
                {currency ? currency(estimatedReturns) : estimatedReturns}
              </Typography>
            </Stack>
          </Box>


          <Box sx={{ mb: 1 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
              <Typography variant="body2" color="text.secondary">
                {th ? th : ""}
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600, fontSize: "15px" }}>
                {currency ? currency(totalValue) : totalValue}
              </Typography>
            </Stack>
          </Box>
        </Box>
      </Box>
    </>
  )
}
export default SWPResultsSummary