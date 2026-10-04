import { forwardRef, isValidElement } from 'react';

export const Input = forwardRef(function Input(
  {
    label,
    error,
    helperText,
    id,
    className = '',
    type = 'text',
    required = false,
    leftIcon: LeftIcon,
    rightElement,
    ...props
  },
  ref
) {
  const inputId = id || props.name;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300"
        >
          {label}
          {required && <span className="ml-1 text-rose-500">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        {LeftIcon && (
          <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center text-slate-400 dark:text-slate-500">
            {isValidElement(LeftIcon) ? (
              LeftIcon
            ) : (
              <LeftIcon className="h-4 w-4" />
            )}
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          className={`w-full rounded-xl border bg-white py-2.5 text-sm text-slate-900 transition-all duration-150 placeholder:text-slate-400 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-75 dark:bg-slate-900/90 dark:text-slate-100 dark:placeholder:text-slate-500 ${
            LeftIcon ? 'pl-10' : 'pl-3.5'
          } ${
            rightElement ? 'pr-10' : 'pr-3.5'
          } ${
            error
              ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20 dark:border-rose-600'
              : 'border-slate-200 hover:border-slate-300 focus:border-slate-900 focus:ring-slate-900/10 dark:border-slate-800 dark:hover:border-slate-700 dark:focus:border-slate-300 dark:focus:ring-white/10'
          } ${className}`}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center">
            {rightElement}
          </div>
        )}
      </div>
      {error && (
        <p id={`${inputId}-error`} className="mt-1.5 text-xs font-medium text-rose-500 dark:text-rose-400">
          {error}
        </p>
      )}
      {!error && helperText && (
        <p id={`${inputId}-helper`} className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
          {helperText}
        </p>
      )}
    </div>
  );
});

export default Input;
