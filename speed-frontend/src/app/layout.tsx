"use client";
import React from "react";
import { UserProvider } from "../components/UserContext";
import theme from "./theme";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import TopNavBar from "@/components/topnav";
import Sidenav from "@/components/sidenav";

// Root layout component that utilizes ThemeProviderm CSSBaseline, and UserProvider
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <UserProvider>
            <Box sx={{ display: "flex" }}>
              <CssBaseline />
              <TopNavBar />
              <Sidenav />
              <Box
                component="main"
                sx={{
                  flexGrow: 1,
                  p: 3,
                  backgroundColor:"white",
                  paddingTop: "64px",
                  paddingLeft: "260px",
                }}
              >
                {children}
              </Box>
            </Box>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
