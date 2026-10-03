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
        className={`w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 transition focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-75 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-offset-slate-900 ${
          error
            ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/30'
            : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20 dark:border-slate-700 dark:focus:border-indigo-400'
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
        <p id={`${selectId}-error`} className="mt-1 text-xs text-rose-600 dark:text-rose-400">
          {error}
        </p>
      )}
      {!error && helperText && (
        <p id={`${selectId}-helper`} className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {helperText}
        </p>
      )}
    </div>
  );
});

export default Select;
