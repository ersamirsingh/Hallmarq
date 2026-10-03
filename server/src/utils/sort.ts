export type SortOrder = 'asc' | 'desc';

export const parseSort = <T extends string>(
  rawSortBy: unknown,
  rawOrder: unknown,
  allowedFields: Record<string, T>,
  defaultSort: T,
  defaultOrder: SortOrder = 'asc'
): { sortBy: T; order: SortOrder } => {
  const sortByStr = typeof rawSortBy === 'string' ? rawSortBy.trim() : '';
  const orderStr = typeof rawOrder === 'string' ? rawOrder.trim().toLowerCase() : '';

  const sortBy = sortByStr && allowedFields[sortByStr] ? allowedFields[sortByStr] : defaultSort;
  const order: SortOrder = orderStr === 'asc' || orderStr === 'desc' ? orderStr : defaultOrder;

  return { sortBy, order };
};
