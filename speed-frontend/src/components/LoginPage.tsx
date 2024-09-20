import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Container, Box } from '@mui/material';
import { firebaseHandler, login } from '../controller/login';
import { useUser } from './UserContext';
import { useRouter } from 'next/navigation';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useUser();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    firebaseHandler.init();
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      const uid = user.uid;

      // Fetch user data after login
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${uid}`);
      if (!response.ok) throw new Error('Failed to fetch user data');

      const userData = await response.json();
      setUser(userData);

      router.push('/dashboard');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container 
      maxWidth="sm" 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh'
      }}
    >
      <Box 
        sx={{ 
          padding: 3, 
          borderRadius: 2, 
          boxShadow: 1, 
          bgcolor: 'background.paper'
        }}
      >
        <Typography variant="h4" align="center" color="text.primary" gutterBottom>
          Login
        </Typography>
        {error && <Typography color="error" align="center">{error}</Typography>}
        <form onSubmit={handleLogin}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading} // Disable button while loading
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default LoginPage;