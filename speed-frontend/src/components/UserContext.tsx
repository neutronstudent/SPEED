import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// User interface that defines the user object
interface User {
  uid: string;
  email: string;
  role: string;
}

// User context type that defines the user and setUser functions
interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

// User context that stores the user and setUser functions
const UserContext = createContext<UserContextType | undefined>(undefined);

// User provider that provides the user context to the application
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // Get user from local storage when the component mounts, and redirect to dashboard if user is found
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        router.push('/dashboard');
      }
    }
  }, [router]);

  // Store user in local storage whenever it changes, and clears from storage if user is null
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.removeItem('user');
      }
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook that returns the user context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};