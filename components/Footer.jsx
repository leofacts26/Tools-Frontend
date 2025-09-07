"use client";
import React from "react";
import { Box, Container, Grid, Typography, Button, Stack, Divider } from "@mui/material";
import { styled } from "@mui/material/styles";
import FacebookIcon from "@mui/icons-material/Facebook";
import YouTubeIcon from "@mui/icons-material/YouTube";
import TwitterIcon from "@mui/icons-material/Twitter";
import RedditIcon from "@mui/icons-material/Reddit";
import InstagramIcon from '@mui/icons-material/Instagram';

const FooterWrapper = styled(Box)(({ theme }) => ({
  background: "linear-gradient(90deg, #4a0e07, #014744, #350600)",
  color: "#fff",
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(3),
  marginTop: theme.spacing(8),
}));

const FooterHeading = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  marginBottom: theme.spacing(2),
  fontSize: "1.2rem",
}));

const SocialIcon = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 40,
  height: 40,
  borderRadius: "50%",
  border: "1px solid rgba(255,255,255,0.3)",
  cursor: "pointer",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: "rgba(255,255,255,0.2)",
    transform: "scale(1.1)",
  },
}));


export default function Footer() {
  return (
    <FooterWrapper component="footer">
      <Container maxWidth="lg">
        {/* Join Community Section */}
        <Box textAlign="center" mb={4}>
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ mb: 3, fontSize: { xs: "1.8rem", md: "2.5rem" } }}
          >
            Join Our Awesome Community
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              variant="contained"
              startIcon={<InstagramIcon />}
              sx={{
                bgcolor: "white",
                color: "black",
                borderRadius: "30px",
                px: 3,
                "&:hover": { bgcolor: "#e0e0e0" },
              }}
            >
              Instagram
            </Button>
            <Button
              variant="contained"
              startIcon={<FacebookIcon />}
              sx={{
                bgcolor: "#3b82f6",
                color: "white",
                borderRadius: "30px",
                px: 3,
                "&:hover": { bgcolor: "#2563eb" },
              }}
            >
              Facebook
            </Button>
          </Stack>
        </Box>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.1)", mb: 4 }} />

        <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <Grid
            container
            spacing={4}
            justifyContent="center"
            alignItems="flex-start"
            sx={{ maxWidth: "1200px", width: "100%" }}
          >
            {/* Column 1 */}
            <Grid item xs={12} md={3}>
              <Typography variant="h6" fontWeight="bold">
                Cosmic <span style={{ color: "#6366f1" }}>Calc</span>
              </Typography>
              <Stack direction="row" spacing={2} mt={2}>
                <SocialIcon><FacebookIcon /></SocialIcon>
                <SocialIcon><YouTubeIcon /></SocialIcon>
                <SocialIcon><TwitterIcon /></SocialIcon>
                <SocialIcon><RedditIcon /></SocialIcon>
              </Stack>
            </Grid>

            {/* Column 2 */}
            <Grid item xs={12} md={3}>
              <FooterHeading>Products</FooterHeading>
              <Stack spacing={1}>
                <Typography variant="body2">UI Components</Typography>
                <Typography variant="body2">E-commerce</Typography>
                <Typography variant="body2">Dashboard Kit (Upcoming)</Typography>
                <Typography variant="body2">Vue Components (Upcoming)</Typography>
              </Stack>
            </Grid>

            {/* Column 3 */}
            <Grid item xs={12} md={3}>
              <FooterHeading>General</FooterHeading>
              <Stack spacing={1}>
                <Typography variant="body2">Build Template</Typography>
                <Typography variant="body2">Codebase Generator</Typography>
                <Typography variant="body2">Blog</Typography>
                <Typography variant="body2">Templates</Typography>
              </Stack>
            </Grid>

            {/* Column 4 */}
            <Grid item xs={12} md={3}>
              <FooterHeading>Resources</FooterHeading>
              <Stack spacing={1}>
                <Typography variant="body2">Terms & Condition</Typography>
                <Typography variant="body2">Privacy Policy</Typography>
                <Typography variant="body2">License</Typography>
              </Stack>
            </Grid>
          </Grid>
        </Box>


        {/* Bottom Footer */}
        <Box textAlign="center" mt={5}>
          <Typography variant="body2" sx={{ opacity: 0.6 }}>
            Copyright © {new Date().getFullYear()} Cosmicalc. All rights reserved
          </Typography>
        </Box>
      </Container>
    </FooterWrapper>
  );
}
