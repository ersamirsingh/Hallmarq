import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ThemeProvider } from './context/ThemeContext';
import ThemeToggle from './components/ThemeToggle';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 1,
      refetchOnWindowFocus: false
    }
  }
});

function Placeholder({ title }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="absolute right-6 top-6">
        <ThemeToggle />
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{title}</h1>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Hallmarq store rating platform</p>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/stores" replace />} />
            <Route path="/login" element={<Placeholder title="Sign in" />} />
            <Route path="/signup" element={<Placeholder title="Create account" />} />
            <Route path="/forgot-password" element={<Placeholder title="Forgot password" />} />
            <Route path="/reset-password" element={<Placeholder title="Reset password" />} />
            <Route path="/verify-email" element={<Placeholder title="Verify email" />} />
            <Route path="/stores" element={<Placeholder title="Stores" />} />
            <Route path="/profile" element={<Placeholder title="Profile" />} />
            <Route path="/admin" element={<Placeholder title="Admin dashboard" />} />
            <Route path="/owner" element={<Placeholder title="Owner dashboard" />} />
            <Route path="*" element={<Placeholder title="Page not found" />} />
          </Routes>
        </BrowserRouter>
        <Toaster position="top-right" richColors />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
