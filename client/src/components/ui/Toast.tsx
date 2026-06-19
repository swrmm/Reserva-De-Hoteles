import { CheckCircle2, XCircle } from 'lucide-react';

export function Toast({ message, type }: { message: string; type: 'success' | 'error' }) {
  if (!message) return null;

  const isSuccess = type === 'success';
  return (
    <div
      className={`rounded-2xl border px-4 py-3 text-sm font-bold shadow-sm ${
        isSuccess
          ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
          : 'border-red-200 bg-red-50 text-red-800'
      }`}
      role="alert"
    >
      <span className="flex items-center gap-2">
        {isSuccess ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
        {message}
      </span>
    </div>
  );
}
