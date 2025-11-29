"use client";
import React from "react";
import { Stack } from "@mui/material";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import YouTubeIcon from "@mui/icons-material/YouTube";
import RedditIcon from "@mui/icons-material/Reddit";
import TwitterIcon from "@mui/icons-material/Twitter";
import { styled } from "@mui/material/styles";

const SocialIcon = styled("a")(({ theme }) => ({
  color: theme.palette.text.primary,
  transition: "color 0.3s",
  "&:hover": {
    color: "#ec407a",
  },
}));

export default function SocialLinks() {
  return (
    <Stack direction="row" spacing={2}>
      <SocialIcon href="https://www.linkedin.com/in/ganakahub/" target="_blank" rel="noopener noreferrer">
        <LinkedInIcon fontSize="large" />
      </SocialIcon>
      <SocialIcon href="https://www.youtube.com/@ganakahub" target="_blank" rel="noopener noreferrer">
        <YouTubeIcon fontSize="large" />
      </SocialIcon>
      <SocialIcon href="https://x.com/ganakahub" target="_blank" rel="noopener noreferrer">
        <TwitterIcon fontSize="large" />
      </SocialIcon>
      <SocialIcon href="https://www.reddit.com/user/ganakahub/" target="_blank" rel="noopener noreferrer">
        <RedditIcon fontSize="large" />
      </SocialIcon>
    </Stack>
  );
}
