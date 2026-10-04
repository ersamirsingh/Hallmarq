import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Award, ArrowLeft, MailCheck } from 'lucide-react';
import authApi from '../api/auth.api';
import { forgotPasswordSchema } from '../lib/validators';
import { Input, Button, Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui';
import ThemeToggle from '../components/ThemeToggle';

export default function ForgotPassword() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' }
  });

  const onSubmit = async ({ email }) => {
    setServerError('');
    try {
      await authApi.forgotPassword(email);
      setSubmitted(true);
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to submit request.');
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 bg-slate-50 dark:bg-[#000000]">
      <div className="absolute right-6 top-6">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm dark:bg-[#6C86FF] dark:text-[#111111]">
            <Award className="h-6 w-6" />
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-[#FFFFFF]">
            Reset password
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-[#9A9A9A]">
            Request a secure password reset link
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Forgot password</CardTitle>
            <CardDescription>
              {submitted
                ? 'Check your inbox for instructions'
                : 'Enter your account email to receive a reset link'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {submitted ? (
              <div className="space-y-4 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                  <MailCheck className="h-6 w-6" />
                </div>
                <p className="text-sm text-slate-600 dark:text-[#9A9A9A]">
                  If an account exists for that email, we have sent instructions to reset your password.
                </p>
                <Link to="/login" className="inline-block pt-2">
                  <Button variant="outline" size="sm">
                    Back to sign in
                  </Button>
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
                  label="Email address"
                  type="email"
                  required
                  placeholder="name@example.com"
                  autoComplete="email"
                  error={errors.email?.message}
                  {...register('email')}
                />

                <Button type="submit" loading={isSubmitting} className="w-full">
                  Send reset link
                </Button>

                <div className="pt-2 text-center">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-[#6C86FF] dark:hover:underline"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Back to sign in</span>
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
