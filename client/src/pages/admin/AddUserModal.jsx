import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { adminApi } from '../../api/admin.api';
import { passwordSchema } from '../../lib/validators';
import { Modal, Input, Textarea, Select, Button } from '../../components/ui';
import { toast } from 'sonner';

const addUserSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(60, 'Name must not exceed 60 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: passwordSchema,
  address: z.string().min(1, 'Address is required').max(400, 'Address must not exceed 400 characters'),
  role: z.enum(['ADMIN', 'USER', 'STORE_OWNER', 'OWNER'])
});

export default function AddUserModal({ isOpen, onClose, onSuccess }) {
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(addUserSchema),
    defaultValues: { name: '', email: '', password: '', address: '', role: 'USER' }
  });

  const onSubmit = async (values) => {
    setServerError('');
    try {
      const payload = {
        ...values,
        role: values.role === 'STORE_OWNER' ? 'OWNER' : values.role
      };
      await adminApi.createUser(payload);
      toast.success('User created successfully.');
      reset();
      onSuccess?.();
      onClose();
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to create user.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add new user">
      {serverError && (
        <div className="mb-4 rounded-lg bg-rose-50 p-3 text-xs font-medium text-rose-700 dark:bg-rose-950/50 dark:text-rose-300">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Full name"
          required
          placeholder="Between 3 and 60 characters"
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="Email address"
          type="email"
          required
          placeholder="name@example.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Password"
          type="password"
          required
          placeholder="8-16 chars, uppercase & special"
          error={errors.password?.message}
          {...register('password')}
        />

        <Select
          label="Role"
          required
          error={errors.role?.message}
          options={[
            { value: 'USER', label: 'Normal User' },
            { value: 'OWNER', label: 'Store Owner' },
            { value: 'ADMIN', label: 'System Administrator' }
          ]}
          {...register('role')}
        />

        <Textarea
          label="Address"
          required
          rows={3}
          maxLength={400}
          placeholder="User physical address"
          error={errors.address?.message}
          {...register('address')}
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" loading={isSubmitting}>
            Add user
          </Button>
        </div>
      </form>
    </Modal>
  );
}
