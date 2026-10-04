import { Menu, Sparkles } from 'lucide-react';
import ThemeToggle from '../ThemeToggle';
import ProfileMenu from './ProfileMenu';

export default function Topbar({ onMenuClick }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/80 px-4 backdrop-blur-md sm:px-6 dark:border-slate-800 dark:bg-slate-900/80">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 lg:hidden dark:text-slate-400 dark:hover:bg-slate-800 cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          <span>Hallmarq Platform</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        <ProfileMenu />
      </div>
    </header>
  );
}
