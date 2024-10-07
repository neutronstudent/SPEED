import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { UserProvider, useUser } from './UserContext';
import { useRouter } from 'next/navigation';
import React from 'react';

// Mock useRouter
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock the router push method
const mockPush = jest.fn();
(useRouter as jest.Mock).mockReturnValue({
  push: mockPush,
});

// Test component to access and modify user context
const TestComponent = () => {
  const { user, setUser } = useUser();

  return (
    <div>
      <p data-testid="user-email">{user ? user.email : 'No user'}</p>
      <button data-testid="set-user-button" onClick={() => setUser({ uid: '1', email: 'test@example.com', role: 'admin' })}>
        Set User
      </button>
      <button data-testid="clear-user-button" onClick={() => setUser(null)}>Clear User</button>
    </div>
  );
};

describe('UserProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('renders with no user initially', () => {
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    // Check that the component shows 'No user' initially
    const userEmail = screen.getByTestId('user-email');
    expect(userEmail.textContent).toBe('No user');
  });

  test('sets user and stores it in localStorage', () => {
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    // Simulate clicking the "Set User" button
    const setUserButton = screen.getByTestId('set-user-button');
    fireEvent.click(setUserButton);

    // Check that the user is set
    const userEmail = screen.getByTestId('user-email');
    expect(userEmail.textContent).toBe('test@example.com');

    // Check that localStorage is updated
    expect(localStorage.getItem('user')).toBe(JSON.stringify({ uid: '1', email: 'test@example.com', role: 'admin' }));
  });

  test('clears user and removes it from localStorage', () => {
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    // Set the user
    const setUserButton = screen.getByTestId('set-user-button');
    fireEvent.click(setUserButton);

    // Clear the user
    const clearUserButton = screen.getByTestId('clear-user-button');
    fireEvent.click(clearUserButton);

    // Check that the user is cleared
    const userEmail = screen.getByTestId('user-email');
    expect(userEmail.textContent).toBe('No user');

    // Check that localStorage is cleared
    expect(localStorage.getItem('user')).toBeNull();
  });

  test('redirects to /dashboard if user is found in localStorage', async () => {
    // Simulate an existing user in localStorage
    localStorage.setItem('user', JSON.stringify({ uid: '1', email: 'test@example.com', role: 'admin' }));

    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    // Wait for the redirect
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });
});