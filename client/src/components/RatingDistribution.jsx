import { Star } from 'lucide-react';

export default function RatingDistribution({ distribution = {}, total = 0, className = '' }) {
  const stars = [5, 4, 3, 2, 1];

  return (
    <div className={`space-y-2.5 ${className}`}>
      {stars.map((star) => {
        const count = distribution[star] || distribution[String(star)] || 0;
        const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

        return (
          <div key={star} className="flex items-center gap-3 text-xs">
            <div className="flex w-14 shrink-0 items-center justify-end gap-1 font-medium text-slate-700 dark:text-slate-300">
              <span>{star}</span>
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            </div>

            <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className="h-full rounded-full bg-amber-400 transition-all duration-500 ease-out"
                style={{ width: `${percentage}%` }}
              />
            </div>

            <div className="w-16 shrink-0 text-right font-medium text-slate-500 dark:text-slate-400">
              <span>{count}</span>
              <span className="ml-1 text-[11px] opacity-75">({percentage}%)</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
