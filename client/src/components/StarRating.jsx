import { useState } from 'react';
import { Star } from 'lucide-react';

const sizeMap = {
  sm: 'h-3.5 w-3.5',
  md: 'h-5 w-5',
  lg: 'h-7 w-7'
};

export default function StarRating({
  value = 0,
  onChange,
  interactive = false,
  size = 'md',
  className = ''
}) {
  const [hoverValue, setHoverValue] = useState(0);
  const activeValue = hoverValue || value || 0;
  const starSize = sizeMap[size] || sizeMap.md;

  if (interactive) {
    return (
      <div
        role="radiogroup"
        aria-label="Star rating from 1 to 5"
        className={`flex items-center gap-1.5 ${className}`}
        onMouseLeave={() => setHoverValue(0)}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={value === star}
            aria-label={`${star} star${star > 1 ? 's' : ''}`}
            onClick={() => onChange && onChange(star)}
            onMouseEnter={() => setHoverValue(star)}
            onFocus={() => setHoverValue(star)}
            onBlur={() => setHoverValue(0)}
            className="rounded-md p-1 transition-transform hover:scale-125 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A3D] cursor-pointer"
          >
            <Star
              className={`${starSize} transition-colors duration-150 ${
                star <= activeValue
                  ? 'fill-amber-400 text-amber-400 dark:fill-[#FF7A3D] dark:text-[#FF7A3D] drop-shadow-[0_0_8px_rgba(255,122,61,0.35)]'
                  : 'fill-transparent text-slate-300 dark:text-[#262626]'
              }`}
            />
          </button>
        ))}
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-0.5 ${className}`}
      aria-label={`Rating: ${value} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const fillPercent = Math.max(0, Math.min(100, (value - (star - 1)) * 100));
        return (
          <div key={star} className="relative inline-block text-slate-200 dark:text-[#262626]">
            <Star className={`${starSize} text-slate-200 dark:text-[#262626]`} />
            {fillPercent > 0 && (
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fillPercent}%` }}
              >
                <Star className={`${starSize} fill-amber-400 text-amber-400 dark:fill-[#FF7A3D] dark:text-[#FF7A3D]`} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
