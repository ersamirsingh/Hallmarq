import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { adminApi } from '../../api/admin.api';
import { categoryApi } from '../../api/category.api';
import { Modal, Input, Textarea, Select, Button } from '../../components/ui';
import { toast } from 'sonner';

const addStoreSchema = z.object({
  name: z.string().min(1, 'Store name is required').max(100, 'Max 100 characters'),
  email: z.string().email('Please enter a valid email address'),
  address: z.string().min(1, 'Address is required').max(400, 'Max 400 characters'),
  categoryId: z.coerce.number().min(1, 'Please select a category'),
  ownerId: z.coerce.number().optional().nullable()
});

export default function AddStoreModal({ isOpen, onClose, onSuccess }) {
  const [categories, setCategories] = useState([]);
  const [owners, setOwners] = useState([]);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(addStoreSchema),
    defaultValues: { name: '', email: '', address: '', categoryId: '', ownerId: '' }
  });

  useEffect(() => {
    if (!isOpen) return;
    Promise.all([categoryApi.getCategories(), adminApi.getAvailableOwners()])
      .then(([catRes, ownerRes]) => {
        setCategories(catRes.categories || catRes.data || []);
        setOwners(ownerRes.owners || ownerRes.data || []);
      })
      .catch(() => {});
  }, [isOpen]);

  const onSubmit = async (values) => {
    setServerError('');
    try {
      const payload = {
        name: values.name,
        email: values.email,
        address: values.address,
        categoryId: Number(values.categoryId),
        ownerId: values.ownerId ? Number(values.ownerId) : undefined
      };
      await adminApi.createStore(payload);
      toast.success('Store created successfully.');
      reset();
      onSuccess?.();
      onClose();
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to create store.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add new store">
      {serverError && (
        <div className="mb-4 rounded-lg bg-rose-50 p-3 text-xs font-medium text-rose-700 dark:bg-rose-950/50 dark:text-rose-300">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Store name"
          required
          placeholder="e.g. Blue Bottle Coffee"
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="Contact email"
          type="email"
          required
          placeholder="contact@store.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <Select
          label="Category"
          required
          placeholder="Select a category"
          error={errors.categoryId?.message}
          options={categories.map((c) => ({ value: c.id, label: c.name }))}
          {...register('categoryId')}
        />

        <Select
          label="Assigned owner (optional)"
          placeholder="None (unassigned)"
          error={errors.ownerId?.message}
          options={owners.map((o) => ({ value: o.id, label: `${o.name} (${o.email})` }))}
          {...register('ownerId')}
        />

        <Textarea
          label="Physical address"
          required
          rows={3}
          maxLength={400}
          placeholder="Store location address"
          error={errors.address?.message}
          {...register('address')}
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" loading={isSubmitting}>
            Add store
          </Button>
        </div>
      </form>
    </Modal>
  );
}
