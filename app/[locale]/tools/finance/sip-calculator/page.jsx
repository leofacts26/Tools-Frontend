import SipCalculator from "@/components/finance/SipCalculator";
import { Box, Container, Grid } from "@mui/material";

export default function Page() {
  return <>
    <Container maxWidth="lg">
      <h1 className="finance-heading">SIP Calculator</h1>

      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 9 }}>
            <SipCalculator />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
           <h2>sdjfhlkjh</h2>
          </Grid>
        </Grid>
      </Box>


    </Container>
  </>
}