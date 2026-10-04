import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Award, Sparkles, Shield, Building2, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { loginSchema } from '../lib/validators';
import { Input, Button, Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui';
import ThemeToggle from '../components/ThemeToggle';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' }
  });

  const setDemoCredentials = (email, password) => {
    setValue('email', email, { shouldValidate: true });
    setValue('password', password, { shouldValidate: true });
  };

  const onSubmit = async (values) => {
    setServerError('');
    try {
      const user = await login(values);
      const destination =
        location.state?.from?.pathname ||
        (user.role === 'ADMIN' ? '/admin' : user.role === 'OWNER' || user.role === 'STORE_OWNER' ? '/owner' : '/stores');
      navigate(destination, { replace: true });
    } catch (err) {
      setServerError(err.response?.data?.message || 'Invalid email or password.');
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 bg-slate-50 dark:bg-[#090D16] overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-200/20 via-transparent to-transparent dark:from-indigo-900/15 dark:via-transparent pointer-events-none" />

      <div className="absolute right-6 top-6 z-10">
        <ThemeToggle />
      </div>

      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-md dark:bg-white dark:text-slate-950">
            <Award className="h-6 w-6" />
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Welcome to Hallmarq
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Sign in to access your dashboard and verified reviews
          </p>
        </div>

        <Card className="border-slate-200/90 shadow-xl shadow-slate-900/5 dark:border-slate-800 dark:shadow-black/40">
          <CardHeader>
            <CardTitle>Sign in</CardTitle>
            <CardDescription>Enter your account credentials to continue</CardDescription>
          </CardHeader>
          <CardContent>
            {serverError && (
              <div className="mb-4 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs font-medium text-rose-700 dark:bg-rose-950/50 dark:border-rose-900/60 dark:text-rose-300">
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Email address"
                type="email"
                required
                placeholder="name@example.com"
                autoComplete="email"
                error={errors.email?.message}
                {...register('email')}
              />

              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  error={errors.password?.message}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3.5 top-8.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              <div className="flex items-center justify-end">
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                >
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" loading={isSubmitting} className="w-full">
                Sign in
              </Button>
            </form>

            <div className="mt-6 border-t border-slate-100 pt-5 dark:border-slate-800">
              <p className="mb-2.5 text-center text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Quick test autofill
              </p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setDemoCredentials('admin@hallmarq.com', 'Admin@123')}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200/90 bg-slate-50/80 px-2 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-850 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                >
                  <Shield className="h-3 w-3 text-rose-500" />
                  <span>Admin</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDemoCredentials('owner1@hallmarq.com', 'Owner@123')}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200/90 bg-slate-50/80 px-2 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-850 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                >
                  <Building2 className="h-3 w-3 text-amber-500" />
                  <span>Owner</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDemoCredentials('user1@hallmarq.com', 'User@123')}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200/90 bg-slate-50/80 px-2 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-850 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                >
                  <User className="h-3 w-3 text-blue-500" />
                  <span>User</span>
                </button>
              </div>
            </div>

            <div className="mt-5 text-center text-xs text-slate-500 dark:text-slate-400">
              Don't have an account?{' '}
              <Link to="/signup" className="font-semibold text-slate-900 hover:underline dark:text-white">
                Create one now
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
