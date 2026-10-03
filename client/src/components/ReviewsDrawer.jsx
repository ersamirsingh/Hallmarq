import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MessageSquare } from 'lucide-react';
import { storesApi } from '../api/stores.api';
import { Drawer, EmptyState, Pagination, SkeletonRow } from './ui';
import StarRating from './StarRating';

export default function ReviewsDrawer({ isOpen, onClose, store }) {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['storeReviews', store?.id, page],
    queryFn: () => storesApi.getStoreReviews(store.id, { page, limit: 10 }),
    enabled: Boolean(isOpen && store?.id)
  });

  if (!store) return null;

  const reviews = data?.reviews || [];
  const pagination = data?.pagination;

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title={`Reviews: ${store.name}`} width="max-w-lg">
      <div className="space-y-6">
        <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900/50">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Average store rating</span>
          <div className="mt-1 flex items-center gap-3">
            <StarRating value={Number(store.rating?.average) || 0} size="md" />
            <span className="text-lg font-bold text-slate-900 dark:text-white">
              {store.rating?.average || '0.0'}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              ({store.rating?.count || 0} customer reviews)
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Customer feedback
          </h3>

          {isLoading ? (
            <div className="space-y-3">
              <SkeletonRow cols={2} />
              <SkeletonRow cols={2} />
              <SkeletonRow cols={2} />
            </div>
          ) : reviews.length === 0 ? (
            <EmptyState
              icon={MessageSquare}
              title="No reviews yet"
              description="Be the first verified customer to submit a rating and comment for this store."
            />
          ) : (
            <div className="space-y-3">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                      {rev.user?.name || 'Anonymous User'}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-2">
                    <StarRating value={rev.value} size="sm" />
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                      {rev.value} / 5
                    </span>
                  </div>
                  {rev.comment && (
                    <p className="mt-2.5 text-xs text-slate-600 leading-relaxed dark:text-slate-300">
                      {rev.comment}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {pagination && pagination.totalPages > 1 && (
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={(p) => setPage(p)}
          />
        )}
      </div>
    </Drawer>
  );
}
