import React, { useState } from 'react';
import { useUser } from '../components/UserContext';
import { Box, CssBaseline, Typography, Button } from '@mui/material';

const ArticleDetail: React.FC = () => {
  const { user, setUser } = useUser();

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Typography variant="h6">Article Detail</Typography>
      
    </Box>
  );
};

export default ArticleDetail;
