import { Card } from './ui/Card';
import { ArrowUpRight } from 'lucide-react';

export default function StatCard({
  title,
  value,
  helperText,
  icon: Icon,
  className = '',
  onClick
}) {
  return (
    <Card
      onClick={onClick}
      className={`group relative p-6 transition-all duration-200 ${
        onClick
          ? 'cursor-pointer hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-900/5 hover:border-slate-300 dark:hover:border-slate-700 active:translate-y-0'
          : ''
      } ${className}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        <div className="flex items-center gap-2">
          {onClick && (
            <ArrowUpRight className="h-4 w-4 text-slate-400 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-slate-900 dark:group-hover:text-white" />
          )}
          {Icon && (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-800 transition-colors group-hover:bg-slate-900 group-hover:text-white dark:bg-slate-800 dark:text-slate-200 dark:group-hover:bg-white dark:group-hover:text-slate-900">
              <Icon className="h-5 w-5" />
            </div>
          )}
        </div>
      </div>
      <div className="mt-4">
        <p className="text-3xl font-bold tracking-tight text-slate-900 tabular-nums dark:text-white">
          {value}
        </p>
        {helperText && (
          <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
            {helperText}
          </p>
        )}
      </div>
    </Card>
  );
}
