import React from 'react';
import { useUser } from '../components/UserContext';
import { logout } from '../controller/login';
import { useRouter } from 'next/navigation';

// Dashboard component that displays user details and logout button, extracting user and setUser from context
const Dashboard: React.FC = () => {
  const { user, setUser } = useUser(); // Extract user and setUser from context
  const router = useRouter();

  // Logout function which calls the logout function from the login controller, clears user context, and redirects to login page
  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Adjusts the return layout for the dashboard page and includes basic css styling
  return (
    <div>
      <h1>Dashboard</h1>
      {user ? (
        <div>
          <h2>User Details</h2>
          <p>UID: {user.uid}</p>
          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>
          <button onClick={handleLogout}>Logout</button> {}
        </div>
      ) : (
        <p>No user information available.</p>
      )}
    </div>
  );
};

export default Dashboard;