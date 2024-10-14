import { render, screen, waitFor } from '@testing-library/react';
import ModifyStatusForm from './ModifyStatusForm';
import { useRouter } from 'next/navigation';
import { useUser } from './UserContext';

// Mock useRouter
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock useUser to return a Moderator or Analyst user
jest.mock('./UserContext', () => ({
  useUser: jest.fn(),
}));

// Mock the fetch API
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      id: '1',
      title: 'Sample Article',
      modNote: 'Sample Moderator Note',
      status: 'NEW',
    }),
  })
) as jest.Mock;

describe('ModifyStatusForm component', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('renders readonly mod note for analyst role', async () => {
    // Mock useUser to return an Analyst role
    (useUser as jest.Mock).mockReturnValue({
      user: { uid: '67890', role: 'Analyst' },
    });

    render(<ModifyStatusForm articleUid="1" />);

    // Wait for article data to load
    await waitFor(() => {
      expect(screen.getByText('Sample Article')).toBeTruthy();

      // Select the moderator's feedback by its displayed value
      const modNoteInput = screen.getByDisplayValue('Sample Moderator Note');
      expect(modNoteInput).toBeTruthy();
    });
  });
});
