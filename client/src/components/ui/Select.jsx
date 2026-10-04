import { forwardRef } from 'react';

export const Select = forwardRef(function Select(
  {
    label,
    error,
    helperText,
    id,
    className = '',
    required = false,
    options = [],
    children,
    placeholder,
    ...props
  },
  ref
) {
  const selectId = id || props.name;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-[#FFFFFF]"
        >
          {label}
          {required && <span className="ml-1 text-rose-500">*</span>}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined}
        className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-all duration-150 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-75 dark:bg-[#0F0F0F] dark:text-[#FFFFFF] ${
          error
            ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20 dark:border-rose-500 dark:focus:ring-rose-500/20'
            : 'border-slate-200 hover:border-slate-300 focus:border-slate-900 focus:ring-slate-900/10 dark:border-[#262626] dark:hover:border-[#383838] dark:focus:border-[#6C86FF] dark:focus:ring-[#6C86FF]/20'
        } ${className}`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {children
          ? children
          : options.map((opt) => (
              <option key={opt.value} value={opt.value} className="dark:bg-[#0F0F0F] dark:text-[#FFFFFF]">
                {opt.label}
              </option>
            ))}
      </select>
      {error && (
        <p id={`${selectId}-error`} className="mt-1.5 text-xs font-medium text-rose-500 dark:text-rose-400">
          {error}
        </p>
      )}
      {!error && helperText && (
        <p id={`${selectId}-helper`} className="mt-1.5 text-xs text-slate-500 dark:text-[#9A9A9A]">
          {helperText}
        </p>
      )}
    </div>
  );
});

export default Select;
