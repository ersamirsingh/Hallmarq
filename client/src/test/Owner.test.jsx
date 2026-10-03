import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '../context/ThemeContext';
import * as AuthContextModule from '../context/AuthContext';
import RatingDistribution from '../components/RatingDistribution';
import OwnerDashboard from '../pages/owner/Dashboard';
import ownerApi from '../api/owner.api';

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

describe('Owner Dashboard', () => {
  beforeEach(() => {
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: { id: 3, name: 'Store Owner Chris', role: 'STORE_OWNER', emailVerified: true },
      setUser: vi.fn()
    });
  });

  it('renders RatingDistribution bars correctly', () => {
    const distribution = { '5': 10, '4': 5, '3': 2, '2': 1, '1': 2 };
    render(<RatingDistribution distribution={distribution} total={20} />);

    expect(screen.getByText('(50%)')).toBeInTheDocument();
    expect(screen.getByText('(25%)')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('renders empty state when store owner has no store assigned', async () => {
    vi.spyOn(ownerApi, 'getDashboard').mockResolvedValueOnce({ store: null });

    renderWithClient(<OwnerDashboard />);

    expect(await screen.findByText('No store assigned yet')).toBeInTheDocument();
    expect(
      screen.getByText(/please contact your system administrator/i)
    ).toBeInTheDocument();
  });

  it('renders assigned store details, ratings, and customer raters', async () => {
    vi.spyOn(ownerApi, 'getDashboard').mockResolvedValueOnce({
      store: {
        id: 1,
        name: 'The Artisan Bakery',
        email: 'artisan@bakery.com',
        address: '100 Baker Street',
        category: { name: 'Bakery' },
        rating: {
          average: '4.6',
          count: 5,
          distribution: { '5': 3, '4': 2, '3': 0, '2': 0, '1': 0 }
        },
        raters: [
          {
            id: 21,
            value: 5,
            comment: 'Crispy sourdough and great coffee!',
            createdAt: '2026-10-02T10:00:00Z',
            user: { id: 4, name: 'Emma Foodie' }
          }
        ],
        pagination: { page: 1, limit: 10, total: 1, totalPages: 1 }
      }
    });

    renderWithClient(<OwnerDashboard />);

    expect(await screen.findByText('The Artisan Bakery')).toBeInTheDocument();
    expect(screen.getByText('4.6')).toBeInTheDocument();
    expect(screen.getByText('Emma Foodie')).toBeInTheDocument();
    expect(screen.getByText('Crispy sourdough and great coffee!')).toBeInTheDocument();
  });
});
