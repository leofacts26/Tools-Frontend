"use client"; // client component

import React, { useState } from "react";
import { Box, TextField, Button, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
}));


export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Example: send to API endpoint or email service
    console.log("Form submitted:", form);
    alert("Message sent!");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <StyledPaper elevation={3}>
      <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
        <TextField
          label="Name"
          name="name"
          variant="outlined"
          fullWidth
          required
          sx={{ mb: 2 }}
          value={form.name}
          onChange={handleChange}
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          variant="outlined"
          fullWidth
          required
          sx={{ mb: 2 }}
          value={form.email}
          onChange={handleChange}
        />
        <TextField
          label="Message"
          name="message"
          variant="outlined"
          fullWidth
          required
          multiline
          rows={4}
          sx={{ mb: 3 }}
          value={form.message}
          onChange={handleChange}
        />
        <Button type="submit" variant="contained" style={{color: "#fff"}} fullWidth>
          Send Message
        </Button>
      </Box>
    </StyledPaper>
  );
}
