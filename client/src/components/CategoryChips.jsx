import { Plus } from 'lucide-react';

export default function CategoryChips({
  categories = [],
  selectedCategory = '',
  onSelect,
  onAdd,
  className = ''
}) {
  return (
    <div className={`flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none ${className}`}>
      <button
        type="button"
        onClick={() => onSelect('')}
        className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs transition-all duration-150 cursor-pointer ${
          selectedCategory === ''
            ? 'bg-slate-900 text-white font-semibold shadow-sm dark:bg-[#6C86FF] dark:text-[#111111] dark:shadow-[0_0_15px_rgba(108,134,255,0.25)]'
            : 'bg-white/80 text-slate-600 border border-slate-200/90 font-medium hover:bg-slate-100 hover:text-slate-900 dark:bg-[#0F0F0F] dark:border-[#262626] dark:text-[#9A9A9A] dark:hover:bg-[#1A1A1A] dark:hover:text-[#FFFFFF] dark:hover:border-[#383838]'
        }`}
      >
        All categories
      </button>

      {categories.map((cat) => {
        const isSelected = String(selectedCategory) === String(cat.name || cat.id);
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelect(cat.name)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs transition-all duration-150 cursor-pointer ${
              isSelected
                ? 'bg-slate-900 text-white font-semibold shadow-sm dark:bg-[#6C86FF] dark:text-[#111111] dark:shadow-[0_0_15px_rgba(108,134,255,0.25)]'
                : 'bg-white/80 text-slate-600 border border-slate-200/90 font-medium hover:bg-slate-100 hover:text-slate-900 dark:bg-[#0F0F0F] dark:border-[#262626] dark:text-[#9A9A9A] dark:hover:bg-[#1A1A1A] dark:hover:text-[#FFFFFF] dark:hover:border-[#383838]'
            }`}
          >
            {cat.name}
          </button>
        );
      })}

      {onAdd && (
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex shrink-0 items-center gap-1 rounded-full border border-dashed border-slate-300 bg-transparent px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-slate-400 hover:text-slate-900 dark:border-[#262626] dark:text-[#9A9A9A] dark:hover:border-[#6C86FF] dark:hover:text-[#6C86FF] cursor-pointer"
        >
          <Plus className="h-3 w-3" />
          <span>New category</span>
        </button>
      )}
    </div>
  );
}
