import React from "react";
import { Container, Typography, Grid, Paper } from "@mui/material";
import ContactForm from "../../../components/ContactForm";
import SocialLinks from "../../../components/SocialLinks";

export default function ContactPage() {
  return (
    <Container maxWidth="lg" sx={{ mt: 8, mb: 8 }}>
      <Typography variant="h3" align="center" gutterBottom>
        Get in Touch with <span style={{ color: "#ec407a" }}>GanakaHub</span>
      </Typography>
      <Typography variant="h6" align="center" color="textSecondary" gutterBottom>
        We’re here to help. Contact us for feedback, questions, or suggestions.
      </Typography>

      <Grid container spacing={4} sx={{ mt: 4 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <ContactForm />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 4, borderRadius: 2 }}>
            <Typography variant="h6" fontWeight="bold">
              Ganaka <span style={{ color: "#ec407a" }}>Hub</span>
            </Typography>
            <Typography sx={{ mt: 2 }}>
              Email: <a href="mailto:ganakahub@gmail.com">ganakahub@gmail.com</a>
              <br />
              Website: <a href="https://www.ganakahub.com" target="_blank" rel="noopener noreferrer">https://www.ganakahub.com</a>
            </Typography>
            <Typography variant="subtitle1" sx={{ mt: 3 }}>
              Follow us on social media:
            </Typography>
            <SocialLinks />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
