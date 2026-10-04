import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Award, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import authApi from '../api/auth.api';
import { useAuth } from '../context/AuthContext';
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui';
import ThemeToggle from '../components/ThemeToggle';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { refreshUser } = useAuth();

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setSuccess(false);
      setMessage('No verification token provided in the link.');
      return;
    }

    let isMounted = true;
    authApi
      .verifyEmail(token)
      .then((res) => {
        if (isMounted) {
          setSuccess(true);
          setMessage(res.message || 'Your email address has been verified.');
          refreshUser();
        }
      })
      .catch((err) => {
        if (isMounted) {
          setSuccess(false);
          setMessage(err.response?.data?.message || 'Verification link is invalid or expired.');
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [token, refreshUser]);

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
            Email verification
          </h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Verify your email</CardTitle>
            <CardDescription>Confirming your email address</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <Loader2 className="h-8 w-8 animate-spin text-ink-800 dark:text-[#6C86FF]" />
                <p className="mt-3 text-sm text-stock-500 dark:text-[#9A9A9A]">Verifying link...</p>
              </div>
            ) : success ? (
              <div className="space-y-4 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <p className="text-sm font-medium text-slate-800 dark:text-[#FFFFFF]">{message}</p>
                <Link to="/stores" className="inline-block pt-2">
                  <Button size="md">Continue to stores</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400">
                  <XCircle className="h-6 w-6" />
                </div>
                <p className="text-sm text-rose-600 dark:text-rose-400">{message}</p>
                <Link to="/login" className="inline-block pt-2">
                  <Button variant="outline" size="sm">
                    Back to sign in
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
