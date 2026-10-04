export function Card({ className = '', children, ...props }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white text-slate-900 shadow-[0_1px_3px_0_rgba(15,23,42,0.04)] transition-all duration-200 dark:border-[#262626] dark:bg-[#0F0F0F] dark:text-[#FFFFFF] before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-slate-200 before:to-transparent dark:before:via-white/5 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className = '', children, ...props }) {
  return (
    <div className={`p-6 pb-3 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className = '', children, ...props }) {
  return (
    <h3
      className={`text-lg font-semibold tracking-tight text-slate-900 dark:text-[#FFFFFF] ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({ className = '', children, ...props }) {
  return (
    <p
      className={`text-sm text-slate-500 dark:text-[#9A9A9A] ${className}`}
      {...props}
    >
      {children}
    </p>
  );
}

export function CardContent({ className = '', children, ...props }) {
  return (
    <div className={`p-6 pt-3 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className = '', children, ...props }) {
  return (
    <div
      className={`flex items-center justify-between border-t border-slate-100 p-6 pt-4 dark:border-[#262626] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
