import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useUser } from '../components/UserContext';
import { logout } from '../controller/login';
import { useRouter } from 'next/navigation';
import Sidenav from './sidenav';
import TopNavBar from './topnav';
import { Box, CssBaseline, Typography, Button } from '@mui/material';

const drawerWidth = 240;

const Dashboard: React.FC = () => {
  const { user, setUser } = useUser();

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <h1>Test</h1>
    </Box>
  );
};

export default Dashboard;
