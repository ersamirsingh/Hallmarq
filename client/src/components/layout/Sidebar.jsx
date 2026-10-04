import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Store, User, Award, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar({ onClose }) {
  const { user } = useAuth();
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

  return (
    <aside className="flex h-full w-64 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="flex h-16 items-center justify-between px-6 border-b border-slate-100 dark:border-slate-800">
        <NavLink to="/" className="flex items-center gap-2.5 font-bold text-slate-900 dark:text-white">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white dark:bg-indigo-500">
            <Award className="h-5 w-5" />
          </div>
          <span className="text-lg tracking-tight">Hallmarq</span>
        </NavLink>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 lg:hidden dark:hover:bg-slate-800"
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
                `flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200'
                }`
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
