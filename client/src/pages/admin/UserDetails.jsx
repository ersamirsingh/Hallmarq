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
        <Skeleton className="h-8 w-48 rounded-xl" />
        <Skeleton className="h-64 rounded-2xl" />
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
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
          User not found or failed to load user details.
        </div>
      </div>
    );
  }

  const { user } = data;
  const isOwner = user.role === 'OWNER' || user.role === 'STORE_OWNER';
  const storeInfo = user.store || user.ownedStore || (user.storeName ? { name: user.storeName, rating: { average: user.storeRating } } : null);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/admin/users">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            <span>Back to users</span>
          </Button>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-[#FFFFFF]">
          User details
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Account profile</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant={user.role === 'ADMIN' ? 'danger' : user.role === 'OWNER' || user.role === 'STORE_OWNER' ? 'warning' : 'default'}>
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
              <span className="text-xs font-semibold text-slate-500 dark:text-[#9A9A9A]">Full name</span>
              <p className="mt-0.5 text-sm font-medium text-slate-900 dark:text-[#FFFFFF]">{user.name}</p>
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 dark:text-[#9A9A9A]">Email address</span>
              <p className="mt-0.5 text-sm font-medium text-slate-900 dark:text-[#FFFFFF]">{user.email}</p>
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 dark:text-[#9A9A9A]">Physical address</span>
              <p className="mt-0.5 text-sm font-medium text-slate-900 dark:text-[#FFFFFF]">{user.address || '—'}</p>
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 dark:text-[#9A9A9A]">Member since</span>
              <p className="mt-0.5 text-sm font-medium text-slate-900 dark:text-[#FFFFFF]">
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
              {storeInfo ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-900 dark:bg-[#1A1A1A] dark:text-[#6C86FF]">
                      <Store className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-[#FFFFFF]">{storeInfo.name}</h4>
                      {storeInfo.category?.name && (
                        <p className="text-xs text-slate-500 dark:text-[#9A9A9A]">{storeInfo.category.name}</p>
                      )}
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200/90 bg-slate-50/70 p-4 dark:border-[#262626] dark:bg-[#151515]">
                    <span className="text-xs font-semibold text-slate-500 dark:text-[#9A9A9A]">Store rating</span>
                    <div className="mt-1 flex items-center gap-2">
                      <div className="flex items-center text-[#FF7A3D]">
                        <Star className="h-5 w-5 fill-[#FF7A3D] text-[#FF7A3D]" />
                        <span className="ml-1.5 text-xl font-bold text-slate-900 dark:text-[#FFFFFF]">
                          {storeInfo.rating?.average || user.storeRating || '0.0'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-sm text-slate-500 dark:text-[#9A9A9A]">
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
