// /components/common/CustomInput.jsx
"use client";
import React from "react";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Box } from "@mui/material";

const CssTextField = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-root": {
    borderRadius: "4px",
    backgroundColor: "var(--clr-primary-light)",
    color: "var(--clr-primary-1)",
    fontWeight: 600,
    fontSize: "14px",
    paddingRight: "8px",
    height: "30px",
    transition: "background-color 0.2s ease, color 0.2s ease",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
  "& .MuiInputBase-input": {
    textAlign: "right",
    MozAppearance: "textfield",
  },
  "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
    WebkitAppearance: "none",
    margin: 0,
  },
}));

// Styled tooltip (white bg, red text, with shadow)
const RedTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(() => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#ffffff",
    color: "#f44336",
    fontSize: "13px",
    fontWeight: 600,
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    borderRadius: "6px",
    padding: "6px 10px",
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: "#ffffff",
  },
}));

const CustomInput = ({
  value,
  onChange,
  startAdornment,
  endAdornment,
  width = 120,
  min,
  max,
  onBlur,
  error = false,
  errorMessage = "",
}) => {
  const adornmentColor = error ? "error.main" : "var(--clr-primary-1)";

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      {error && errorMessage && (
        <RedTooltip title={errorMessage} arrow>
          <InfoOutlinedIcon
            fontSize="small"
            sx={{ color: "error.main", cursor: "pointer" }}
          />
        </RedTooltip>
      )}

      <CssTextField
        type="number"
        value={value ?? ""}
        onChange={(e) => {
          // allow user to type anything (including values below min),
          // but clamp above the max so input cannot grow beyond max.
          let raw = e.target.value;
          if (raw === "") {
            onChange("");
            return;
          }
          let num = Number(raw);
          if (!isFinite(num)) {
            onChange("");
            return;
          }
          if (typeof max !== "undefined" && num > max) num = max; // clamp only to max
          onChange(num);
        }}
        onBlur={(e) => {
          // on blur, clamp to max if needed; don't force up to min
          const raw = e.target.value;
          if (raw === "") {
            if (typeof onBlur === "function") onBlur("");
            return;
          }
          let num = Number(raw);
          if (!isFinite(num)) num = "";
          if (num !== "" && typeof max !== "undefined" && num > max) num = max;
          if (typeof onBlur === "function") onBlur(num);
        }}
        InputProps={{
          startAdornment: startAdornment ? (
            <InputAdornment position="start">
              <Typography sx={{ color: adornmentColor, fontWeight: 600 }}>
                {startAdornment}
              </Typography>
            </InputAdornment>
          ) : null,
          endAdornment: endAdornment ? (
            <InputAdornment position="end">
              <Typography sx={{ color: adornmentColor, fontWeight: 600 }}>
                {endAdornment}
              </Typography>
            </InputAdornment>
          ) : null,
        }}
        inputProps={{
          min: typeof min !== "undefined" ? min : undefined,
          max: typeof max !== "undefined" ? max : undefined,
          inputMode: "numeric",
          pattern: "[0-9]*",
        }}
        sx={{
          width,
          "& .MuiInputBase-root": error ? { backgroundColor: "#ffe5e5" } : {},
          "& .MuiInputBase-input": error ? { color: "#d32f2f", fontWeight: 600 } : {},
        }}
      />
    </Box>
  );
};

export default CustomInput;
