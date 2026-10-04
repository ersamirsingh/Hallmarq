import { forwardRef } from 'react';

export const Textarea = forwardRef(function Textarea(
  {
    label,
    error,
    helperText,
    id,
    className = '',
    rows = 4,
    required = false,
    maxLength,
    value,
    ...props
  },
  ref
) {
  const textareaId = id || props.name;
  const currentLength = typeof value === 'string' ? value.length : 0;

  return (
    <div className="w-full">
      <div className="mb-1.5 flex items-center justify-between">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            {label}
            {required && <span className="ml-1 text-rose-500">*</span>}
          </label>
        )}
        {maxLength && (
          <span className="text-[11px] text-slate-400">
            {currentLength}/{maxLength}
          </span>
        )}
      </div>
      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        maxLength={maxLength}
        value={value}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined}
        className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-all duration-150 placeholder:text-slate-400 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-75 dark:bg-slate-900/90 dark:text-slate-100 dark:placeholder:text-slate-500 ${
          error
            ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20 dark:border-rose-600'
            : 'border-slate-200 hover:border-slate-300 focus:border-slate-900 focus:ring-slate-900/10 dark:border-slate-800 dark:hover:border-slate-700 dark:focus:border-slate-300 dark:focus:ring-white/10'
        } ${className}`}
        {...props}
      />
      {error && (
        <p id={`${textareaId}-error`} className="mt-1.5 text-xs font-medium text-rose-500 dark:text-rose-400">
          {error}
        </p>
      )}
      {!error && helperText && (
        <p id={`${textareaId}-helper`} className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
          {helperText}
        </p>
      )}
    </div>
  );
});

export default Textarea;
