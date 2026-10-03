import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '../context/ThemeContext';
import * as AuthContextModule from '../context/AuthContext';
import StarRating from '../components/StarRating';
import StoreCard from '../pages/user/StoreCard';
import Stores from '../pages/user/Stores';
import storesApi from '../api/stores.api';
import categoryApi from '../api/category.api';

function renderWithClient(ui) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }
  });
  return render(
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>{ui}</MemoryRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

describe('Stores and Ratings', () => {
  beforeEach(() => {
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: { id: 2, name: 'Normal Customer', role: 'USER', emailVerified: true },
      setUser: vi.fn()
    });
  });

  it('renders interactive StarRating and handles selection', () => {
    const onChange = vi.fn();
    render(<StarRating value={3} onChange={onChange} interactive />);

    const star4 = screen.getByLabelText('4 stars');
    fireEvent.click(star4);

    expect(onChange).toHaveBeenCalledWith(4);
  });

  it('renders StoreCard with rating metrics and user rating status', () => {
    const onRate = vi.fn();
    const onViewReviews = vi.fn();
    const mockStore = {
      id: 1,
      name: 'Downtown Bookstore',
      address: '789 Market Ave',
      category: { name: 'Books' },
      rating: { average: '4.7', count: 42 },
      myRating: { value: 5, comment: 'Loved it!' }
    };

    render(
      <StoreCard
        store={mockStore}
        onRate={onRate}
        onViewReviews={onViewReviews}
      />
    );

    expect(screen.getByText('Downtown Bookstore')).toBeInTheDocument();
    expect(screen.getByText('4.7')).toBeInTheDocument();
    expect(screen.getByText('(42)')).toBeInTheDocument();
    expect(screen.getByText('5 / 5 stars')).toBeInTheDocument();

    const changeBtn = screen.getByRole('button', { name: /change rating/i });
    fireEvent.click(changeBtn);
    expect(onRate).toHaveBeenCalledWith(mockStore);
  });

  it('renders Stores discovery page and triggers rating modal', async () => {
    vi.spyOn(categoryApi, 'getCategories').mockResolvedValueOnce({
      categories: [{ id: 1, name: 'Cafes' }]
    });

    vi.spyOn(storesApi, 'getStores').mockResolvedValueOnce({
      stores: [
        {
          id: 2,
          name: 'Artisan Bakery',
          address: '42 Baker St',
          category: { name: 'Cafes' },
          rating: { average: '4.9', count: 18 },
          myRating: null
        }
      ],
      pagination: { page: 1, limit: 9, total: 1, totalPages: 1 }
    });

    renderWithClient(<Stores />);

    expect(await screen.findByText('Artisan Bakery')).toBeInTheDocument();
    expect(screen.getByText('Not rated yet')).toBeInTheDocument();

    const rateBtn = screen.getByRole('button', { name: /rate store/i });
    fireEvent.click(rateBtn);

    expect(screen.getByRole('heading', { name: /rate artisan bakery/i })).toBeInTheDocument();
  });
});
