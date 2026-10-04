import { useEffect } from 'react';
import { X } from 'lucide-react';

export function Drawer({
  isOpen,
  onClose,
  title,
  children,
  width = 'max-w-md'
}) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="drawer-title"
    >
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div
          className={`relative w-screen ${width} border-l border-slate-200/90 bg-white shadow-2xl transition-all dark:border-[#262626] dark:bg-[#0F0F0F]`}
        >
          <div className="flex h-full flex-col overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 p-6 dark:border-[#262626]">
              <h2
                id="drawer-title"
                className="text-lg font-semibold tracking-tight text-slate-900 dark:text-[#FFFFFF]"
              >
                {title}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 dark:text-[#9A9A9A] dark:hover:bg-[#1A1A1A] dark:hover:text-[#FFFFFF] cursor-pointer"
                aria-label="Close panel"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 p-6">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Drawer;
