import { useQuery } from '@tanstack/react-query';
import { Users, Store, Star } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { adminApi } from '../../api/admin.api';
import StatCard from '../../components/StatCard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Skeleton } from '../../components/ui';

export default function AdminDashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['adminStats'],
    queryFn: adminApi.getStats
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
        </div>
        <Skeleton className="h-80 rounded-xl" />
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
  const dailyRatings = stats.dailyRatings || stats.ratingsPerDay || [];

  const chartData = dailyRatings.map((item) => ({
    date: item?.date ? item.date.slice(5) : '',
    ratings: item?.count ?? 0
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          System dashboard
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Platform-wide overview of users, stores, and ratings activity
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <StatCard
          title="Total users"
          value={totalUsers.toLocaleString()}
          helperText="All registered platform accounts"
          icon={Users}
        />
        <StatCard
          title="Total stores"
          value={totalStores.toLocaleString()}
          helperText="Active businesses listed"
          icon={Store}
        />
        <StatCard
          title="Total ratings"
          value={totalRatings.toLocaleString()}
          helperText="Verified reviews submitted"
          icon={Star}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daily ratings activity</CardTitle>
          <CardDescription>Submitted customer reviews over the past 14 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-72 w-full pt-4">
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
    </div>
  );
}
