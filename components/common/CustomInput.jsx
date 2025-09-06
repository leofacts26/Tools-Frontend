import React from "react";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";

const CssTextField = styled(TextField)({
  "& .MuiInputBase-root": {
    borderRadius: "4px",
    backgroundColor: "var(--clr-primary-light)",
    color: "var(--clr-primary-1)",
    fontWeight: 600,
    fontSize: "14px",
    paddingRight: "8px",
    height: "30px",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
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
});

const CustomInput = ({
  value,
  onChange,
  startAdornment,
  endAdornment,
  width = 100,
}) => {
  return (
    <CssTextField
      type="number"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      InputProps={{
        startAdornment: startAdornment ? (
          <InputAdornment position="start">
            <Typography sx={{ color: "var(--clr-primary-1)", fontWeight: 600 }}>{startAdornment}</Typography>
          </InputAdornment>
        ) : null,
        endAdornment: endAdornment ? (
          <InputAdornment position="end">
            <Typography sx={{ color: "var(--clr-primary-1)", fontWeight: 600 }}>{endAdornment}</Typography>
          </InputAdornment>
        ) : null,
      }}
      sx={{ width }}
    />
  );
};

export default CustomInput;
