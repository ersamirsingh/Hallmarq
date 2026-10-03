const variantStyles = {
  default: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800',
  secondary: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
  warning: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
  danger: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800',
  outline: 'bg-transparent text-slate-700 border-slate-300 dark:text-slate-300 dark:border-slate-700'
};

const sizeStyles = {
  sm: 'px-2 py-0.5 text-[11px] font-medium',
  md: 'px-2.5 py-1 text-xs font-medium'
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
      className={`inline-flex items-center justify-center rounded-full border transition-colors ${variantClass} ${sizeClass} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}

export default Badge;
