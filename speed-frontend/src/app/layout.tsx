"use client"
import React from 'react';
import { UserProvider } from '../components/UserContext';
import theme from './theme';
import { CssBaseline, ThemeProvider } from '@mui/material';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <UserProvider>
            {children}
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}