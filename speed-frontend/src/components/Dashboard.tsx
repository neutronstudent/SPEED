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
      <TopNavBar handleDrawerToggle={handleDrawerToggle} />
      <Sidenav mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
      <div className='content'>
        <Routes>
          {/* <Route path='/search-page' element={<SearchPage />} /> */}
          {/* <Route path='/submit-article' element={<SubmissionPage />} />
          <Route path='/moderation' element={<Moderation />} />
          <Route path='/analysis' element={<Analysis />} />
          <Route path='/my-submissions' element={<MySubmissions />} /> */}
        </Routes>
        <Button onClick={handleLogout}>Logout</Button>
      </div>
    </Box>
  );
};

export default Dashboard;
