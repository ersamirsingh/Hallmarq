import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { UserPlus, Search, Eye, Users as UsersIcon } from 'lucide-react';
import { adminApi } from '../../api/admin.api';
import useDebounce from '../../hooks/useDebounce';
import AddUserModal from './AddUserModal';
import { Button, Input, Select, Badge, Card, Pagination, SortableTh, SkeletonRow, EmptyState } from '../../components/ui';

export default function Users() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [isAddOpen, setIsAddOpen] = useState(false);

  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['adminUsers', page, debouncedSearch, role, sortBy, sortOrder],
    queryFn: () =>
      adminApi.getUsers({
        page,
        limit: 10,
        search: debouncedSearch || undefined,
        role: role || undefined,
        sortBy,
        sortOrder
      })
  });

  const handleSort = (field, order) => {
    setSortBy(field);
    setSortOrder(order);
  };

  const users = data?.users || data?.data || [];
  const pagination = data?.pagination || data?.meta;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            User management
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            View, filter, sort, and register accounts
          </p>
        </div>
        <Button onClick={() => setIsAddOpen(true)}>
          <UserPlus className="h-4 w-4 mr-1.5" />
          <span>Add user</span>
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1">
          <Input
            placeholder="Search by name, email or address..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            leftIcon={Search}
          />
        </div>
        <div className="w-full sm:w-48">
          <Select
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              setPage(1);
            }}
            options={[
              { value: '', label: 'All roles' },
              { value: 'USER', label: 'Normal User' },
              { value: 'OWNER', label: 'Store Owner' },
              { value: 'ADMIN', label: 'Administrator' }
            ]}
          />
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/50">
              <tr>
                <SortableTh field="name" sortField={sortBy} sortOrder={sortOrder} onSort={handleSort}>
                  Name
                </SortableTh>
                <SortableTh field="email" sortField={sortBy} sortOrder={sortOrder} onSort={handleSort}>
                  Email
                </SortableTh>
                <SortableTh field="address" sortField={sortBy} sortOrder={sortOrder} onSort={handleSort}>
                  Address
                </SortableTh>
                <SortableTh field="role" sortField={sortBy} sortOrder={sortOrder} onSort={handleSort}>
                  Role
                </SortableTh>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-slate-600 dark:text-slate-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-6">
                    <SkeletonRow cols={5} />
                    <SkeletonRow cols={5} />
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center">
                    <EmptyState
                      icon={UsersIcon}
                      title="No users found"
                      description="Try adjusting your search criteria or add a new user."
                    />
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="px-4 py-3.5 font-medium text-slate-900 dark:text-white">{u.name}</td>
                    <td className="px-4 py-3.5 text-slate-600 dark:text-slate-400">{u.email}</td>
                    <td className="px-4 py-3.5 text-slate-500 dark:text-slate-400 truncate max-w-xs">{u.address || '—'}</td>
                    <td className="px-4 py-3.5">
                      <Badge variant={u.role === 'ADMIN' ? 'danger' : u.role === 'OWNER' || u.role === 'STORE_OWNER' ? 'warning' : 'default'} size="sm">
                        {u.role}
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <Link to={`/admin/users/${u.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          <span>View</span>
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {pagination && pagination.totalPages > 1 && (
          <div className="border-t border-slate-100 px-4 dark:border-slate-800">
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        )}
      </Card>

      <AddUserModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSuccess={() => refetch()}
      />
    </div>
  );
}
