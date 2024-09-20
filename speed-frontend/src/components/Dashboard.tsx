"use client";
import React from 'react';
import { useUser } from '../components/UserContext';
import { logout } from '../controller/login'; // Adjust the import path as needed
import { useRouter } from 'next/navigation';

const Dashboard: React.FC = () => {
  const { user, setUser } = useUser(); // Extract user and setUser from context
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout(); // Call the logout function from the login controller
      setUser(null); // Clear the user context
      router.push('/'); // Redirect to the login page
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      {user ? (
        <div>
          <h2>User Details</h2>
          <p>UID: {user.uid}</p>
          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>
          <button onClick={handleLogout}>Logout</button> {/* Logout button */}
        </div>
      ) : (
        <p>No user information available.</p>
      )}
    </div>
  );
};

export default Dashboard;