import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import { Container, Stack } from '@mui/material';
import Link from 'next/link';


export default function Page() {
  return <>

    <section className='blog-bg'>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Stack direction="column"
          justifyContent="center"
          alignItems="center"
          sx={{ height: '100%', width: '100%', textAlign: 'center', mt: 4 }}>
          <h1 class="mb-3">Finance Blogs</h1>
          <svg width="115" height="18" viewBox="0 0 115 18" xmlns="http://www.w3.org/2000/svg"><path d="M0 4c11.5 0 11.5 10 23 10S34.5 4 46 4s11.5 10 23 10S80.5 4 92 4s11.5 10 23 10" stroke="#ec407a" stroke-width="8" fill="none" fill-rule="evenodd"></path></svg>

          <p style={{ marginTop: "30px" }}>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam pariatur dolores reprehenderit odio culpa officiis iure tenetur explicabo exercitationem cum! Impedit repellendus aperiam mollitia laudantium et tenetur iure nostrum cupiditate.</p>
        </Stack>
      </Container>
    </section>

    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid size={4}>
            <Link href="/finance/zero-to-one-crore-roadmap">
              <Card>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    image="/finance/From-0-to-1-Crore-The-Step-by-Step-Roadmap-No-One-Shows-You.png"
                    alt="green iguana"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div" className='card-heading'>
                      “From ₹0 to ₹1 Crore: The Step-by-Step Roadmap No One Shows You”
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }} className='card-desc'>
                      Let’s be honest — we’ve all seen those “get rich fast” videos that promise you’ll make crores overnight. But real life doesn’t work like that.
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Link>
          </Grid>

          <Grid size={4}>
            <Link href="/finance/middle-income-trap">
              <Card>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    image="/finance/Middle-Class-Trap-Finance.png"
                    alt="green iguana"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div" className='card-heading'>
                      Middle-Class Trap: Why You’ll Never Get Rich If You Think Like This
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }} className='card-desc'>
                      You work hard every single day. You earn, you pay bills, you save a little, and still — somehow
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Link>
          </Grid>

          <Grid size={4}>
            <Link href="/finance/1-crore-before-35-real-math">
              <Card>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    image="/finance/1-crore-before-35-real-math.png"
                    alt="green iguana"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div" className='card-heading'>
                      Middle-Class Trap: Why You’ll Never Get Rich If You Think Like This
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }} className='card-desc'>
                      You work hard every single day. You earn, you pay bills, you save a little, and still — somehow
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Link>
          </Grid>


        </Grid>
      </Box>
    </Container>
  </>
}