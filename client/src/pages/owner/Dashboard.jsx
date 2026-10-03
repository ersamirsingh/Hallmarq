import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Store, Star, MessageSquare } from 'lucide-react';
import { ownerApi } from '../../api/owner.api';
import StarRating from '../../components/StarRating';
import RatingDistribution from '../../components/RatingDistribution';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Badge, Pagination, EmptyState, Skeleton } from '../../components/ui';

export default function OwnerDashboard() {
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ['ownerDashboard', page],
    queryFn: () => ownerApi.getDashboard({ page, limit: 10 })
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
        </div>
        <Skeleton className="h-72 rounded-xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
        Failed to load owner dashboard.
      </div>
    );
  }

  const store = data?.store;

  if (!store) {
    return (
      <EmptyState
        icon={Store}
        title="No store assigned yet"
        description="You do not currently manage an active store. Please contact your system administrator to associate your account with your business."
      />
    );
  }

  const { rating, raters, pagination } = store;
  const count = rating?.count || 0;
  const average = rating?.average || '0.0';
  const distribution = rating?.distribution || {};

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {store.name}
            </h1>
            <Badge variant="secondary">{store.category?.name || 'Store'}</Badge>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {store.address} • {store.email}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <CardTitle>Average rating</CardTitle>
            <CardDescription>Overall performance from verified reviews</CardDescription>
          </CardHeader>
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <span className="text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {average}
              </span>
              <div className="space-y-1">
                <StarRating value={Number(average)} size="lg" />
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Based on {count} {count === 1 ? 'rating' : 'ratings'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rating distribution</CardTitle>
            <CardDescription>Breakdown by star score</CardDescription>
          </CardHeader>
          <CardContent>
            <RatingDistribution distribution={distribution} total={count} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer ratings and reviews</CardTitle>
          <CardDescription>List of all users who rated your business</CardDescription>
        </CardHeader>
        <CardContent>
          {!raters || raters.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
              No customer ratings submitted for your store yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {raters.map((r) => (
                <div key={r.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                      {r.user?.name || 'Customer'}
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <StarRating value={r.value} size="sm" />
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                      {r.value} / 5
                    </span>
                  </div>
                  {r.comment && (
                    <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {r.comment}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>

        {pagination && pagination.totalPages > 1 && (
          <div className="border-t border-slate-100 px-6 dark:border-slate-800">
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        )}
      </Card>
    </div>
  );
}
