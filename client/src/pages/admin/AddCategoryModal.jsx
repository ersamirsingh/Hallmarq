import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { categoryApi } from '../../api/category.api';
import { Modal, Input, Button } from '../../components/ui';
import { toast } from 'sonner';

const addCategorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Max 50 characters')
});

export default function AddCategoryModal({ isOpen, onClose, onSuccess }) {
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(addCategorySchema),
    defaultValues: { name: '' }
  });

  const onSubmit = async ({ name }) => {
    setServerError('');
    try {
      await categoryApi.createCategory(name);
      toast.success('Category added successfully.');
      reset();
      onSuccess();
      onClose();
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to add category.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add store category">
      {serverError && (
        <div className="mb-4 rounded-lg bg-rose-50 p-3 text-xs font-medium text-rose-700 dark:bg-rose-950/50 dark:text-rose-300">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Category name"
          required
          placeholder="e.g. Electronics, Books, Dining"
          error={errors.name?.message}
          {...register('name')}
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" loading={isSubmitting}>
            Save category
          </Button>
        </div>
      </form>
    </Modal>
  );
}
