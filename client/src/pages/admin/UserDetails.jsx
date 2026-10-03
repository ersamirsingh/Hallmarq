import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Store, Star } from 'lucide-react';
import { adminApi } from '../../api/admin.api';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Badge, Skeleton, Button } from '../../components/ui';

export default function UserDetails() {
  const { id } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ['adminUserDetails', id],
    queryFn: () => adminApi.getUserDetails(id)
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  if (error || !data?.user) {
    return (
      <div className="space-y-4">
        <Link to="/admin/users">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            <span>Back to users</span>
          </Button>
        </Link>
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
          User not found or failed to load user details.
        </div>
      </div>
    );
  }

  const { user } = data;
  const isOwner = user.role === 'STORE_OWNER';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/admin/users">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            <span>Back to users</span>
          </Button>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          User details
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Account profile</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant={user.role === 'ADMIN' ? 'danger' : user.role === 'STORE_OWNER' ? 'warning' : 'default'}>
                  {user.role}
                </Badge>
                <Badge variant={user.emailVerified ? 'success' : 'secondary'}>
                  {user.emailVerified ? 'Verified' : 'Unverified'}
                </Badge>
              </div>
            </div>
            <CardDescription>System credentials and personal data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Full name</span>
              <p className="mt-0.5 text-sm font-medium text-slate-900 dark:text-white">{user.name}</p>
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Email address</span>
              <p className="mt-0.5 text-sm font-medium text-slate-900 dark:text-white">{user.email}</p>
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Physical address</span>
              <p className="mt-0.5 text-sm font-medium text-slate-900 dark:text-white">{user.address || '—'}</p>
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Member since</span>
              <p className="mt-0.5 text-sm font-medium text-slate-900 dark:text-white">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>

        {isOwner && (
          <Card>
            <CardHeader>
              <CardTitle>Owned store</CardTitle>
              <CardDescription>Associated business and customer feedback</CardDescription>
            </CardHeader>
            <CardContent>
              {user.store ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                      <Store className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white">{user.store.name}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{user.store.category?.name}</p>
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Store rating</span>
                    <div className="mt-1 flex items-center gap-2">
                      <div className="flex items-center text-amber-500">
                        <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                        <span className="ml-1.5 text-xl font-bold text-slate-900 dark:text-white">
                          {user.store.rating?.average || '0.0'}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        ({user.store.rating?.count || 0} reviews)
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                  No store is currently assigned to this store owner.
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
