import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Store as StoreIcon, Plus, Search, Star } from 'lucide-react';
import { adminApi } from '../../api/admin.api';
import { categoryApi } from '../../api/category.api';
import useDebounce from '../../hooks/useDebounce';
import AddStoreModal from './AddStoreModal';
import AddCategoryModal from './AddCategoryModal';
import CategoryChips from '../../components/CategoryChips';
import { Button, Input, Badge, Card, Pagination, SortableTh, SkeletonRow, EmptyState } from '../../components/ui';

export default function Stores() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [isAddStoreOpen, setIsAddStoreOpen] = useState(false);
  const [isAddCatOpen, setIsAddCatOpen] = useState(false);

  const debouncedSearch = useDebounce(search, 300);

  const { data: catData, refetch: refetchCats } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryApi.getCategories
  });

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['adminStores', page, debouncedSearch, category, sortBy, sortOrder],
    queryFn: () =>
      adminApi.getStores({
        page,
        limit: 10,
        search: debouncedSearch || undefined,
        category: category || undefined,
        sortBy,
        sortOrder
      })
  });

  const handleSort = (field, order) => {
    setSortBy(field);
    setSortOrder(order);
  };

  const stores = data?.stores || data?.data || [];
  const pagination = data?.pagination || data?.meta;
  const categories = catData?.categories || catData?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Store management
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Create, categorize, and oversee registered stores
          </p>
        </div>
        <Button onClick={() => setIsAddStoreOpen(true)}>
          <Plus className="h-4 w-4 mr-1.5" />
          <span>Add store</span>
        </Button>
      </div>

      <div className="space-y-3">
        <div className="relative">
          <Input
            placeholder="Search stores by name or address..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        </div>

        <CategoryChips
          categories={categories}
          selectedCategory={category}
          onSelect={(c) => {
            setCategory(c);
            setPage(1);
          }}
          onAdd={() => setIsAddCatOpen(true)}
        />
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/50">
              <tr>
                <SortableTh field="name" sortField={sortBy} sortOrder={sortOrder} onSort={handleSort}>
                  Store
                </SortableTh>
                <SortableTh field="email" sortField={sortBy} sortOrder={sortOrder} onSort={handleSort}>
                  Email
                </SortableTh>
                <SortableTh field="address" sortField={sortBy} sortOrder={sortOrder} onSort={handleSort}>
                  Address
                </SortableTh>
                <SortableTh field="category" sortField={sortBy} sortOrder={sortOrder} onSort={handleSort}>
                  Category
                </SortableTh>
                <th className="px-4 py-3 text-xs font-semibold uppercase text-slate-600 dark:text-slate-300">
                  Rating
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase text-slate-600 dark:text-slate-300">
                  Owner
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-6">
                    <SkeletonRow cols={6} />
                    <SkeletonRow cols={6} />
                  </td>
                </tr>
              ) : stores.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center">
                    <EmptyState
                      icon={StoreIcon}
                      title="No stores found"
                      description="No registered stores match your search criteria."
                    />
                  </td>
                </tr>
              ) : (
                stores.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="px-4 py-3.5 font-medium text-slate-900 dark:text-white">{s.name}</td>
                    <td className="px-4 py-3.5 text-slate-600 dark:text-slate-400">{s.email}</td>
                    <td className="px-4 py-3.5 text-slate-500 dark:text-slate-400 truncate max-w-xs">{s.address}</td>
                    <td className="px-4 py-3.5">
                      <Badge variant="secondary" size="sm">
                        {s.category?.name || '—'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {typeof s.rating === 'object' && s.rating !== null
                            ? s.rating.average ?? '0.0'
                            : s.rating ?? '0.0'}
                        </span>
                        <span className="text-xs text-slate-400">
                          (
                          {typeof s.rating === 'object' && s.rating !== null
                            ? s.rating.count ?? 0
                            : s.ratingCount ?? 0}
                          )
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 dark:text-slate-400">
                      {s.owner ? s.owner.name : <span className="text-slate-400 italic">Unassigned</span>}
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

      <AddStoreModal
        isOpen={isAddStoreOpen}
        onClose={() => setIsAddStoreOpen(false)}
        onSuccess={() => refetch()}
      />

      <AddCategoryModal
        isOpen={isAddCatOpen}
        onClose={() => setIsAddCatOpen(false)}
        onSuccess={() => refetchCats()}
      />
    </div>
  );
}
