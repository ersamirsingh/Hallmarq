import { useState, useEffect } from 'react';
import { Trash2, AlertCircle } from 'lucide-react';
import { storesApi } from '../api/stores.api';
import { Modal, Textarea, Button } from './ui';
import StarRating from './StarRating';
import { toast } from 'sonner';

export default function RateStoreModal({ isOpen, onClose, store, onSuccess }) {
  const existingValue = typeof store?.myRating === 'object' ? store?.myRating?.value : store?.myRating;
  const existingComment = typeof store?.myRating === 'object' ? store?.myRating?.comment : (store?.myComment || '');
  const isEditing = Boolean(existingValue && Number(existingValue) > 0);

  const [value, setValue] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    if (existingValue && Number(existingValue) > 0) {
      setValue(Number(existingValue));
      setComment(existingComment || '');
    } else {
      setValue(0);
      setComment('');
    }
    setServerError('');
    setConfirmDelete(false);
  }, [store, isOpen, existingValue, existingComment]);

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
      onSuccess?.();
      onClose();
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to submit rating.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setDeleting(true);
    setServerError('');
    try {
      await storesApi.deleteRating(store.id);
      toast.success('Your rating has been removed.');
      onSuccess?.();
      onClose();
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to remove rating.');
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Update rating for ${store.name}` : `Rate ${store.name}`}
    >
      {serverError && (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs font-medium text-rose-700 dark:bg-rose-950/50 dark:border-rose-900/60 dark:text-rose-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      {isEditing && !confirmDelete && (
        <div className="mb-4 rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 text-xs text-amber-800 dark:text-amber-200">
          You previously gave this store <span className="font-bold">{existingValue} stars</span>. Modify your stars or comments below, or remove your rating.
        </div>
      )}

      {confirmDelete && (
        <div className="mb-4 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700 dark:bg-rose-950/50 dark:border-rose-900 dark:text-rose-300 flex items-center justify-between gap-3">
          <span>Are you sure you want to remove your rating?</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              className="text-xs font-semibold text-slate-600 hover:text-slate-800 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 underline"
            >
              {deleting ? 'Removing...' : 'Confirm'}
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-xs font-semibold text-slate-700 dark:text-slate-300">
            {isEditing ? 'Update your star rating (1-5 stars)' : 'Select your rating (1-5 stars)'}
          </label>
          <div className="flex items-center gap-3">
            <StarRating value={value} onChange={setValue} interactive size="lg" />
            <span className={`text-sm font-bold ${value > 0 ? 'text-amber-500' : 'text-slate-400'}`}>
              {value > 0 ? `${value} of 5 stars` : 'Choose stars'}
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

        <div className="flex items-center justify-between gap-3 pt-2">
          {isEditing ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              disabled={loading || deleting}
              className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              <span>Remove</span>
            </Button>
          ) : (
            <div />
          )}

          <div className="flex gap-3">
            <Button variant="outline" type="button" onClick={onClose} disabled={loading || deleting}>
              Cancel
            </Button>
            <Button type="submit" loading={loading} disabled={value === 0 || deleting}>
              {isEditing ? 'Update rating' : 'Submit rating'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
