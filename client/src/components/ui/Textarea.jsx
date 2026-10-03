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
        className={`w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 transition placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-75 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-offset-slate-900 ${
          error
            ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/30'
            : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20 dark:border-slate-700 dark:focus:border-indigo-400'
        } ${className}`}
        {...props}
      />
      {error && (
        <p id={`${textareaId}-error`} className="mt-1 text-xs text-rose-600 dark:text-rose-400">
          {error}
        </p>
      )}
      {!error && helperText && (
        <p id={`${textareaId}-helper`} className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {helperText}
        </p>
      )}
    </div>
  );
});

export default Textarea;
