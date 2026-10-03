import { Card } from './ui/Card';

export default function StatCard({
  title,
  value,
  helperText,
  icon: Icon,
  className = ''
}) {
  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        {Icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
            <Icon className="h-5 w-5" />
          </div>
        )}
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
