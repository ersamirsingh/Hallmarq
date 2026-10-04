import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 dark:bg-[#000000]">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600 dark:text-[#6C86FF]" />
      </div>
    );
  }

  if (user) {
    const destination =
      user.role === 'ADMIN'
        ? '/admin'
        : user.role === 'OWNER' || user.role === 'STORE_OWNER'
        ? '/owner'
        : '/stores';
    return <Navigate to={destination} replace />;
  }

  return children ? children : <Outlet />;
}
