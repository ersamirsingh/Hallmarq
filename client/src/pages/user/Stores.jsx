import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Store as StoreIcon } from 'lucide-react';
import { storesApi } from '../../api/stores.api';
import { categoryApi } from '../../api/category.api';
import useDebounce from '../../hooks/useDebounce';
import StoreCard from './StoreCard';
import RateStoreModal from '../../components/RateStoreModal';
import ReviewsDrawer from '../../components/ReviewsDrawer';
import CategoryChips from '../../components/CategoryChips';
import { Input, Select, Pagination, SkeletonCard, EmptyState } from '../../components/ui';

export default function Stores() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('top');
  const [ratingStore, setRatingStore] = useState(null);
  const [reviewsStore, setReviewsStore] = useState(null);

  const debouncedSearch = useDebounce(search, 300);

  const { data: catData } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryApi.getCategories
  });

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['stores', page, debouncedSearch, category, sort],
    queryFn: () =>
      storesApi.getStores({
        page,
        limit: 9,
        search: debouncedSearch || undefined,
        category: category || undefined,
        sort
      })
  });

  const stores = data?.stores || data?.data || [];
  const pagination = data?.pagination || data?.meta;
  const categories = catData?.categories || catData?.data || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Explore stores
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Discover local businesses and share your rating experience
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Input
            placeholder="Search stores by name or address..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        </div>
        <div className="w-full sm:w-56">
          <Select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1);
            }}
            options={[
              { value: 'all', label: 'All stores' },
              { value: 'top', label: 'Top rated' },
              { value: 'highest', label: 'Highest rated' },
              { value: 'newest', label: 'Newest first' },
              { value: 'name', label: 'Name (A–Z)' }
            ]}
          />
        </div>
      </div>

      <CategoryChips
        categories={categories}
        selectedCategory={category}
        onSelect={(c) => {
          setCategory(c);
          setPage(1);
        }}
      />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : stores.length === 0 ? (
        <EmptyState
          icon={StoreIcon}
          title="No stores found"
          description="Try changing your search terms or selecting a different category."
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stores.map((s) => (
            <StoreCard
              key={s.id}
              store={s}
              onRate={(store) => setRatingStore(store)}
              onViewReviews={(store) => setReviewsStore(store)}
            />
          ))}
        </div>
      )}

      {pagination && pagination.totalPages > 1 && (
        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={(p) => setPage(p)}
        />
      )}

      <RateStoreModal
        isOpen={Boolean(ratingStore)}
        onClose={() => setRatingStore(null)}
        store={ratingStore}
        onSuccess={() => refetch()}
      />

      <ReviewsDrawer
        isOpen={Boolean(reviewsStore)}
        onClose={() => setReviewsStore(null)}
        store={reviewsStore}
      />
    </div>
  );
}
