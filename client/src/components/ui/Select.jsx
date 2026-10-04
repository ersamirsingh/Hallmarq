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
          className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300"
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
        className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-all duration-150 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-75 dark:bg-slate-900/90 dark:text-slate-100 ${
          error
            ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20 dark:border-rose-600'
            : 'border-slate-200 hover:border-slate-300 focus:border-slate-900 focus:ring-slate-900/10 dark:border-slate-800 dark:hover:border-slate-700 dark:focus:border-slate-300 dark:focus:ring-white/10'
        } ${className}`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {children
          ? children
          : options.map((opt) => (
              <option key={opt.value} value={opt.value}>
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
        <p id={`${selectId}-helper`} className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
          {helperText}
        </p>
      )}
    </div>
  );
});

export default Select;
