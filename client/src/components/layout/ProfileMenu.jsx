import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../ui/Badge';

export default function ProfileMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const handleEscape = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  if (!user) return null;

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

  const handleLogout = async () => {
    setOpen(false);
    await logout();
    navigate('/login');
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2.5 rounded-xl p-1.5 text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer transition-colors"
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="User account menu"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-xs font-bold text-white shadow-sm dark:bg-white dark:text-slate-950">
          {initials}
        </div>
        <span className="hidden text-xs font-semibold sm:inline text-slate-800 dark:text-slate-200">
          {user.name}
        </span>
        <ChevronDown className="hidden h-3.5 w-3.5 text-slate-400 sm:inline" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200/90 bg-white/95 p-2 shadow-xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 z-50">
          <div className="border-b border-slate-100 p-2.5 dark:border-slate-800">
            <p className="font-semibold text-sm text-slate-900 dark:text-white truncate">
              {user.name}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {user.email}
            </p>
            <div className="mt-2">
              <Badge variant={roleVariant} size="sm">
                {user.role}
              </Badge>
            </div>
          </div>
          <div className="pt-1.5 space-y-0.5">
            <Link
              to="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
            >
              <User className="h-4 w-4" />
              <span>Profile Settings</span>
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-xs font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
