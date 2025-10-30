import { Box, Button, Container, Grid, Stack } from '@mui/material';
import { useTranslations } from 'next-intl';
import Image from "next/image";


export default function Page() {
  const t = useTranslations();

  return (
    <>
      <section className="hero-section">
        <Container maxWidth="lg">
          <Box sx={{ flexGrow: 1, mt: 5, mb: 5 }} >
            <Grid container spacing={4}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Image
                  src="/ganaka-hero.png"
                  alt=""
                  width={800}        // set any width
                  height={500}       // set any height (maintains aspect ratio)
                  style={{
                    height: '500px',
                    width: '100%',
                    objectFit: 'contain',
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }} sx={{ height: "100%" }}>
                <h1 className='hero-title'>Keep your web tools fast & smart with GanakaHub Utilities</h1>
                <p>Create, beautify, and optimize with 200+ free tools — from JSON formatter to SEO analyzers. Stay productive and automate your daily workflow in one click.</p>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 3 }}>
                  <Button
                    sx={{
                      background: "linear-gradient(90deg, #6366F1, #8B5CF6)",
                      color: "white",
                      fontWeight: 600,
                      px: 3,
                      py: 1.2,
                      borderRadius: "12px",
                      textTransform: "none",
                      boxShadow: "0 4px 10px rgba(99,102,241,0.4)",
                      "&:hover": {
                        background: "linear-gradient(90deg, #4F46E5, #7C3AED)",
                        boxShadow: "0 6px 14px rgba(99,102,241,0.5)"
                      }
                    }}
                  >
                    Try Tools for Free
                  </Button>

                  <Button
                    sx={{
                      background: "#111827",
                      color: "#F9FAFB",
                      fontWeight: 600,
                      px: 3,
                      py: 1.2,
                      borderRadius: "12px",
                      textTransform: "none",
                      "&:hover": {
                        background: "#1F2937"
                      }
                    }}
                  >
                    Explore Categories
                  </Button>
                </Stack>


              </Grid>
            </Grid>
          </Box>
        </Container>
      </section>
    </>
  )
}