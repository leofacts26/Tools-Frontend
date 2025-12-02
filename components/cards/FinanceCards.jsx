"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Box, Container, Card, CardContent, Typography, CardActionArea } from "@mui/material";
import Grid from '@mui/material/Grid'; import Image from "next/image";
import Link from "next/link";

// Data array
const financeCardData = [
  {
    title: "Become a Crorepati Before 35 — The Real Math",
    description: "You work hard every single day. You earn, you pay bills, you save a little, and still — somehow...",
    imageUrl: "/finance/1-crore-before-35-real-math.png",
    altText: "1 crore before 35 thumbnail",
    link: "/finance/1-crore-before-35-real-math",
    category: "Finance",
  },
  {
    title: "How Indians Waste ₹10,000 Every Month Without Realizing It",
    description:
      "Every month, your salary comes in… and vanishes. You check your bank balance after two weeks — and it’s already gone.",
    imageUrl: "/finance/How-Indians-Waste-10,000-Every-Month-Without-Realizing-It.png",
    altText: "How Indians Waste ₹10,000 thumbnail",
    link: "/finance/how-indians-waste-10000-every-month",
    category: "Finance",
  },
  {
    title: "Middle-Class Trap: Why You’ll Never Get Rich If You Think Like This",
    description: "You work hard every single day. You earn, you pay bills, you save a little, and still — somehow...",
    imageUrl: "/finance/Middle-Class-Trap-Finance.png",
    altText: "Middle-Class Trap thumbnail",
    link: "/finance/middle-income-trap",
    category: "Finance",
  },
  {
    title: "What the Rich Know That Schools Never Taught You",
    description:
      "Have you ever wondered why some people seem to move ahead in life… while others keep struggling no matter how hard they work?",
    imageUrl: "/finance/What-the-Rich-Know-That-Schools-Never-Taught-You.png",
    altText: "What the Rich Know thumbnail",
    link: "/finance/what-the-rich-know-schools-never-taught",
    category: "Finance",
  },
  {
    title: "From ₹0 to ₹1 Crore: The Step-by-Step Roadmap No One Shows You",
    description:
      "Let’s be honest — we’ve all seen those “get rich fast” videos that promise you’ll make crores overnight. But real life doesn’t work like that.",
    imageUrl: "/finance/From-0-to-1-Crore-The-Step-by-Step-Roadmap-No-One-Shows-You.png",
    altText: "From ₹0 to ₹1 Crore roadmap thumbnail",
    link: "/finance/zero-to-one-crore-roadmap",
    category: "Finance",
  }
];

export default function FinanceCards({ excludeTitle }) {
  // keep naming for parity with your other component
  const [selectedState, setSelectedState] = useState("All");

  const cardsPerPage = 6;
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const sentinelRef = useRef(null);

  // Filter (your data has category, not state)
  const filteredCards = useMemo(() => {
    return financeCardData.filter((card) => {
      const matches = selectedState === "All" || card.category === selectedState;
      const notExcluded = excludeTitle ? card.title !== excludeTitle : true;
      return matches && notExcluded;
    });
  }, [selectedState, excludeTitle]);

  const total = filteredCards.length;
  const visibleCount = Math.min(page * cardsPerPage, total);
  const visibleCards = filteredCards.slice(0, visibleCount);
  const hasMore = visibleCount < total;

  useEffect(() => {
    setPage(1);
  }, [selectedState, excludeTitle]);

  // IntersectionObserver for infinite scroll
  useEffect(() => {
    if (!sentinelRef.current) return;
    const el = sentinelRef.current;

    const io = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !isLoading) {
          setIsLoading(true);
          setTimeout(() => {
            setPage((p) => p + 1);
            setIsLoading(false);
          }, 150);
        }
      },
      { root: null, rootMargin: "200px 0px", threshold: 0 }
    );

    io.observe(el);
    return () => io.unobserve(el);
  }, [hasMore, isLoading]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          {visibleCards.map((card) => (
            <Grid key={card.title} size={{ xs: 12, md: 4 }}>
              <Card>
                <CardActionArea component={Link} href={card.link}>
                  <Box sx={{ position: "relative", width: "100%", pt: "56.25%" }}>
                    <Image
                      src={card.imageUrl}
                      alt={card.altText}
                      fill
                      sizes="(max-width:600px) 100vw, (max-width:1200px) 50vw, 33vw"
                      style={{ objectFit: "cover" }}
                      priority={page === 1}
                    />
                  </Box>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div" className="card-heading">
                      {card.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary" }} className="card-desc">
                      {card.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}

          {/* Sentinel for infinite loading */}
          <Grid size={{ xs: 12 }}>
            <Box ref={sentinelRef} sx={{ height: 1 }} />
          </Grid>
        </Grid>

        {isLoading && (
          <Box sx={{ textAlign: "center", py: 2, fontSize: 14, opacity: 0.7 }}>
            Loading more…
          </Box>
        )}
      </Box>
    </Container>
  );
}
