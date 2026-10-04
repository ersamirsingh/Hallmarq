import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

const variantStyles = {
  primary:
    'bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-950 shadow-sm shadow-slate-950/10 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 dark:active:bg-slate-200 focus-visible:ring-slate-900 dark:focus-visible:ring-white',
  secondary:
    'bg-slate-100 text-slate-800 hover:bg-slate-200/80 active:bg-slate-200 focus-visible:ring-slate-400 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700/80',
  outline:
    'border border-slate-200 bg-white/70 text-slate-800 hover:bg-slate-50 hover:border-slate-300 active:bg-slate-100 focus-visible:ring-slate-900 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:bg-slate-800/80 dark:hover:border-slate-700',
  ghost:
    'bg-transparent text-slate-700 hover:bg-slate-100/80 active:bg-slate-200/60 focus-visible:ring-slate-400 dark:text-slate-300 dark:hover:bg-slate-800 dark:active:bg-slate-800/80',
  danger:
    'bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 focus-visible:ring-rose-500 shadow-sm shadow-rose-600/20',
  accent:
    'bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 shadow-sm shadow-indigo-600/20 focus-visible:ring-indigo-600'
};

const sizeStyles = {
  sm: 'h-8 px-3 text-xs gap-1.5 rounded-lg font-medium tracking-wide',
  md: 'h-9 px-4 text-sm gap-2 rounded-xl font-medium tracking-tight',
  lg: 'h-11 px-5 text-base gap-2.5 rounded-xl font-medium tracking-tight'
};

export const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    className = '',
    type = 'button',
    ...props
  },
  ref
) {
  const base =
    'inline-flex items-center justify-center transition-all duration-150 select-none disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 cursor-pointer';
  const variantClass = variantStyles[variant] || variantStyles.primary;
  const sizeClass = sizeStyles[size] || sizeStyles.md;

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={`${base} ${variantClass} ${sizeClass} ${className}`}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin text-current" />}
      {children}
    </button>
  );
});

export default Button;
