import React from 'react';
import { useUser } from './UserContext'; // Adjust the path as needed
import { Typography, Box } from '@mui/material';

const Dashboard: React.FC = () => {
  const { user } = useUser(); // Extract user from context

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4">Dashboard</Typography>
      {user ? (
        <Box sx={{ marginTop: 2 }}>
          <Typography variant="h6">User Details</Typography>
          <Typography>UID: {user.uid}</Typography>
          <Typography>Email: {user.email}</Typography>
          <Typography>Role: {user.role}</Typography>
        </Box>
      ) : (
        <Typography>No user information available.</Typography>
      )}
    </Box>
  );
};

export default Dashboard;