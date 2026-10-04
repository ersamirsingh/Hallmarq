import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useSearchParams } from 'react-router-dom';
import { Award, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import authApi from '../api/auth.api';
import { resetPasswordSchema } from '../lib/validators';
import { Input, Button, Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui';
import PasswordStrength from '../components/PasswordStrength';
import ThemeToggle from '../components/ThemeToggle';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '' }
  });

  const passwordValue = watch('password');

  const onSubmit = async ({ password }) => {
    setServerError('');
    try {
      await authApi.resetPassword({ token, newPassword: password });
      setSuccess(true);
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to reset password. The link may have expired.');
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 bg-stock-100 dark:bg-stock-950">
      <div className="absolute right-6 top-6">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-ink-900 text-white shadow-sm dark:bg-ink-100 dark:text-ink-950">
            <Award className="h-7 w-7" />
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-ink-950 dark:text-white">
            Set new password
          </h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create new password</CardTitle>
            <CardDescription>
              {success
                ? 'Your password has been reset successfully'
                : 'Choose a strong password to secure your account'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!token ? (
              <div className="text-center">
                <p className="text-sm text-rose-600 dark:text-rose-400">
                  Missing reset token. Please request a new link.
                </p>
                <Link to="/forgot-password" className="mt-4 inline-block">
                  <Button variant="outline" size="sm">
                    Request new link
                  </Button>
                </Link>
              </div>
            ) : success ? (
              <div className="space-y-4 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  You can now sign in using your new credentials.
                </p>
                <Link to="/login" className="inline-block pt-2">
                  <Button size="md">Continue to sign in</Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {serverError && (
                  <div className="rounded-lg bg-rose-50 p-3 text-xs font-medium text-rose-700 dark:bg-rose-950/50 dark:text-rose-300">
                    {serverError}
                  </div>
                )}

                <Input
                  label="New password"
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

                <Button type="submit" loading={isSubmitting} className="w-full">
                  Update password
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
