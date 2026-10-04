export default function PasswordStrength({ password = '' }) {
  if (!password) return null;

  const checks = [
    password.length >= 8 && password.length <= 16,
    /[A-Z]/.test(password),
    /[a-z]/.test(password),
    /[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password)
  ];

  const score = checks.filter(Boolean).length;

  const getLabel = () => {
    switch (score) {
      case 1:
        return { text: 'Weak', color: 'text-rose-500' };
      case 2:
        return { text: 'Fair', color: 'text-amber-500' };
      case 3:
        return { text: 'Good', color: 'text-indigo-500' };
      case 4:
        return { text: 'Strong', color: 'text-emerald-500' };
      default:
        return { text: 'Too short', color: 'text-slate-400' };
    }
  };

  const label = getLabel();

  const getSegmentColor = (index) => {
    if (index >= score) return 'bg-slate-200 dark:bg-slate-800';
    if (score === 1) return 'bg-rose-500';
    if (score === 2) return 'bg-amber-500';
    if (score === 3) return 'bg-indigo-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1.5">
        {[0, 1, 2, 3].map((idx) => (
          <div
            key={idx}
            className={`h-1.5 flex-1 rounded-full transition-colors ${getSegmentColor(idx)}`}
          />
        ))}
      </div>
      <div className="flex justify-between text-[11px]">
        <span className="text-slate-500 dark:text-slate-400 font-medium">Password strength</span>
        <span className={`font-semibold ${label.color}`}>{label.text}</span>
      </div>
    </div>
  );
}
