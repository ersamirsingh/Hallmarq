export function Skeleton({ className = '', ...props }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-slate-200 dark:bg-slate-800 ${className}`}
      {...props}
    />
  );
}

export function SkeletonRow({ cols = 4 }) {
  return (
    <div className="flex items-center gap-4 py-3">
      {Array.from({ length: cols }).map((_, idx) => (
        <Skeleton key={idx} className="h-5 flex-1" />
      ))}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-xl border border-slate-200 p-6 dark:border-slate-800">
      <Skeleton className="mb-4 h-6 w-1/3" />
      <Skeleton className="mb-2 h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}

export default Skeleton;
