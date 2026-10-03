import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../context/ThemeContext';
import { AuthProvider } from '../context/AuthContext';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import ForgotPassword from '../pages/ForgotPassword';
import authApi from '../api/auth.api';

function renderWithProviders(ui) {
  return render(
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>{ui}</BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

describe('Auth Pages', () => {
  it('renders login form and validates required fields', async () => {
    renderWithProviders(<Login />);

    expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
    const submitButton = screen.getByRole('button', { name: /^sign in$/i });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  it('validates signup password and name constraints', async () => {
    const { container } = renderWithProviders(<Signup />);

    const nameInput = container.querySelector('input[name="name"]');
    const passwordInput = container.querySelector('input[name="password"]');
    const submitButton = screen.getByRole('button', { name: /create account/i });

    fireEvent.change(nameInput, { target: { value: 'Al' } });
    fireEvent.change(passwordInput, { target: { value: 'simple' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/name must be at least 3 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/password must be between 8 and 16 characters/i)).toBeInTheDocument();
    });
  });

  it('renders forgot password and handles successful submit', async () => {
    vi.spyOn(authApi, 'forgotPassword').mockResolvedValueOnce({
      message: 'Password reset link sent'
    });

    renderWithProviders(<ForgotPassword />);

    const emailInput = screen.getByLabelText(/email address/i);
    const submitButton = screen.getByRole('button', { name: /send reset link/i });

    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/if an account exists for that email, we have sent instructions/i)
      ).toBeInTheDocument();
    });
  });
});
