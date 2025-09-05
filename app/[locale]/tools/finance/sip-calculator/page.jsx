import SipCalculator from "@/components/finance/SipCalculator";
import { Container } from "@mui/material";

export default function Page() {
  return <>
    <Container maxWidth="lg">
      <h1 className="finance-heading">SIP Calculator</h1>

      <SipCalculator />
    </Container>
  </>
}