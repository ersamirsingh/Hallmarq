import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../context/ThemeContext';
import * as AuthContextModule from '../context/AuthContext';
import Profile from '../pages/Profile';
import profileApi from '../api/profile.api';

describe('Profile Page', () => {
  const mockUser = {
    id: 1,
    name: 'Alice Johnson Regular User',
    email: 'alice@example.com',
    address: '123 Test Street, Springfield',
    role: 'USER',
    emailVerified: true
  };

  beforeEach(() => {
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: mockUser,
      setUser: vi.fn()
    });
  });

  it('renders profile information and badges', () => {
    render(
      <ThemeProvider>
        <BrowserRouter>
          <Profile />
        </BrowserRouter>
      </ThemeProvider>
    );

    expect(screen.getByRole('heading', { name: /profile settings/i })).toBeInTheDocument();
    expect(screen.getByText('USER')).toBeInTheDocument();
    expect(screen.getByText('Verified')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Alice Johnson Regular User')).toBeInTheDocument();
  });

  it('shows warning when email address is altered', () => {
    render(
      <ThemeProvider>
        <BrowserRouter>
          <Profile />
        </BrowserRouter>
      </ThemeProvider>
    );

    const emailInput = screen.getByLabelText(/email address/i);
    fireEvent.change(emailInput, { target: { value: 'alice.new@example.com' } });

    expect(
      screen.getByText(/changing your email will mark it unverified/i)
    ).toBeInTheDocument();
  });

  it('submits password change form successfully', async () => {
    vi.spyOn(profileApi, 'changePassword').mockResolvedValueOnce({
      message: 'Password updated. Other sessions have been signed out.'
    });

    render(
      <ThemeProvider>
        <BrowserRouter>
          <Profile />
        </BrowserRouter>
      </ThemeProvider>
    );

    const currentInput = screen.getByLabelText(/current password/i);
    const newInput = screen.getByLabelText(/new password/i);
    const submitBtn = screen.getByRole('button', { name: /update password/i });

    fireEvent.change(currentInput, { target: { value: 'OldP@ss1' } });
    fireEvent.change(newInput, { target: { value: 'NewP@ssword2!' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(profileApi.changePassword).toHaveBeenCalledWith({
        currentPassword: 'OldP@ss1',
        newPassword: 'NewP@ssword2!'
      });
    });
  });
});
