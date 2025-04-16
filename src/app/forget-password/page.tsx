'use client';

import { useState } from 'react';
import { Button, TextField, Box, Typography, Container, Alert } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    try {
      const response = await axios.post('http://192.168.29.226:4000/api/v1/user/forget-password', {
        email,
      });
      if(response.status===200) {
        router.push('/reset-password');
      }else{
        setError('Failed to send reset password email');
      }
    } catch (err:any) {
      setError('Failed to process your request. Please try again.');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          Forgot Password
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}


        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              bgcolor: '#1976d2',
              '&:hover': {
                bgcolor: '#1565c0',
              },
            }}
          >
            Reset Password
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
