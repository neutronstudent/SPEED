import * as React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';

const TopNavBar: React.FC = () => {
  return (
    <AppBar position="fixed">
      <Toolbar>
        {/* App Title */}
        <Box sx={{ flexGrow: 1 }} />
        <Typography variant="h6" noWrap sx={{ fontSize: '2rem' }}>
          SPEED
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
      </Toolbar>
    </AppBar>
  );
};

export default TopNavBar;