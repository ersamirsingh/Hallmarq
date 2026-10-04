import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

const variantStyles = {
  primary:
    'bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-950 shadow-sm dark:bg-[#6C86FF] dark:text-[#111111] dark:hover:bg-[#7D95FF] dark:active:bg-[#5C77F5] font-semibold dark:shadow-[0_0_15px_rgba(108,134,255,0.25)] focus-visible:ring-slate-900 dark:focus-visible:ring-[#6C86FF]',
  secondary:
    'bg-slate-100 text-slate-800 hover:bg-slate-200/80 active:bg-slate-200 focus-visible:ring-slate-400 dark:bg-[#1A1A1A] dark:text-[#FFFFFF] dark:hover:bg-[#262626]',
  outline:
    'border border-slate-200 bg-white/70 text-slate-800 hover:bg-slate-50 hover:border-slate-300 active:bg-slate-100 focus-visible:ring-slate-900 dark:border-[#262626] dark:bg-[#0F0F0F] dark:text-[#FFFFFF] dark:hover:bg-[#1A1A1A] dark:hover:border-[#383838]',
  ghost:
    'bg-transparent text-slate-700 hover:bg-slate-100/80 active:bg-slate-200/60 focus-visible:ring-slate-400 dark:text-[#9A9A9A] dark:hover:text-[#FFFFFF] dark:hover:bg-[#1A1A1A]',
  danger:
    'bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 focus-visible:ring-rose-500 shadow-sm shadow-rose-600/20',
  accent:
    'bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 shadow-sm shadow-indigo-600/20 dark:bg-[#6C86FF] dark:text-[#111111] dark:hover:bg-[#7D95FF] font-semibold focus-visible:ring-[#6C86FF]'
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
    'inline-flex items-center justify-center transition-all duration-150 select-none disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-black cursor-pointer';
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
