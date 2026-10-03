import { useState, useEffect } from 'react';
import { storesApi } from '../api/stores.api';
import { Modal, Textarea, Button } from './ui';
import StarRating from './StarRating';
import { toast } from 'sonner';

export default function RateStoreModal({ isOpen, onClose, store, onSuccess }) {
  const [value, setValue] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const isEditing = Boolean(store?.myRating);

  useEffect(() => {
    if (store?.myRating) {
      setValue(store.myRating.value);
      setComment(store.myRating.comment || '');
    } else {
      setValue(0);
      setComment('');
    }
    setServerError('');
  }, [store, isOpen]);

  if (!store) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (value < 1 || value > 5) {
      setServerError('Please select a star rating between 1 and 5.');
      return;
    }

    setLoading(true);
    setServerError('');
    try {
      await storesApi.rateStore(store.id, {
        value,
        comment: comment.trim() || undefined
      });
      toast.success(isEditing ? 'Rating updated successfully.' : 'Rating submitted successfully.');
      onSuccess();
      onClose();
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to submit rating.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? `Update rating for ${store.name}` : `Rate ${store.name}`}>
      {serverError && (
        <div className="mb-4 rounded-lg bg-rose-50 p-3 text-xs font-medium text-rose-700 dark:bg-rose-950/50 dark:text-rose-300">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Select your rating (1-5 stars)
          </label>
          <div className="flex items-center gap-3">
            <StarRating value={value} onChange={setValue} interactive size="lg" />
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              {value > 0 ? `${value} of 5` : 'Choose stars'}
            </span>
          </div>
        </div>

        <Textarea
          label="Written comment (optional)"
          rows={4}
          maxLength={500}
          placeholder="Describe your customer experience with this store..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" loading={loading} disabled={value === 0}>
            {isEditing ? 'Update rating' : 'Submit rating'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
