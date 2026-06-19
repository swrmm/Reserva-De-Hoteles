import { AlertTriangle } from 'lucide-react';
import { Button } from './Button';

export function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel = 'Confirmar',
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title: string;
  body: string;
  confirmLabel?: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="w-full max-w-md rounded-3xl border border-white/50 bg-white p-6 shadow-2xl">
        <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-red-50 text-red-700">
          <AlertTriangle size={22} />
        </div>
        <h2 className="text-xl font-black text-[var(--color-ink)]">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">{body}</p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" type="button" onClick={onCancel}>
            Cancelar
          </Button>
          <Button variant="danger" type="button" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
