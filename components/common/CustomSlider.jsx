// /components/common/CustomSlider.jsx
"use client";
import React from "react";
import { styled } from "@mui/material/styles";
import Slider from "@mui/material/Slider";

const StyledSlider = styled(Slider)(({ theme }) => ({
  color: "var(--clr-primary-1)",
  height: 6,
  borderRadius: 4,
  "& .MuiSlider-thumb": {
    height: 26,
    width: 26,
    backgroundColor: "var(--clr-white)",
    "&:hover": {
      boxShadow: "0px 0px 0px 8px var(--clr-primary-7)",
    },
  },
  "& .MuiSlider-track": {
    border: "none",
  },
  "& .MuiSlider-rail": {
    opacity: 0.3,
  },
}));

const CustomSlider = ({ value, onChange, min, max, step, sx }) => {
  return (
    <StyledSlider
      value={value}
      min={min}
      max={max}
      step={step}
      onChange={onChange}
      sx={sx}
      aria-valuemin={min}
      aria-valuemax={max}
    />
  );
};

export default CustomSlider;
