import type { ReservationStatus, RoomStatus } from '../../types';

const styles: Record<string, string> = {
  disponible: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  ocupada: 'bg-sky-50 text-sky-700 ring-sky-200',
  mantenimiento: 'bg-amber-50 text-amber-700 ring-amber-200',
  inactiva: 'bg-stone-100 text-stone-600 ring-stone-200',
  pendiente: 'bg-amber-50 text-amber-700 ring-amber-200',
  confirmada: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  cancelada: 'bg-red-50 text-red-700 ring-red-200',
  finalizada: 'bg-slate-100 text-slate-700 ring-slate-200',
};

export function StatusBadge({ status }: { status: RoomStatus | ReservationStatus }) {
  return (
    <span className={`inline-flex min-h-8 items-center rounded-full px-3 text-xs font-black capitalize ring-1 ${styles[status]}`}>
      {status}
    </span>
  );
}
