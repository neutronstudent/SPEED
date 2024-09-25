import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Container, Box } from '@mui/material';
import { firebaseHandler, login } from '../controller/login';
import { useUser } from './UserContext';
import { useRouter } from 'next/navigation';

// Login component that handles user login and redirects to the dashboard
const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useUser();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    firebaseHandler.init();
  }, []);

  // Handles the login process with react context and redirects to the dashboard if successful
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);
  
    try {
      const user = await login(email, password);
      const uid = user.uid;
  
      const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${uid}`;
      console.log('Fetching user data from:', apiUrl);
  
      const response = await fetch(apiUrl);
  
      console.log('Response status:', response.status);
  
      const responseText = await response.text();
      console.log('Response text:', responseText);
  
      if (!response.ok) throw new Error(`Failed to fetch user data: ${response.status}`);
  
      // Try parsing the JSON
      let userData;
      try {
        userData = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        throw new Error('Failed to parse user data');
      }
  
      setUser(userData);
  
      router.push('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Adjusts the return layout for the login page and includes basic css styling
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
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Login;