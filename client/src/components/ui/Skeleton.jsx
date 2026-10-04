export function Skeleton({ className = '', ...props }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-slate-200/80 dark:bg-[#1A1A1A] ${className}`}
      {...props}
    />
  );
}

export function SkeletonRow({ cols = 4 }) {
  return (
    <div className="flex items-center gap-4 py-3">
      {Array.from({ length: cols }).map((_, idx) => (
        <Skeleton key={idx} className="h-5 flex-1 rounded-md" />
      ))}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 dark:border-[#262626] dark:bg-[#0F0F0F] shadow-sm">
      <Skeleton className="mb-4 h-6 w-1/3 rounded-md" />
      <Skeleton className="mb-2 h-4 w-full rounded-md" />
      <Skeleton className="h-4 w-2/3 rounded-md" />
    </div>
  );
}

export default Skeleton;
