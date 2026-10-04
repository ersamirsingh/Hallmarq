import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Users, Store, Star, UserPlus, Plus, MessageSquare, TrendingUp, Sparkles, Building2, ShieldCheck, UserCheck, Activity } from 'lucide-react';
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
          <Skeleton className="h-10 w-64 rounded-xl" />
          <div className="flex gap-3">
            <Skeleton className="h-10 w-28 rounded-xl" />
            <Skeleton className="h-10 w-28 rounded-xl" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Skeleton className="h-80 rounded-2xl" />
          <Skeleton className="h-80 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
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
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              System dashboard
            </h1>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-500/20 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Pulse
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Real-time platform metrics, account management, and customer ratings
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" onClick={() => setIsAddUserOpen(true)}>
            <UserPlus className="h-4 w-4 mr-1.5 text-slate-500" />
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
                  <TrendingUp className="h-4 w-4 text-slate-700 dark:text-slate-300" />
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
                  <XAxis dataKey="date" stroke="#9A9A9A" fontSize={11} tickLine={false} />
                  <YAxis stroke="#9A9A9A" fontSize={11} allowDecimals={false} tickLine={false} />
                  <Tooltip
                    cursor={{ fill: 'rgba(108, 134, 255, 0.08)' }}
                    contentStyle={{
                      backgroundColor: '#0F0F0F',
                      color: '#FFFFFF',
                      borderRadius: '12px',
                      border: '1px solid #262626',
                      fontSize: '12px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
                    }}
                  />
                  <Bar dataKey="ratings" fill="#0f172a" radius={[6, 6, 0, 0]} className="dark:fill-[#6C86FF]" />
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
                  <Star className="h-4 w-4 text-amber-500 fill-amber-500 dark:text-[#FF7A3D] dark:fill-[#FF7A3D]" />
                  <span>Rating score distribution</span>
                </CardTitle>
                <CardDescription>Breakdown by star score across all submissions</CardDescription>
              </div>
              <div className="flex items-center gap-1.5 text-sm font-bold text-slate-900 dark:text-[#FFFFFF]">
                <span>{averageRating}</span>
                <span className="text-amber-500 dark:text-[#FF7A3D]">★</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3.5 pt-1">
              {ratingDistribution.map((item) => (
                <div key={item.stars} className="flex items-center gap-3">
                  <div className="w-12 text-xs font-semibold text-slate-700 dark:text-[#FFFFFF]">
                    {item.stars}
                  </div>
                  <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-[#262626]">
                    <div
                      className="h-full rounded-full bg-amber-400 dark:bg-[#FF7A3D] transition-all duration-500"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <div className="w-16 text-right text-xs font-medium text-slate-500 dark:text-[#9A9A9A]">
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
              <Users className="h-4 w-4 text-slate-700 dark:text-[#FFFFFF]" />
              <span>User accounts</span>
            </CardTitle>
            <CardDescription>Platform accounts grouped by role</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div
              onClick={() => navigate('/admin/users')}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50/80 hover:bg-slate-100 cursor-pointer transition dark:bg-[#151515] dark:hover:bg-[#1A1A1A] border border-slate-100 dark:border-[#262626]"
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-600 dark:bg-[#6C86FF]/[0.18] dark:text-[#6C86FF] flex items-center justify-center font-bold">
                  <UserCheck className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-900 dark:text-[#FFFFFF]">Normal Users</p>
                  <p className="text-[11px] text-slate-400 dark:text-[#9A9A9A]">Browsers & raters</p>
                </div>
              </div>
              <Badge variant="default" size="sm">
                {userBreakdown.USER || 0}
              </Badge>
            </div>

            <div
              onClick={() => navigate('/admin/users')}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50/80 hover:bg-slate-100 cursor-pointer transition dark:bg-[#151515] dark:hover:bg-[#1A1A1A] border border-slate-100 dark:border-[#262626]"
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-600 dark:bg-[#FF7A3D]/[0.18] dark:text-[#FF7A3D] flex items-center justify-center font-bold">
                  <Building2 className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-900 dark:text-[#FFFFFF]">Store Owners</p>
                  <p className="text-[11px] text-slate-400 dark:text-[#9A9A9A]">Business managers</p>
                </div>
              </div>
              <Badge variant="warning" size="sm">
                {userBreakdown.OWNER || 0}
              </Badge>
            </div>

            <div
              onClick={() => navigate('/admin/users')}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50/80 hover:bg-slate-100 cursor-pointer transition dark:bg-slate-800/40 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800"
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-900 dark:text-white">Administrators</p>
                  <p className="text-[11px] text-slate-400">System supervisors</p>
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
                  <MessageSquare className="h-4 w-4 text-slate-700 dark:text-slate-300" />
                  <span>Recent customer reviews</span>
                </CardTitle>
                <CardDescription>Latest customer feedback across all active stores</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setIsRatingsModalOpen(true)}>
                <span>View all</span>
                <span className="ml-1 text-xs text-slate-400">({totalRatings})</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentRatings.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                No ratings submitted yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentRatings.slice(0, 5).map((r) => (
                  <div key={r.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-slate-900 dark:text-white">
                          {r.user?.name || 'Customer'}
                        </span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                          {r.store?.name || 'Store'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 italic line-clamp-1">
                        "{r.comment || 'No comment provided'}"
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3.5 w-3.5 ${
                              i < r.value ? 'fill-amber-400 text-amber-400' : 'text-slate-200 dark:text-slate-700'
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
              <Skeleton className="h-16 w-full rounded-xl" />
              <Skeleton className="h-16 w-full rounded-xl" />
              <Skeleton className="h-16 w-full rounded-xl" />
            </div>
          ) : modalRatings.length === 0 ? (
            <p className="text-center text-sm text-slate-500 py-8">No ratings recorded.</p>
          ) : (
            modalRatings.map((r) => (
              <div
                key={r.id}
                className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-850/60 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {r.user?.name || 'Customer'}
                    </span>
                    <span className="text-xs text-slate-400">({r.user?.email || 'N/A'})</span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < r.value ? 'fill-amber-400 text-amber-400' : 'text-slate-200 dark:text-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    Store: {r.store?.name || 'Store'}
                  </span>
                  <span className="text-slate-400">
                    {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ''}
                  </span>
                </div>
                {r.comment && (
                  <p className="text-xs text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 leading-relaxed">
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
