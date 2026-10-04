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
      className={`relative p-6 transition-all duration-200 ${
        onClick
          ? 'cursor-pointer hover:-translate-y-0.5 hover:border-indigo-400/80 hover:shadow-md dark:hover:border-indigo-500/80 active:translate-y-0'
          : ''
      } ${className}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        <div className="flex items-center gap-1.5">
          {onClick && (
            <ArrowUpRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 dark:text-slate-500" />
          )}
          {Icon && (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <Icon className="h-5 w-5" />
            </div>
          )}
        </div>
      </div>
      <div className="mt-4">
        <p className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          {value}
        </p>
        {helperText && (
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {helperText}
          </p>
        )}
      </div>
    </Card>
  );
}
