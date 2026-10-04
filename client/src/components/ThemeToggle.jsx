import { Sun, Moon, Laptop } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const nextTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  return (
    <button
      type="button"
      onClick={nextTheme}
      className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/80 bg-white/80 text-slate-700 shadow-sm transition-all duration-150 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white cursor-pointer"
      aria-label={`Current theme: ${theme}. Click to switch theme.`}
      title={`Theme: ${theme}`}
    >
      {theme === 'light' && <Sun className="h-4 w-4 text-amber-500 transition-transform hover:rotate-45" />}
      {theme === 'dark' && <Moon className="h-4 w-4 text-indigo-400 transition-transform hover:-rotate-12" />}
      {theme === 'system' && <Laptop className="h-4 w-4 text-slate-500" />}
    </button>
  );
}
