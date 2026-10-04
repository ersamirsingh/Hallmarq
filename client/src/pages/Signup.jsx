import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Award, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import authApi from '../api/auth.api';
import { signupSchema } from '../lib/validators';
import { Input, Textarea, Button, Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui';
import PasswordStrength from '../components/PasswordStrength';
import ThemeToggle from '../components/ThemeToggle';
import { toast } from 'sonner';

export default function Signup() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: '', email: '', password: '', address: '' }
  });

  const passwordValue = watch('password');

  const onSubmit = async (values) => {
    setServerError('');
    try {
      const data = await authApi.register(values);
      setUser(data.user);
      toast.success('Account created successfully.');
      navigate('/stores', { replace: true });
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to create account.');
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 bg-slate-50 dark:bg-[#000000] overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-200/20 via-transparent to-transparent dark:from-[#6C86FF]/10 dark:via-transparent pointer-events-none" />

      <div className="absolute right-6 top-6 z-10">
        <ThemeToggle />
      </div>

      <div className="relative w-full max-w-md">
        <div className="mb-6 text-center">
          <img src="/logo.png" alt="Hallmarq" className="inline-block h-16 w-16 rounded-full object-cover shadow-lg" />
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-[#FFFFFF]">
            Create your account
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-[#9A9A9A]">
            Join Hallmarq to share store reviews and ratings
          </p>
        </div>

        <Card className="border-slate-200/90 shadow-xl shadow-slate-900/5 dark:border-[#262626] dark:bg-[#0F0F0F] dark:shadow-black/40">
          <CardHeader>
            <CardTitle>Sign up</CardTitle>
            <CardDescription>Fill in your details to get started</CardDescription>
          </CardHeader>
          <CardContent>
            {serverError && (
              <div className="mb-4 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs font-medium text-rose-700 dark:bg-rose-950/50 dark:border-rose-900/60 dark:text-rose-300">
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Full name"
                required
                placeholder="Between 3 and 60 characters"
                helperText="Must be between 3 and 60 characters"
                error={errors.name?.message}
                {...register('name')}
              />

              <Input
                label="Email address"
                type="email"
                required
                placeholder="name@example.com"
                autoComplete="email"
                error={errors.email?.message}
                {...register('email')}
              />

              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="8-16 chars, uppercase & special"
                autoComplete="new-password"
                error={errors.password?.message}
                {...register('password')}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
              />

              <PasswordStrength password={passwordValue} />

              <Textarea
                label="Address"
                rows={3}
                maxLength={400}
                placeholder="Your physical location address"
                error={errors.address?.message}
                {...register('address')}
              />

              <Button type="submit" loading={isSubmitting} className="w-full">
                Create account
              </Button>
            </form>

            <div className="mt-6 text-center text-xs text-slate-500 dark:text-[#9A9A9A]">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-slate-900 hover:underline dark:text-[#6C86FF]">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
