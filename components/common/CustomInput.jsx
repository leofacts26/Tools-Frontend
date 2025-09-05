import React from "react";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";

const CssTextField = styled(TextField)({
  "& .MuiInputBase-root": {
    borderRadius: "4px",
    backgroundColor: "var(--clr-primary-4)",
    color: "var(--clr-white)",
    fontWeight: 600,
    fontSize: "18px",
    paddingRight: "8px",
    height: "40px",
    width: "130px",
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
  /* optional: style adornment here if you prefer central place */
  "& .MuiInputAdornment-root": {
    // color and fontWeight here will apply if you don't use Typography/disableTypography
    // color: "#009B72",
    // fontWeight: 600,
  },
});

const CustomInput = ({ amount, setAmount }) => {
  return (
    <CssTextField
      type="number"
      value={amount}
      onChange={(e) => setAmount(Number(e.target.value))}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Typography sx={{ color: "var(--clr-white)", fontWeight: 600 }}>₹</Typography>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default CustomInput;
