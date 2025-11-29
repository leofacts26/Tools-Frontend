"use client";
import React from "react";
import { Box, Container, Grid, Typography, Button, Stack, Divider } from "@mui/material";
import { styled } from "@mui/material/styles";
import YouTubeIcon from "@mui/icons-material/YouTube";
import XIcon from '@mui/icons-material/X';
import RedditIcon from "@mui/icons-material/Reddit";
import InstagramIcon from '@mui/icons-material/Instagram';
import PinterestIcon from '@mui/icons-material/Pinterest';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import Link from "next/link";

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
  color: "#ec407a",
}));

const SocialIcon = styled("a")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 40,
  height: 40,
  borderRadius: "50%",
  border: "1px solid rgba(255,255,255,0.3)",
  cursor: "pointer",
  transition: "all 0.3s ease",
  textDecoration: "none",
  color: "inherit",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 1)",
    transform: "scale(1.1)",
  },
}));


const FooterLink = styled(Typography)(({ theme }) => ({
  color: "#fff",
  cursor: "pointer",
  textDecoration: "none",
  transition: "color 0.2s ease",

  "&:hover": {
    color: "#ec407a",
  },
}));

export default function Footer() {
  return (
    <FooterWrapper component="footer" className="footer">
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
            <a href="https://www.instagram.com/ganakahub/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
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
            </a>
            <a href="https://in.pinterest.com/ganakahub/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
              <Button
                variant="contained"
                startIcon={<PinterestIcon />}
                sx={{
                  bgcolor: "#eb334fe1",
                  color: "white",
                  borderRadius: "30px",
                  px: 3,
                  "&:hover": { bgcolor: "#e60023cc" },
                }}
              >
                Pinterest
              </Button>
            </a>
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
            <Grid size={{ xs: 12, sm: 12, md: 3, lg: 3 }}>
              <Typography variant="h6" fontWeight="bold">
                Ganaka <span style={{ color: "#ec407a" }}>Hub</span>
              </Typography>
              <Stack direction="row" spacing={2} mt={2}>
                <SocialIcon
                  href="https://www.linkedin.com/in/ganakahub/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <LinkedInIcon />
                </SocialIcon>
                <SocialIcon
                  href="https://www.youtube.com/@ganakahub"
                  target="_blank"
                  rel="noopener noreferrer"><YouTubeIcon /></SocialIcon>
                <SocialIcon
                  href="https://x.com/ganakahub"
                  target="_blank"
                  rel="noopener noreferrer"
                ><XIcon /></SocialIcon>
                <SocialIcon
                  href="https://www.reddit.com/user/ganakahub/"
                  target="_blank"
                  rel="noopener noreferrer"
                ><RedditIcon /></SocialIcon>
              </Stack>
            </Grid>

            {/* Column 2 */}
            <Grid size={{ xs: 6, sm: 6, md: 3, lg: 3 }}>
              <FooterHeading>Finance</FooterHeading>
              <Stack spacing={1}>
                <Link href="/tools/finance/sip-calculator" passHref>
                  <FooterLink variant="body2" component="a">
                    SIP Calculator
                  </FooterLink>
                </Link>

                <Link href="/tools/finance/lumpsum-calculator" passHref>
                  <FooterLink variant="body2" component="a">
                    Lumpsum Calculator
                  </FooterLink>
                </Link>

                <Link href="/tools/finance/nps-calculator" passHref>
                  <FooterLink variant="body2" component="a">
                    NPS Calculator
                  </FooterLink>
                </Link>

                <Link href="/tools/finance/gratuity-calculator" passHref>
                  <FooterLink variant="body2" component="a">
                    Gratuity Calculator
                  </FooterLink>
                </Link>

                <Link href="/tools/finance/epf-calculator" passHref>
                  <FooterLink variant="body2" component="a">
                    EPF Calculator
                  </FooterLink>
                </Link>
              </Stack>
            </Grid>

            {/* Column 3 */}
            <Grid size={{ xs: 6, sm: 6, md: 3, lg: 3 }}>
              <FooterHeading>Students</FooterHeading>
              <Stack spacing={1}>
                <Link href="javascript:void(0)" passHref>
                  <FooterLink variant="body2" component="a">
                    GPA Calculator
                  </FooterLink>
                </Link>

                <Link href="javascript:void(0)" passHref>
                  <FooterLink variant="body2" component="a">
                    Grade Converter
                  </FooterLink>
                </Link>

                <Link href="javascript:void(0)" passHref>
                  <FooterLink variant="body2" component="a">
                    Attendance Calculator
                  </FooterLink>
                </Link>

                <Link href="javascript:void(0)" passHref>
                  <FooterLink variant="body2" component="a">
                    Study Timer
                  </FooterLink>
                </Link>

                <Link href="javascript:void(0)" passHref>
                  <FooterLink variant="body2" component="a">
                    Flashcard Maker
                  </FooterLink>
                </Link>
              </Stack>
            </Grid>

            {/* Column 4 */}
            <Grid size={{ xs: 6, sm: 6, md: 3, lg: 3 }}>
              <FooterHeading>Resources</FooterHeading>
              <Stack spacing={1}>
                <Link href="/terms-and-conditions" passHref>
                  <FooterLink variant="body2" component="a">Terms & Condition</FooterLink>
                </Link>

                <Link href="/privacy-policy" passHref>
                  <FooterLink variant="body2" component="a">Privacy Policy</FooterLink>
                </Link>

                <Link href="/disclaimer" passHref>
                  <FooterLink variant="body2" component="a">Disclaimer</FooterLink>
                </Link>

                <Link href="/about-us" passHref>
                  <FooterLink variant="body2" component="a">About Us</FooterLink>
                </Link>

                <Link href="#" passHref>
                  <FooterLink variant="body2" component="a">Contact Us</FooterLink>
                </Link>
              </Stack>
            </Grid>
          </Grid>
        </Box>


        {/* Bottom Footer */}
        <Box textAlign="center" mt={5}>
          <Typography variant="body2" sx={{ opacity: 0.6 }}>
            Copyright © {new Date().getFullYear()} GanakaHub. All rights reserved
          </Typography>
        </Box>
      </Container>
    </FooterWrapper>
  );
}
