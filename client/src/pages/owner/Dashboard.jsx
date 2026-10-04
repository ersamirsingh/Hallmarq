import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Store, Star, Edit3, User, Calendar, MessageSquare, CheckCircle, MapPin, Mail } from 'lucide-react';
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
        <Skeleton className="h-12 w-64 rounded-xl" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Skeleton className="h-48 rounded-2xl" />
          <Skeleton className="h-48 rounded-2xl" />
        </div>
        <Skeleton className="h-72 rounded-2xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
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
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-[#262626] dark:bg-[#0F0F0F] relative overflow-hidden">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm dark:bg-[#6C86FF] dark:text-[#111111]">
              <Store className="h-6 w-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-[#FFFFFF]">
                  {store.name}
                </h1>
                <Badge variant="category">{store.category?.name || 'Store'}</Badge>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                  <CheckCircle className="h-3 w-3" />
                  Verified Business
                </span>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-[#9A9A9A]">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-slate-400 dark:text-[#9A9A9A]" />
                  {store.address}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5 text-slate-400 dark:text-[#9A9A9A]" />
                  {store.email}
                </span>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleOpenRename}
            className="gap-1.5 shrink-0"
          >
            <Edit3 className="h-3.5 w-3.5" />
            <span>Rename store</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <CardTitle>Average rating</CardTitle>
            <CardDescription>Overall performance from verified reviews</CardDescription>
          </CardHeader>
          <CardContent className="py-6">
            <div className="flex items-center gap-5">
              <span className="text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white tabular-nums">
                {average}
              </span>
              <div className="space-y-1.5">
                <StarRating value={Number(average)} size="lg" />
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Based on {count} {count === 1 ? 'verified review' : 'verified reviews'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rating distribution</CardTitle>
            <CardDescription>Breakdown by star score across all submissions</CardDescription>
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
              <CardDescription>User-by-user ratings and detailed feedback</CardDescription>
            </div>
            <span className="text-xs font-semibold text-slate-500 dark:text-[#9A9A9A]">
              {count} {count === 1 ? 'review' : 'reviews'}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          {!ratersList || ratersList.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-500 dark:text-[#9A9A9A]">
              No customer ratings submitted for your store yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-[#262626]">
              {ratersList.map((r) => {
                const userName = r.user?.name || r.name || 'Verified Customer';
                const userEmail = r.user?.email || r.email || '';
                const reviewDate = r.createdAt || r.ratedAt;

                return (
                  <div key={r.id || r.email || Math.random()} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-900 dark:bg-[#1A1A1A] dark:text-[#6C86FF] font-bold text-xs shadow-xs">
                          {userName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-[#FFFFFF]">
                            {userName}
                          </p>
                          {userEmail && (
                            <p className="text-xs text-slate-400 dark:text-[#9A9A9A]">
                              {userEmail}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                          <StarRating value={r.value} size="sm" />
                          <span className="text-xs font-bold text-slate-800 dark:text-[#FFFFFF]">
                            {r.value} / 5
                          </span>
                        </div>
                        {reviewDate && (
                          <span className="text-xs text-slate-400 dark:text-[#9A9A9A]">
                            {new Date(reviewDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    {r.comment && (
                      <div className="mt-3 ml-12 rounded-xl bg-slate-50/80 p-3.5 text-xs text-slate-700 dark:bg-[#151515] dark:text-[#FFFFFF] leading-relaxed border border-slate-100 dark:border-[#262626]">
                        "{r.comment}"
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>

        {pagination && pagination.totalPages > 1 && (
          <div className="border-t border-slate-100 px-6 dark:border-[#262626]">
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
            placeholder="Enter new business name"
            maxLength={100}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => setIsRenameOpen(false)}
              disabled={isRenaming}
            >
              Cancel
            </Button>
            <Button type="submit" loading={isRenaming}>
              Save changes
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
