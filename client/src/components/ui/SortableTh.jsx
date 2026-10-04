import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';

export function SortableTh({
  field,
  sortField,
  sortOrder,
  onSort,
  children,
  className = ''
}) {
  const isActive = sortField === field;

  const handleClick = () => {
    if (!isActive) {
      onSort(field, 'asc');
    } else if (sortOrder === 'asc') {
      onSort(field, 'desc');
    } else {
      onSort(field, 'asc');
    }
  };

  return (
    <th
      scope="col"
      className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 ${className}`}
      aria-sort={isActive ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'}
    >
      <button
        type="button"
        onClick={handleClick}
        className="group inline-flex items-center gap-1.5 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 rounded dark:hover:text-white cursor-pointer"
      >
        <span>{children}</span>
        <span className="text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200">
          {isActive ? (
            sortOrder === 'asc' ? (
              <ArrowUp className="h-3.5 w-3.5 text-slate-900 dark:text-white" />
            ) : (
              <ArrowDown className="h-3.5 w-3.5 text-slate-900 dark:text-white" />
            )
          ) : (
            <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />
          )}
        </span>
      </button>
    </th>
  );
}

export default SortableTh;
