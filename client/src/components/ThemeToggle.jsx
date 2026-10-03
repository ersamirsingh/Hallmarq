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
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
      aria-label={`Current theme: ${theme}. Click to switch theme.`}
      title={`Theme: ${theme}`}
    >
      {theme === 'light' && <Sun className="h-4 w-4 text-amber-500" />}
      {theme === 'dark' && <Moon className="h-4 w-4 text-indigo-400" />}
      {theme === 'system' && <Laptop className="h-4 w-4 text-slate-500" />}
    </button>
  );
}
