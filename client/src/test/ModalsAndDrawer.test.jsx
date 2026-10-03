import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '../context/ThemeContext';
import AddUserModal from '../pages/admin/AddUserModal';
import AddStoreModal from '../pages/admin/AddStoreModal';
import RateStoreModal from '../components/RateStoreModal';
import ReviewsDrawer from '../components/ReviewsDrawer';
import adminApi from '../api/admin.api';
import categoryApi from '../api/category.api';
import storesApi from '../api/stores.api';

function renderWithProviders(ui) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }
  });
  return render(
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        {ui}
      </QueryClientProvider>
    </ThemeProvider>
  );
}

describe('Modals and Drawers', () => {
  it('validates AddUserModal input requirements', async () => {
    renderWithProviders(<AddUserModal isOpen={true} onClose={vi.fn()} onSuccess={vi.fn()} />);

    const submitBtn = screen.getByRole('button', { name: /^add user$/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/name must be at least 3 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
    });
  });

  it('validates AddStoreModal input requirements', async () => {
    vi.spyOn(categoryApi, 'getCategories').mockResolvedValueOnce({ categories: [] });
    vi.spyOn(adminApi, 'getAvailableOwners').mockResolvedValueOnce({ owners: [] });

    renderWithProviders(<AddStoreModal isOpen={true} onClose={vi.fn()} onSuccess={vi.fn()} />);

    const submitBtn = screen.getByRole('button', { name: /^add store$/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/store name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/please select a category/i)).toBeInTheDocument();
    });
  });

  it('prevents RateStoreModal submission when 0 stars are selected', () => {
    const mockStore = { id: 10, name: 'Sample Store', myRating: null };
    renderWithProviders(
      <RateStoreModal isOpen={true} onClose={vi.fn()} store={mockStore} onSuccess={vi.fn()} />
    );

    const submitBtn = screen.getByRole('button', { name: /submit rating/i });
    expect(submitBtn).toBeDisabled();
  });

  it('renders ReviewsDrawer with reviews and handles close', async () => {
    vi.spyOn(storesApi, 'getStoreReviews').mockResolvedValueOnce({
      reviews: [
        {
          id: 1,
          value: 4,
          comment: 'Great atmosphere and friendly staff!',
          createdAt: '2026-10-01T12:00:00Z',
          user: { id: 5, name: 'David Reviewer' }
        }
      ],
      pagination: { page: 1, limit: 10, total: 1, totalPages: 1 }
    });

    const onClose = vi.fn();
    const mockStore = {
      id: 2,
      name: 'The Roasted Bean',
      rating: { average: '4.0', count: 1 }
    };

    renderWithProviders(
      <ReviewsDrawer isOpen={true} onClose={onClose} store={mockStore} />
    );

    expect(await screen.findByText('David Reviewer')).toBeInTheDocument();
    expect(screen.getByText('Great atmosphere and friendly staff!')).toBeInTheDocument();

    const closeBtn = screen.getByRole('button', { name: /close panel/i });
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalled();
  });
});
