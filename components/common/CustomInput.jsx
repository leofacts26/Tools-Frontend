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

  /* Disabled state overrides to make it visually clear and not dimmed */
  "& .MuiInputBase-root.Mui-disabled": {
    backgroundColor: "#f5f5f5", // light gray bg
    color: theme.palette.text.disabled,
    cursor: "not-allowed",
    // keep height/font consistent
  },
  "& .MuiInputBase-input.Mui-disabled": {
    color: theme.palette.text.disabled,
    WebkitTextFillColor: theme.palette.text.disabled,
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
  disabled = false,
}) => {
  // adornment color: red when error, muted when disabled, otherwise brand color
  const adornmentColor = error ? "error.main" : disabled ? "text.disabled" : "var(--clr-primary-1)";

  // local state to allow the user to clear the field (show empty) while editing
  const [localValue, setLocalValue] = React.useState(value ?? "");
  const [editing, setEditing] = React.useState(false);

  // sync prop -> local when not editing
  React.useEffect(() => {
    if (!editing) {
      setLocalValue(value ?? "");
    }
  }, [value, editing]);

  const handleFocus = () => setEditing(true);
  const handleBlurLocal = (e) => {
    setEditing(false);
    const raw = localValue;
    if (raw === "") {
      if (typeof onBlur === "function") onBlur("");
      if (typeof onChange === "function") onChange("");
      return;
    }
    let num = Number(raw);
    if (!isFinite(num)) num = "";
    if (num !== "" && typeof max !== "undefined" && num > max) num = max;
    if (typeof onBlur === "function") onBlur(num);
    if (typeof onChange === "function") onChange(num);
  };

  const handleChangeLocal = (e) => {
    const raw = e.target.value;
    // allow empty string
    if (raw === "") {
      setLocalValue("");
      if (typeof onChange === "function") onChange("");
      return;
    }
    // strip non-digit characters (allow decimal point)
    const cleaned = raw.replace(/[^0-9.]/g, "");
    // clamp to max if necessary when it's a valid number
    const asNum = Number(cleaned);
    if (cleaned !== "" && isFinite(asNum) && typeof max !== "undefined" && asNum > max) {
      setLocalValue(String(max));
      if (typeof onChange === "function") onChange(max);
      return;
    }
    setLocalValue(cleaned);
    if (cleaned === "") {
      if (typeof onChange === "function") onChange("");
    } else if (!isNaN(Number(cleaned))) {
      if (typeof onChange === "function") onChange(Number(cleaned));
    }
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      {error && errorMessage && (
        <RedTooltip title={errorMessage} arrow>
          <InfoOutlinedIcon
            fontSize="small"
            sx={{
              color: "error.main",
              cursor: "pointer",
              opacity: disabled ? 0.9 : 1,
            }}
          />
        </RedTooltip>
      )}

      <CssTextField
        disabled={disabled}
        type="text"
        value={localValue}
        placeholder={localValue === "" && value === 0 ? '0' : undefined}
        onFocus={handleFocus}
        onChange={handleChangeLocal}
        onBlur={handleBlurLocal}
        InputProps={{
          startAdornment: startAdornment ? (
            <InputAdornment position="start" sx={{ pointerEvents: "none" }}>
              <Typography sx={{ color: adornmentColor, fontWeight: 600 }}>
                {startAdornment}
              </Typography>
            </InputAdornment>
          ) : null,
          endAdornment: endAdornment ? (
            <InputAdornment position="end" sx={{ pointerEvents: "none" }}>
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
          "& .MuiInputBase-root.Mui-disabled": {
            backgroundColor: "#f5f5f5",
          },
          "& .MuiInputBase-input.Mui-disabled": {
            color: (theme) => theme.palette.text.disabled,
            fontWeight: 600,
          },
        }}
      />
    </Box>
  );
};

export default CustomInput;
