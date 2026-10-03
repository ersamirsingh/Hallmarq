import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AppShell from './components/layout/AppShell';

import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';
import Profile from './pages/Profile';
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminUserDetails from './pages/admin/UserDetails';
import AdminStores from './pages/admin/Stores';
import Stores from './pages/user/Stores';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 1,
      refetchOnWindowFocus: false
    }
  }
});

function HomeRedirect() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'ADMIN') return <Navigate to="/admin" replace />;
  if (user.role === 'STORE_OWNER') return <Navigate to="/owner" replace />;
  return <Navigate to="/stores" replace />;
}

function PagePlaceholder({ title }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{title}</h1>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Content for {title} will be loaded here.</p>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomeRedirect />} />

              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/verify-email" element={<VerifyEmail />} />

              <Route element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
                <Route path="/stores" element={<Stores />} />
                <Route path="/profile" element={<Profile />} />

                <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/users" element={<AdminUsers />} />
                  <Route path="/admin/users/:id" element={<AdminUserDetails />} />
                  <Route path="/admin/stores" element={<AdminStores />} />
                </Route>

                <Route element={<ProtectedRoute allowedRoles={['STORE_OWNER']} />}>
                  <Route path="/owner" element={<PagePlaceholder title="Owner dashboard" />} />
                </Route>
              </Route>

              <Route path="*" element={<PagePlaceholder title="Page not found" />} />
            </Routes>
          </BrowserRouter>
          <Toaster position="top-right" richColors />
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
