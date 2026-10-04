import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MessageSquare, Star } from 'lucide-react';
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

  const reviews = data?.reviews || data?.data || [];
  const pagination = data?.pagination || data?.meta;

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title={`Reviews: ${store.name}`} width="max-w-lg">
      <div className="space-y-6">
        <div className="rounded-2xl border border-slate-200/90 bg-slate-50/80 p-4 dark:border-[#262626] dark:bg-[#151515]">
          <span className="text-xs font-semibold text-slate-500 dark:text-[#9A9A9A]">Average store rating</span>
          <div className="mt-1 flex items-center gap-3">
            <StarRating value={Number(store.rating?.average) || 0} size="md" />
            <span className="text-lg font-bold text-slate-900 dark:text-[#FFFFFF]">
              {store.rating?.average || '0.0'}
            </span>
            <span className="text-xs text-slate-500 dark:text-[#9A9A9A]">
              ({store.rating?.count || 0} customer reviews)
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-[#FFFFFF]">
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
                  className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm dark:border-[#262626] dark:bg-[#0F0F0F]"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-900 dark:text-[#FFFFFF]">
                      {rev.user?.name || 'Verified Customer'}
                    </span>
                    <span className="text-[11px] text-slate-400 dark:text-[#9A9A9A]">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-2">
                    <StarRating value={rev.value} size="sm" />
                    <span className="text-xs font-bold text-amber-500 dark:text-[#FF7A3D]">
                      {rev.value} / 5
                    </span>
                  </div>
                  {rev.comment && (
                    <p className="mt-2.5 text-xs text-slate-600 leading-relaxed dark:text-[#9A9A9A]">
                      "{rev.comment}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {pagination && pagination.totalPages > 1 && (
          <div className="border-t border-slate-100 pt-3 dark:border-[#262626]">
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        )}
      </div>
    </Drawer>
  );
}
