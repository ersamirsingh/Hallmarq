import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '../context/ThemeContext';
import * as AuthContextModule from '../context/AuthContext';
import AdminDashboard from '../pages/admin/Dashboard';
import AdminUsers from '../pages/admin/Users';
import AdminStores from '../pages/admin/Stores';
import adminApi from '../api/admin.api';
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

describe('Admin Screens', () => {
  beforeEach(() => {
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: { id: 1, name: 'Admin Administrator User', role: 'ADMIN', emailVerified: true },
      setUser: vi.fn()
    });
  });

  it('renders Admin Dashboard statistics and chart', async () => {
    vi.spyOn(adminApi, 'getStats').mockResolvedValueOnce({
      stats: {
        totalUsers: 142,
        totalStores: 28,
        totalRatings: 560,
        dailyRatings: [{ date: '2026-10-01', count: 12 }]
      }
    });

    renderWithClient(<AdminDashboard />);

    expect(await screen.findByText('142')).toBeInTheDocument();
    expect(screen.getByText('28')).toBeInTheDocument();
    expect(screen.getByText('560')).toBeInTheDocument();
  });

  it('renders Admin Users list and opens Add User modal', async () => {
    vi.spyOn(adminApi, 'getUsers').mockResolvedValueOnce({
      users: [
        {
          id: 10,
          name: 'Jane Smith Test Customer',
          email: 'jane@example.com',
          address: '456 Elm Street',
          role: 'USER'
        }
      ],
      pagination: { page: 1, limit: 10, total: 1, totalPages: 1 }
    });

    renderWithClient(<AdminUsers />);

    expect(await screen.findByText('Jane Smith Test Customer')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();

    const addBtn = screen.getByRole('button', { name: /add user/i });
    fireEvent.click(addBtn);

    expect(screen.getByRole('heading', { name: /add new user/i })).toBeInTheDocument();
  });

  it('renders Admin Stores list and displays category chips', async () => {
    vi.spyOn(categoryApi, 'getCategories').mockResolvedValueOnce({
      categories: [{ id: 1, name: 'Restaurants' }, { id: 2, name: 'Retail' }]
    });

    vi.spyOn(adminApi, 'getStores').mockResolvedValueOnce({
      stores: [
        {
          id: 5,
          name: 'Central Cafe Roastery',
          email: 'central@cafe.com',
          address: '100 Main St',
          category: { name: 'Restaurants' },
          rating: { average: '4.8', count: 15 },
          owner: { name: 'Store Owner Bob' }
        }
      ],
      pagination: { page: 1, limit: 10, total: 1, totalPages: 1 }
    });

    renderWithClient(<AdminStores />);

    expect(await screen.findByText('Central Cafe Roastery')).toBeInTheDocument();
    expect(screen.getAllByText('Restaurants').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('4.8')).toBeInTheDocument();
  });
});
