import { Menu, Sparkles } from 'lucide-react';
import ThemeToggle from '../ThemeToggle';
import ProfileMenu from './ProfileMenu';

export default function Topbar({ onMenuClick }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/80 px-4 backdrop-blur-md sm:px-6 dark:border-[#262626] dark:bg-[#0F0F0F]/90">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 lg:hidden dark:text-[#9A9A9A] dark:hover:bg-[#1A1A1A] cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-[#9A9A9A]">
          <Sparkles className="h-3.5 w-3.5 text-amber-500 dark:text-[#FF7A3D]" />
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
