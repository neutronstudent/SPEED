import React, { useState } from 'react';
import { useUser } from '../components/UserContext';
import { logout } from '../controller/login';
import { useRouter } from 'next/navigation';
import Sidenav from './sidenav';
import SearchAppBar from './topnav';
import { Box, CssBaseline, Typography, Button } from '@mui/material';

const drawerWidth = 240;

const Dashboard: React.FC = () => {
  const { user, setUser } = useUser();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <SearchAppBar handleDrawerToggle={handleDrawerToggle} />
      <Sidenav mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          mt: 8,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        {user ? (
          <Box>
            <Typography variant="h6">User Details</Typography>
            <Typography>UID: {user.uid}</Typography>
            <Typography>Email: {user.email}</Typography>
            <Typography>Role: {user.role}</Typography>
            <Button variant="contained" color="primary" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        ) : (
          <Typography>No user information available.</Typography>
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;
