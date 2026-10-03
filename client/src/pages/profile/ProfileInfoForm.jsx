import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AlertTriangle } from 'lucide-react';
import { profileApi } from '../../api/profile.api';
import { useAuth } from '../../context/AuthContext';
import { Input, Textarea, Button, Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui';
import { toast } from 'sonner';

const profileInfoSchema = z.object({
  name: z.string().min(20, 'Name must be at least 20 characters').max(60, 'Name must not exceed 60 characters'),
  email: z.string().email('Please enter a valid email address'),
  address: z.string().max(400, 'Address must not exceed 400 characters').optional().default('')
});

export default function ProfileInfoForm() {
  const { user, setUser } = useAuth();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(profileInfoSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      address: user?.address || ''
    }
  });

  const currentEmail = watch('email');
  const emailChanged = user && currentEmail !== user.email;

  const onSubmit = async (values) => {
    setServerError('');
    try {
      const res = await profileApi.updateProfile(values);
      setUser(res.user);
      toast.success(res.message || 'Profile updated successfully.');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to update profile.');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal information</CardTitle>
        <CardDescription>Update your public name, email address, and physical location</CardDescription>
      </CardHeader>
      <CardContent>
        {serverError && (
          <div className="mb-4 rounded-lg bg-rose-50 p-3 text-xs font-medium text-rose-700 dark:bg-rose-950/50 dark:text-rose-300">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Full name"
            required
            helperText="Must be between 20 and 60 characters"
            error={errors.name?.message}
            {...register('name')}
          />

          <div>
            <Input
              label="Email address"
              type="email"
              required
              error={errors.email?.message}
              {...register('email')}
            />
            {emailChanged && (
              <div className="mt-2 flex items-center gap-2 rounded-lg bg-amber-50 p-2.5 text-xs text-amber-800 dark:bg-amber-950/50 dark:text-amber-300">
                <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                <span>Changing your email will mark it unverified and require re-verification.</span>
              </div>
            )}
          </div>

          <Textarea
            label="Address"
            rows={3}
            maxLength={400}
            placeholder="Home or business address"
            error={errors.address?.message}
            {...register('address')}
          />

          <div className="flex justify-end">
            <Button type="submit" loading={isSubmitting}>
              Save changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
