import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ allowedRoles, children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 dark:bg-[#000000]">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600 dark:text-[#6C86FF]" />
        <p className="mt-3 text-sm text-slate-500 dark:text-[#9A9A9A]">Loading session...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const userRole = user.role === 'STORE_OWNER' ? 'OWNER' : user.role;
  const normalizedAllowed = allowedRoles?.map((r) => (r === 'STORE_OWNER' ? 'OWNER' : r));

  if (normalizedAllowed && !normalizedAllowed.includes(userRole)) {
    const defaultRoute =
      userRole === 'ADMIN'
        ? '/admin'
        : userRole === 'OWNER'
        ? '/owner'
        : '/stores';
    return <Navigate to={defaultRoute} replace />;
  }

  return children ? children : <Outlet />;
}
