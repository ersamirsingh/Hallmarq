import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Store, User, Award, X, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../ui/Badge';

export default function Sidebar({ onClose }) {
  const { user, logout } = useAuth();
  if (!user) return null;

  const getLinks = () => {
    switch (user.role) {
      case 'ADMIN':
        return [
          { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
          { to: '/admin/users', label: 'Users', icon: Users },
          { to: '/admin/stores', label: 'Stores', icon: Store },
          { to: '/profile', label: 'Profile', icon: User }
        ];
      case 'OWNER':
      case 'STORE_OWNER':
        return [
          { to: '/owner', label: 'My Store', icon: LayoutDashboard, end: true },
          { to: '/stores', label: 'Browse stores', icon: Store },
          { to: '/profile', label: 'Profile', icon: User }
        ];
      default:
        return [
          { to: '/stores', label: 'Browse stores', icon: Store },
          { to: '/profile', label: 'Profile', icon: User }
        ];
    }
  };

  const links = getLinks();
  const initials = user.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'U';

  const roleVariant =
    user.role === 'ADMIN' ? 'danger' : user.role === 'OWNER' || user.role === 'STORE_OWNER' ? 'warning' : 'default';

  return (
    <aside className="flex h-full w-64 flex-col border-r border-slate-200/80 bg-white/95 dark:border-[#262626] dark:bg-[#0F0F0F] backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-6 border-b border-slate-100 dark:border-[#262626]">
        <NavLink to="/" className="flex items-center gap-3 font-bold">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm dark:bg-[#6C86FF] dark:text-[#111111]">
            <Award className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-base tracking-tight font-bold text-slate-900 dark:text-[#FFFFFF] leading-tight">
              Hallmarq
            </span>
            <span className="text-[10px] font-semibold tracking-wider uppercase text-slate-400 dark:text-[#9A9A9A]">
              Verified Ratings
            </span>
          </div>
        </NavLink>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 lg:hidden dark:text-[#9A9A9A] dark:hover:bg-[#1A1A1A] cursor-pointer"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm transition-all duration-150 ${
                  isActive
                    ? 'bg-slate-900 text-white font-semibold shadow-sm dark:bg-[#6C86FF] dark:text-[#111111] dark:shadow-[0_0_15px_rgba(108,134,255,0.25)]'
                    : 'font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-[#9A9A9A] dark:hover:bg-[#1A1A1A] dark:hover:text-[#FFFFFF]'
                }`
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-slate-100 p-4 dark:border-[#262626]">
        <div className="flex items-center justify-between gap-2 rounded-xl bg-slate-50/80 p-2.5 dark:bg-[#151515] border border-slate-100 dark:border-[#262626]">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-xs font-bold text-white dark:bg-[#6C86FF] dark:text-[#111111]">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-slate-900 dark:text-[#FFFFFF] leading-tight">
                {user.name}
              </p>
              <div className="mt-0.5">
                <Badge variant={roleVariant} size="sm">
                  {user.role}
                </Badge>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={logout}
            title="Sign out"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200/60 hover:text-rose-600 dark:text-[#9A9A9A] dark:hover:bg-[#262626] dark:hover:text-rose-400 cursor-pointer transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
