import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Users, Store, Star, UserPlus, Plus, MessageSquare, TrendingUp, Sparkles, Building2, ShieldCheck, UserCheck } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { adminApi } from '../../api/admin.api';
import StatCard from '../../components/StatCard';
import AddUserModal from './AddUserModal';
import AddStoreModal from './AddStoreModal';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Skeleton, Button, Badge, Modal } from '../../components/ui';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isAddStoreOpen, setIsAddStoreOpen] = useState(false);
  const [isRatingsModalOpen, setIsRatingsModalOpen] = useState(false);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['adminStats'],
    queryFn: adminApi.getStats
  });

  const { data: ratingsData, isLoading: ratingsLoading } = useQuery({
    queryKey: ['adminRatingsList'],
    queryFn: () => adminApi.getRatings({ limit: 50 }),
    enabled: isRatingsModalOpen
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-64 rounded-lg" />
          <div className="flex gap-3">
            <Skeleton className="h-10 w-28 rounded-lg" />
            <Skeleton className="h-10 w-28 rounded-lg" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Skeleton className="h-80 rounded-xl" />
          <Skeleton className="h-80 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
        Failed to load administrator statistics.
      </div>
    );
  }

  const stats = data?.stats || data || {};
  const totalUsers = stats.totalUsers ?? 0;
  const totalStores = stats.totalStores ?? 0;
  const totalRatings = stats.totalRatings ?? 0;
  const averageRating = stats.averageRating ?? 0;
  const dailyRatings = stats.dailyRatings || stats.ratingsPerDay || [];
  const ratingDistribution = stats.ratingDistribution || stats.ratingBreakdown || [];
  const userBreakdown = stats.userBreakdown || { USER: 0, OWNER: 0, ADMIN: 0 };
  const categoryBreakdown = stats.categoryBreakdown || [];
  const recentRatings = stats.recentRatings || [];

  const chartData = dailyRatings.map((item) => ({
    date: item?.date ? item.date.slice(5) : '',
    ratings: item?.count ?? 0
  }));

  const modalRatings = ratingsData?.ratings || ratingsData?.data || recentRatings;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>System dashboard</span>
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-950/60 dark:text-emerald-300">
              Live
            </span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Platform-wide metrics, activity breakdown, and live operations
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" onClick={() => setIsAddUserOpen(true)}>
            <UserPlus className="h-4 w-4 mr-1.5 text-indigo-600 dark:text-indigo-400" />
            <span>Add user</span>
          </Button>
          <Button onClick={() => setIsAddStoreOpen(true)}>
            <Plus className="h-4 w-4 mr-1.5" />
            <span>Add store</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <StatCard
          title="Total users"
          value={totalUsers.toLocaleString()}
          helperText="Click to manage & view users →"
          icon={Users}
          onClick={() => navigate('/admin/users')}
        />
        <StatCard
          title="Total stores"
          value={totalStores.toLocaleString()}
          helperText="Click to manage & view stores →"
          icon={Store}
          onClick={() => navigate('/admin/stores')}
        />
        <StatCard
          title="Total ratings"
          value={totalRatings.toLocaleString()}
          helperText={`Avg ${averageRating} ★ · Click to view reviews →`}
          icon={Star}
          onClick={() => setIsRatingsModalOpen(true)}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-base">
                  <TrendingUp className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Ratings activity trend</span>
                </CardTitle>
                <CardDescription>Submitted reviews over the past 14 days</CardDescription>
              </div>
              <Badge variant="secondary" size="sm">
                14-Day View
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} allowDecimals={false} tickLine={false} />
                  <Tooltip
                    cursor={{ fill: 'rgba(99, 102, 241, 0.08)' }}
                    contentStyle={{
                      borderRadius: '8px',
                      borderColor: '#cbd5e1',
                      fontSize: '12px'
                    }}
                  />
                  <Bar dataKey="ratings" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                  <span>Rating score distribution</span>
                </CardTitle>
                <CardDescription>Breakdown across 1-star to 5-star customer ratings</CardDescription>
              </div>
              <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-800 dark:text-slate-100">
                <span>{averageRating}</span>
                <span className="text-amber-500">★</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3.5 pt-1">
              {ratingDistribution.map((item) => (
                <div key={item.stars} className="flex items-center gap-3">
                  <div className="w-12 text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {item.stars}
                  </div>
                  <div className="relative h-3 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full bg-amber-400 transition-all duration-500"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <div className="w-16 text-right text-xs font-medium text-slate-500 dark:text-slate-400">
                    {item.count} ({item.percentage}%)
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <span>User account breakdown</span>
            </CardTitle>
            <CardDescription>Registered accounts grouped by access role</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              onClick={() => navigate('/admin/users')}
              className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100/80 cursor-pointer transition dark:bg-slate-800/40 dark:hover:bg-slate-800"
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                  <UserCheck className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">Normal Users</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Browsers & reviewers</p>
                </div>
              </div>
              <Badge variant="default" size="sm">
                {userBreakdown.USER || 0}
              </Badge>
            </div>

            <div
              onClick={() => navigate('/admin/users')}
              className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100/80 cursor-pointer transition dark:bg-slate-800/40 dark:hover:bg-slate-800"
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                  <Building2 className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">Store Owners</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Store managers</p>
                </div>
              </div>
              <Badge variant="warning" size="sm">
                {userBreakdown.OWNER || 0}
              </Badge>
            </div>

            <div
              onClick={() => navigate('/admin/users')}
              className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100/80 cursor-pointer transition dark:bg-slate-800/40 dark:hover:bg-slate-800"
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-rose-100 flex items-center justify-center text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">Administrators</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Full platform control</p>
                </div>
              </div>
              <Badge variant="danger" size="sm">
                {userBreakdown.ADMIN || 0}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Recent customer reviews</span>
                </CardTitle>
                <CardDescription>Latest feedback submitted across all stores</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setIsRatingsModalOpen(true)}>
                <span>View all</span>
                <span className="ml-1 text-xs text-indigo-600 dark:text-indigo-400">({totalRatings})</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentRatings.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                No ratings submitted yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {recentRatings.slice(0, 5).map((r) => (
                  <div key={r.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-slate-900 dark:text-white">
                          {r.user?.name || 'Customer'}
                        </span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                          {r.store?.name || 'Store'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 italic line-clamp-1">
                        "{r.comment || 'No comment provided'}"
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3.5 w-3.5 ${
                              i < r.value ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-600'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-slate-400">
                        {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ''}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Modal
        isOpen={isRatingsModalOpen}
        onClose={() => setIsRatingsModalOpen(false)}
        title="All platform ratings & customer reviews"
      >
        <div className="space-y-3 max-h-[65vh] overflow-y-auto pr-1">
          {ratingsLoading ? (
            <div className="space-y-3 py-4">
              <Skeleton className="h-16 w-full rounded-lg" />
              <Skeleton className="h-16 w-full rounded-lg" />
              <Skeleton className="h-16 w-full rounded-lg" />
            </div>
          ) : modalRatings.length === 0 ? (
            <p className="text-center text-sm text-slate-500 py-8">No ratings recorded.</p>
          ) : (
            modalRatings.map((r) => (
              <div
                key={r.id}
                className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/50 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {r.user?.name || 'Customer'}
                    </span>
                    <span className="text-xs text-slate-400">({r.user?.email || 'N/A'})</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < r.value ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-indigo-600 dark:text-indigo-400">
                    Store: {r.store?.name || 'Store'}
                  </span>
                  <span className="text-slate-400">
                    {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ''}
                  </span>
                </div>
                {r.comment && (
                  <p className="text-xs text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800/80 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                    "{r.comment}"
                  </p>
                )}
              </div>
            ))
          )}
        </div>
        <div className="mt-4 flex justify-end">
          <Button variant="outline" onClick={() => setIsRatingsModalOpen(false)}>
            Close
          </Button>
        </div>
      </Modal>

      <AddUserModal
        isOpen={isAddUserOpen}
        onClose={() => setIsAddUserOpen(false)}
        onSuccess={() => refetch()}
      />

      <AddStoreModal
        isOpen={isAddStoreOpen}
        onClose={() => setIsAddStoreOpen(false)}
        onSuccess={() => refetch()}
      />
    </div>
  );
}
