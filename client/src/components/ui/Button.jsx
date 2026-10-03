import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

const variantStyles = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 focus-visible:ring-indigo-500 shadow-sm dark:bg-indigo-500 dark:hover:bg-indigo-600',
  secondary: 'bg-slate-100 text-slate-800 hover:bg-slate-200 active:bg-slate-300 focus-visible:ring-slate-400 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700',
  danger: 'bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 focus-visible:ring-rose-500 shadow-sm dark:bg-rose-600 dark:hover:bg-rose-700',
  ghost: 'bg-transparent text-slate-700 hover:bg-slate-100 active:bg-slate-200 focus-visible:ring-slate-400 dark:text-slate-300 dark:hover:bg-slate-800',
  outline: 'border border-slate-300 bg-transparent text-slate-700 hover:bg-slate-50 active:bg-slate-100 focus-visible:ring-slate-400 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'
};

const sizeStyles = {
  sm: 'h-8 px-3 text-xs gap-1.5 rounded-md',
  md: 'h-9 px-4 text-sm gap-2 rounded-lg',
  lg: 'h-11 px-5 text-base gap-2.5 rounded-lg'
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
  const base = 'inline-flex items-center justify-center font-medium transition select-none disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900';
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
