const variantStyles = {
  default:
    'bg-slate-100 text-slate-800 border-slate-200/80 dark:bg-slate-800/80 dark:text-slate-200 dark:border-slate-700/80 font-medium',
  secondary:
    'bg-zinc-100/80 text-zinc-700 border-zinc-200/80 dark:bg-zinc-800/60 dark:text-zinc-300 dark:border-zinc-700 font-medium',
  rating:
    'bg-amber-500/10 text-amber-700 border-amber-500/20 dark:bg-amber-400/10 dark:text-amber-300 dark:border-amber-400/20 font-semibold tracking-tight',
  success:
    'bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:bg-emerald-400/10 dark:text-emerald-300 dark:border-emerald-400/20 font-medium',
  warning:
    'bg-amber-500/10 text-amber-800 border-amber-500/20 dark:bg-amber-400/10 dark:text-amber-300 dark:border-amber-400/20 font-medium',
  danger:
    'bg-rose-500/10 text-rose-700 border-rose-500/20 dark:bg-rose-400/10 dark:text-rose-300 dark:border-rose-400/20 font-medium',
  indigo:
    'bg-indigo-500/10 text-indigo-700 border-indigo-500/20 dark:bg-indigo-400/10 dark:text-indigo-300 dark:border-indigo-400/20 font-medium',
  outline:
    'bg-transparent text-slate-700 border-slate-300 dark:text-slate-300 dark:border-slate-700 font-medium'
};

const sizeStyles = {
  sm: 'px-2 py-0.5 text-[11px]',
  md: 'px-2.5 py-1 text-xs'
};

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  ...props
}) {
  const variantClass = variantStyles[variant] || variantStyles.default;
  const sizeClass = sizeStyles[size] || sizeStyles.md;

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full border transition-colors select-none ${variantClass} ${sizeClass} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}

export default Badge;
