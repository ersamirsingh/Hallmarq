const variantStyles = {
  default:
    'bg-slate-100 text-slate-800 border-slate-200/80 dark:bg-[#1A1A1A] dark:text-[#FFFFFF] dark:border-[#262626] font-medium',
  category:
    'bg-[#6C86FF]/10 text-[#6C86FF] border-[#6C86FF]/20 dark:bg-[#6C86FF]/[0.18] dark:text-[#6C86FF] dark:border-[#6C86FF]/30 font-medium',
  secondary:
    'bg-zinc-100/80 text-zinc-700 border-zinc-200/80 dark:bg-[#6C86FF]/[0.18] dark:text-[#6C86FF] dark:border-[#6C86FF]/30 font-medium',
  rating:
    'bg-amber-500/10 text-amber-700 border-amber-500/20 dark:bg-[#FF7A3D]/[0.18] dark:text-[#FF7A3D] dark:border-[#FF7A3D]/30 font-semibold tracking-tight',
  success:
    'bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20 font-medium',
  warning:
    'bg-amber-500/10 text-amber-800 border-amber-500/20 dark:bg-[#FF7A3D]/[0.18] dark:text-[#FF7A3D] dark:border-[#FF7A3D]/30 font-medium',
  danger:
    'bg-rose-500/10 text-rose-700 border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20 font-medium',
  indigo:
    'bg-indigo-500/10 text-indigo-700 border-indigo-500/20 dark:bg-[#6C86FF]/[0.18] dark:text-[#6C86FF] dark:border-[#6C86FF]/30 font-medium',
  outline:
    'bg-transparent text-slate-700 border-slate-300 dark:text-[#FFFFFF] dark:border-[#262626] font-medium'
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
