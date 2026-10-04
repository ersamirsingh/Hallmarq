import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { profileApi } from '../../api/profile.api';
import { changePasswordSchema } from '../../lib/validators';
import { Input, Button, Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui';
import PasswordStrength from '../../components/PasswordStrength';
import { toast } from 'sonner';

export default function ChangePasswordForm() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: '', newPassword: '' }
  });

  const newPasswordValue = watch('newPassword');

  const onSubmit = async (values) => {
    setServerError('');
    try {
      const res = await profileApi.changePassword(values);
      toast.success(res.message || 'Password updated. Other sessions have been signed out.');
      reset();
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to update password.');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change password</CardTitle>
        <CardDescription>Ensure your account is using a long, random password to stay secure</CardDescription>
      </CardHeader>
      <CardContent>
        {serverError && (
          <div className="mb-4 rounded-lg bg-rose-50 p-3 text-xs font-medium text-rose-700 dark:bg-rose-950/50 dark:text-rose-300">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="relative">
            <Input
              label="Current password"
              type={showCurrent ? 'text' : 'password'}
              required
              autoComplete="current-password"
              error={errors.currentPassword?.message}
              {...register('currentPassword')}
            />
            <button
              type="button"
              onClick={() => setShowCurrent((prev) => !prev)}
              className="absolute right-3.5 top-8.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              aria-label={showCurrent ? 'Hide password' : 'Show password'}
            >
              {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          <div className="relative">
            <Input
              label="New password"
              type={showNew ? 'text' : 'password'}
              required
              placeholder="8-16 chars, uppercase & special"
              autoComplete="new-password"
              error={errors.newPassword?.message}
              {...register('newPassword')}
            />
            <button
              type="button"
              onClick={() => setShowNew((prev) => !prev)}
              className="absolute right-3.5 top-8.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              aria-label={showNew ? 'Hide password' : 'Show password'}
            >
              {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          <PasswordStrength password={newPasswordValue} />

          <div className="flex justify-end">
            <Button type="submit" loading={isSubmitting}>
              Update password
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
