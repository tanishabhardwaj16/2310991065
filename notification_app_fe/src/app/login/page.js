"use client";

import React, { useState, useEffect } from "react";
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Alert 
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [credentials, setCredentials] = useState({
    email: "your@university.edu",
    name: "Your Name",
    rollNo: "yourrollno",
    accessCode: "yourAccessCode",
    clientID: "your-client-id",
    clientSecret: "your-client-secret"
  });
  
  const { login, loading, error, token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (token) {
      router.push("/");
    }
  }, [token, router]);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(credentials);
    if (success) {
      router.push("/");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom color="primary.main">
            Notification System
          </Typography>
          <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>
            Sign in to access your dashboard
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField margin="normal" required fullWidth id="email" label="Email Address" name="email" autoComplete="email" value={credentials.email} onChange={handleChange} />
            <TextField margin="normal" required fullWidth id="name" label="Name" name="name" value={credentials.name} onChange={handleChange} />
            <TextField margin="normal" required fullWidth id="rollNo" label="Roll No" name="rollNo" value={credentials.rollNo} onChange={handleChange} />
            <TextField margin="normal" required fullWidth id="accessCode" label="Access Code" name="accessCode" value={credentials.accessCode} onChange={handleChange} />
            <TextField margin="normal" required fullWidth id="clientID" label="Client ID" name="clientID" value={credentials.clientID} onChange={handleChange} />
            <TextField margin="normal" required fullWidth id="clientSecret" label="Client Secret" name="clientSecret" type="password" value={credentials.clientSecret} onChange={handleChange} />
            
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
