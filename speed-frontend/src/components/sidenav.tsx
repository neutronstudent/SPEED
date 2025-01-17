// sidenav.tsx
"use client";
import React, { useEffect } from "react";
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
  mobileOpen?: boolean;
  handleDrawerToggle?: () => void;
}

const drawerWidth = 240;

/**
 * Side navigation component that displays the navigation links for the application on the left side of the screen
 * @returns Side navigation component
 */
const Sidenav: React.FC<SidenavProps> = ({
  mobileOpen,
  handleDrawerToggle,
}) => {
  const { user, setUser } = useUser();
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
    if (handleDrawerToggle) handleDrawerToggle();
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

  const handleModerationOrAnalysis = () => {
    if (user?.role === "Moderator") {
      handleNavigation("/moderation");
    } else if (user?.role === "Analyst") {
      handleNavigation("/analysis");
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
        {user?.role !== undefined && (
          <ListItem>
            <ListItemButton onClick={() => router.push("/submit?uid=new")}>
              <ListItemText primary="Submit Article" />
            </ListItemButton>
          </ListItem>
        )}
        {(user?.role === "Moderator" || user?.role === "Analyst") && (
  <ListItem>
    <ListItemButton onClick={() => handleNavigation("/moderator-analyst")}>
      <ListItemText primary={user?.role === "Moderator" ? "Moderation" : "Analysis"} />
    </ListItemButton>
  </ListItem>
)}
      </List>
      <Divider />
      {user?.role !== undefined && (
        <>
          <List>
            <ListItem>
              <ListItemButton onClick={() => handleNavigation("/my-submissions")}>
                <ListItemText primary="My Submissions" />
              </ListItemButton>
            </ListItem>
          </List>
          <Divider />
        </>
      )}
      {user ? (
        <List>
          <ListItem>
            <ListItemText style={{ color: "grey" }}>{user.email}</ListItemText>
          </ListItem>
          <ListItem>
            <ListItemButton onClick={() => handleLogout()}>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </List>
      ) : (
        <List>
          <ListItem>
            <ListItemButton onClick={() => handleNavigation("/login")}>
              <ListItemText primary="Login" />
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton onClick={() => handleNavigation("/signup")}>
              <ListItemText primary="Sign Up" />
            </ListItemButton>
          </ListItem>
        </List>
      )}
      <Divider />
    </Box>
  );

  return (
    <Drawer
      variant="persistent"
      open={mobileOpen != undefined ? mobileOpen : true}
      onClose={handleDrawerToggle}
      ModalProps={{
        keepMounted: true,
      }}
      sx={{
        "& .MuiDrawer-paper": {
          boxSizing: "border-box",
          width: drawerWidth,
          top: "64px",
        },
      }}
    >
      {DrawerList}
    </Drawer>
  );
};

export default Sidenav;
