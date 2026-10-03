import { useState } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import authApi from '../api/auth.api';
import { toast } from 'sonner';

export default function VerifyBanner() {
  const { user } = useAuth();
  const [sending, setSending] = useState(false);

  if (!user || user.emailVerified) return null;

  const handleResend = async () => {
    setSending(true);
    try {
      const res = await authApi.resendVerification();
      toast.success(res.message || 'Verification email sent. Please check your inbox.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send verification email.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="border-b border-amber-200 bg-amber-50 px-4 py-2.5 text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <span>Your email address is not verified yet. Check your inbox or request a new link.</span>
        </div>
        <button
          type="button"
          onClick={handleResend}
          disabled={sending}
          className="inline-flex shrink-0 items-center gap-1.5 font-semibold text-amber-900 underline hover:no-underline disabled:opacity-50 dark:text-amber-200"
        >
          {sending && <Loader2 className="h-3 w-3 animate-spin" />}
          <span>Resend email</span>
        </button>
      </div>
    </div>
  );
}
