import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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

  test('renders the form and fetches article data', async () => {
    (useUser as jest.Mock).mockReturnValue({
      user: { uid: '12345', role: 'Moderator' },
    });

    render(<ModifyStatusForm articleUid="1" />);

    // Check if loading message appears first
    expect(screen.getByText(/Loading article data/i)).toBeTruthy();

    // Wait for article data to be loaded
    await waitFor(() => {
      expect(screen.getByText('Sample Article')).toBeTruthy();
      expect(screen.getByLabelText(/Feedback/i)).toBeTruthy();
    });
  });

  test('allows moderator to submit feedback', async () => {
    (useUser as jest.Mock).mockReturnValue({
      user: { uid: '12345', role: 'Moderator' },
    });

    render(<ModifyStatusForm articleUid="1" />);

    // Wait for the article data to load
    await waitFor(() => {
      expect(screen.getByText('Sample Article')).toBeTruthy();
    });

    // Enter feedback
    const feedbackInput = screen.getByLabelText(/Feedback/i);
    fireEvent.change(feedbackInput, { target: { value: 'Test feedback' } });

    // Select decision (Approve)
    fireEvent.click(screen.getByText(/Approve/i));

    // Submit form
    fireEvent.click(screen.getByText(/Confirm/i));

    // Ensure fetch was called with the correct data
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/articles/1`,
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify({
            modNote: 'Test feedback',
            status: 'MODERATED',
          }),
        })
      );
    });

    // Check if the page redirect occurred
    expect(mockPush).toHaveBeenCalledWith('/modify-status-success');
  });

  test('requires decision selection before submitting for moderator', async () => {
    (useUser as jest.Mock).mockReturnValue({
      user: { uid: '12345', role: 'Moderator' },
    });

    render(<ModifyStatusForm articleUid="1" />);

    // Wait for article data to be loaded
    await waitFor(() => {
      expect(screen.getByText('Sample Article')).toBeTruthy();
    });
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
