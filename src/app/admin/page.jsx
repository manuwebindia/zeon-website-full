'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // Check if token already exists in localStorage
    const token = localStorage.getItem('zeon_admin_token');
    if (token) {
      router.push('/admin/dashboard');
    } else {
      setCheckingAuth(false);
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store token and user data in localStorage for permission gating
      localStorage.setItem('zeon_admin_token', data.token);
      localStorage.setItem('zeon_admin_user', JSON.stringify(data.user || {}));
      localStorage.setItem('zeon_admin_permissions', JSON.stringify(data.user?.permissions || []));
      router.push('/admin/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: 3,
        background: 'radial-gradient(circle, rgba(255,68,68,0.08) 0%, rgba(204,34,34,0.03) 100%)',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          width: '100%',
          maxWidth: 400,
          borderRadius: 3,
          boxShadow: '0 8px 40px -12px rgba(0,0,0,0.1)',
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
            <Image
              src="/zeon-logo.png"
              alt="Zeon Academy Logo"
              width={220}
              height={46}
              style={{ objectFit: 'contain' }}
              priority
            />
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            Admin Panel
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            sx={{ mb: 3 }}
          />
          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            disabled={loading}
            sx={{
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600,
              boxShadow: '0 4px 14px 0 rgba(255,68,68,0.4)',
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
