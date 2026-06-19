import { BedDouble, Users } from 'lucide-react';
import type { Room } from '../types';
import { formatCurrency } from '../utils/format';
import { StatusBadge } from './ui/StatusBadge';
import { roomTypeImages } from '../data/mockData';

export function RoomCard({ room, action }: { room: Room; action?: React.ReactNode }) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-[var(--color-border)] bg-white shadow-[var(--shadow-soft)] transition duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-card)]">
      <div className="aspect-[16/10] overflow-hidden bg-[var(--color-surface-warm)]">
        <img
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          src={room.image || roomTypeImages[room.tipo]}
          alt={`Habitación ${room.numero}`}
          loading="lazy"
        />
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase text-[var(--color-gold)]">Habitación {room.numero}</p>
            <h3 className="mt-1 text-xl font-black capitalize text-[var(--color-ink)]">{room.tipo}</h3>
          </div>
          <StatusBadge status={room.estado} />
        </div>
        <p className="mt-3 min-h-12 text-sm leading-6 text-[var(--color-muted)]">{room.descripcion}</p>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm font-bold text-[var(--color-muted)]">
          <span className="inline-flex items-center gap-2">
            <Users size={16} /> {room.capacidad} huéspedes
          </span>
          <span className="inline-flex items-center gap-2">
            <BedDouble size={16} /> {formatCurrency(room.precio_noche)}
          </span>
        </div>
        {action && <div className="mt-5">{action}</div>}
      </div>
    </article>
  );
}
