import React from "react";
import { styled } from "@mui/material/styles";
import Slider from "@mui/material/Slider";

const StyledSlider = styled(Slider)(({ theme }) => ({
  color: "var(--clr-primary-5)",  // consistent brand color
  height: 6,
  borderRadius: 4,
  "& .MuiSlider-thumb": {
    height: 26,
    width: 26,
    backgroundColor: "var(--clr-primary-10)",
    border: "2px solid var(--clr-primary-10)",
    "&:hover": {
      boxShadow: "0px 0px 0px 8px rgba(33, 150, 243, 0.16)", // hover ring
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
    />
  );
};

export default CustomSlider;
