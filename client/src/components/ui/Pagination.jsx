import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './Button';

export function Pagination({
  page,
  totalPages,
  onPageChange,
  className = ''
}) {
  if (totalPages <= 1) return null;

  return (
    <div className={`flex items-center justify-between gap-4 py-3.5 ${className}`}>
      <p className="text-xs text-slate-500 dark:text-slate-400">
        Page <span className="font-semibold text-slate-900 dark:text-slate-100">{page}</span> of{' '}
        <span className="font-semibold text-slate-900 dark:text-slate-100">{totalPages}</span>
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Previous</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default Pagination;
