import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ThemeProvider, useTheme } from '../context/ThemeContext';
import { Button, Input, Modal, Pagination, Badge } from '../components/ui';
import ThemeToggle from '../components/ThemeToggle';

function ThemeConsumer() {
  const { theme } = useTheme();
  return <span data-testid="current-theme">{theme}</span>;
}

describe('UI Primitives and Theme', () => {
  it('toggles theme between light, dark, and system', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
        <ThemeConsumer />
      </ThemeProvider>
    );

    const toggle = screen.getByRole('button');
    const display = screen.getByTestId('current-theme');

    expect(display.textContent).toBe('system');
    fireEvent.click(toggle);
    expect(display.textContent).toBe('light');
    fireEvent.click(toggle);
    expect(display.textContent).toBe('dark');
  });

  it('renders button with loading spinner and disabled state', () => {
    render(<Button loading>Click me</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('renders input with error state and accessibility attributes', () => {
    render(<Input label="Email address" name="email" error="Invalid email address" />);
    expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Invalid email address')).toBeInTheDocument();
  });

  it('handles pagination next and previous clicks', () => {
    const onPageChange = vi.fn();
    render(<Pagination page={2} totalPages={5} onPageChange={onPageChange} />);

    fireEvent.click(screen.getByRole('button', { name: /previous/i }));
    expect(onPageChange).toHaveBeenCalledWith(1);

    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('renders modal when open and handles escape key', () => {
    const onClose = vi.fn();
    const { rerender } = render(
      <Modal isOpen={false} onClose={onClose} title="Test dialog">
        <p>Dialog body</p>
      </Modal>
    );

    expect(screen.queryByText('Test dialog')).not.toBeInTheDocument();

    rerender(
      <Modal isOpen={true} onClose={onClose} title="Test dialog">
        <p>Dialog body</p>
      </Modal>
    );

    expect(screen.getByText('Test dialog')).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });

  it('renders badge with correct variant classes', () => {
    render(<Badge variant="success">Active</Badge>);
    expect(screen.getByText('Active')).toHaveClass('text-emerald-700');
  });
});
