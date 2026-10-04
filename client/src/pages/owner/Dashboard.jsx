import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Store, Star, Edit3, User, Calendar, MessageSquare } from 'lucide-react';
import { ownerApi } from '../../api/owner.api';
import StarRating from '../../components/StarRating';
import RatingDistribution from '../../components/RatingDistribution';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
  Button,
  Input,
  Modal,
  Pagination,
  EmptyState,
  Skeleton
} from '../../components/ui';
import { toast } from 'sonner';

export default function OwnerDashboard() {
  const [page, setPage] = useState(1);
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [isRenaming, setIsRenaming] = useState(false);

  const { data, isLoading, error, refetch } = useQuery({
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

  const count = store.rating?.count ?? data?.ratingCount ?? 0;
  const average = store.rating?.average ?? data?.averageRating ?? '0.0';
  const distribution = store.rating?.distribution || data?.distribution || {};
  const ratersList = store.raters || data?.raters?.data || [];
  const pagination = store.pagination || data?.raters?.meta;

  const handleOpenRename = () => {
    setNewName(store.name || '');
    setIsRenameOpen(true);
  };

  const handleSaveRename = async (e) => {
    e.preventDefault();
    if (!newName.trim()) {
      toast.error('Store name cannot be empty.');
      return;
    }
    setIsRenaming(true);
    try {
      await ownerApi.updateStoreName(newName.trim());
      toast.success('Store renamed successfully.');
      setIsRenameOpen(false);
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to rename store.');
    } finally {
      setIsRenaming(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {store.name}
            </h1>
            <Badge variant="secondary">{store.category?.name || 'Store'}</Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenRename}
              className="gap-1.5"
            >
              <Edit3 className="h-3.5 w-3.5" />
              <span>Rename</span>
            </Button>
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
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Customer ratings and reviews</CardTitle>
              <CardDescription>Ratings and written reviews submitted by customers</CardDescription>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {count} total
            </span>
          </div>
        </CardHeader>
        <CardContent>
          {!ratersList || ratersList.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
              No customer ratings submitted for your store yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {ratersList.map((r) => {
                const userName = r.user?.name || r.name || 'Verified Customer';
                const userEmail = r.user?.email || r.email || '';
                const reviewDate = r.createdAt || r.ratedAt;

                return (
                  <div key={r.id || r.email || Math.random()} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 font-semibold text-xs">
                          {userName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">
                            {userName}
                          </p>
                          {userEmail && (
                            <p className="text-xs text-slate-400">
                              {userEmail}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                          <StarRating value={r.value} size="sm" />
                          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            {r.value} / 5
                          </span>
                        </div>
                        {reviewDate && (
                          <span className="text-xs text-slate-400">
                            {new Date(reviewDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    {r.comment && (
                      <div className="mt-2.5 ml-10 rounded-lg bg-slate-50 p-3 text-xs text-slate-700 dark:bg-slate-800/60 dark:text-slate-300 leading-relaxed border border-slate-100 dark:border-slate-800">
                        {r.comment}
                      </div>
                    )}
                  </div>
                );
              })}
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

      <Modal
        isOpen={isRenameOpen}
        onClose={() => setIsRenameOpen(false)}
        title="Rename your store"
      >
        <form onSubmit={handleSaveRename} className="space-y-4">
          <Input
            label="Store name"
            required
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Enter store name"
            maxLength={100}
            helperText="Between 3 and 100 characters"
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsRenameOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isRenaming}
            >
              {isRenaming ? 'Saving...' : 'Save changes'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
