"use client";
import React from "react";
import { useRouter } from "next/router";
import { useUser } from "../components/UserContext";
import {
  Box,
  Drawer,
  List,
  Divider,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { logout } from "@/controller/login";

/**
 * Side navigation component that displays the navigation links for the application on the left side of the screen
 * @returns Side navigation component
 */
export default function Sidenav() {
  const { setUser } = useUser();
  const router = useRouter();

  // handle navigation to different pages from the side navigation
  const handleNavigation = (path: string) => {
    router.push(path);
  };

  // handle logout
  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // side navigation list
  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation">
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
        <ListItem>
          <ListItemButton onClick={() => handleNavigation("/moderation")}>
            <ListItemText primary="Moderation" />
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton onClick={() => handleNavigation("/analysis")}>
            <ListItemText primary="Analysis" />
          </ListItemButton>
        </ListItem>
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
          <ListItemButton onClick={() => handleLogout()}>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
  return (
    <div>
      <Drawer variant="permanent" open={true}>
        {DrawerList}
      </Drawer>
    </div>
  );
}
