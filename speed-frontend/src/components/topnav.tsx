import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';

interface TopBarProps {
    handleDrawerToggle?: () => void;
  }

  const TopNavBar: React.FC<TopBarProps> = ({ handleDrawerToggle }) => {
    return (
      <AppBar position="fixed">
        <Toolbar>
          {/* Menu Icon Button */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          {/* App Title */}
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            SPEED
          </Typography>
        </Toolbar>
      </AppBar>
    );
  };
  
  export default TopNavBar;