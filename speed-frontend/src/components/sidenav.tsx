// sidenav.tsx
"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useUser } from "./UserContext";
import {
  Box,
  Drawer,
  List,
  Divider,
  ListItem,
  ListItemButton,
  ListItemText,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { logout } from "@/controller/login";

interface SidenavProps {
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
}

const drawerWidth = 240;

/**
 * Side navigation component that displays the navigation links for the application on the left side of the screen
 * @returns Side navigation component
 */
const Sidenav: React.FC<SidenavProps> = ({ mobileOpen, handleDrawerToggle }) => {
  const { user, setUser } = useUser();
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
    handleDrawerToggle(); // Close drawer after navigation
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Side navigation list
  const DrawerList = (
    <Box sx={{ width: drawerWidth }} role="presentation">
      <List>
        <ListItem>
          <ListItemButton onClick={() => handleNavigation("/dashboard")}>
            <ListItemText primary="Home" />
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton onClick={() => handleNavigation("/submit-article")}>
            <ListItemText primary="Submit Article" />
          </ListItemButton>
        </ListItem>
        {user?.role === "Moderator" && (
          <ListItem>
            <ListItemButton onClick={() => handleNavigation("/moderation")}>
              <ListItemText primary="Moderation" />
            </ListItemButton>
          </ListItem>
        )}
        {user?.role === "Analyst" && (
          <ListItem>
            <ListItemButton onClick={() => handleNavigation("/analysis")}>
              <ListItemText primary="Analysis" />
            </ListItemButton>
          </ListItem>
        )}
      </List>
      <Divider />
      <List>
        <ListItem>
          <ListItemButton onClick={() => handleNavigation("/my-submissions")}>
            <ListItemText primary="My Submissions" />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem>
          <ListItemText style={{ color: "grey" }}>
            {user && user.email}
          </ListItemText>
        </ListItem>
        <ListItem>
          <ListItemButton onClick={handleLogout}>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
    </Box>
  );

  return (
    <Drawer
      variant="temporary"
      open={mobileOpen}
      onClose={handleDrawerToggle}
      ModalProps={{
        keepMounted: true,
      }}
      sx={{
        '& .MuiDrawer-paper': {
          boxSizing: 'border-box',
          width: drawerWidth,
          top: '64px', // Adjust this to match the AppBar height
        },
      }}
    >
      {DrawerList}
    </Drawer>
  );
};

export default Sidenav;
