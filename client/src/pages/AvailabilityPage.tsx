import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SearchCheck } from 'lucide-react';
import { RoomCard } from '../components/RoomCard';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { FormField, SelectField } from '../components/ui/FormField';
import { PageHeader } from '../components/ui/PageHeader';
import { Toast } from '../components/ui/Toast';
import { api } from '../services/api';
import type { Room, RoomType } from '../types';

export function AvailabilityPage() {
  const [filters, setFilters] = useState({ desde: '', hasta: '', capacidad: '2', tipo: '' as RoomType | '' });
  const [rooms, setRooms] = useState<Room[]>([]);
  const [toast, setToast] = useState({ message: '', type: 'success' as 'success' | 'error' });
  const dateError = filters.desde && filters.hasta && new Date(filters.hasta) <= new Date(filters.desde);

  const search = async (event: React.FormEvent) => {
    event.preventDefault();
    if (dateError) {
      setToast({ message: 'El rango de fechas no es valido.', type: 'error' });
      return;
    }
    try {
      const response = await api.getAvailability(filters);
      setRooms(response.data);
      setToast({ message: 'Disponibilidad actualizada.', type: 'success' });
    } catch (error) {
      setRooms([]);
      setToast({ message: error instanceof Error ? error.message : 'No pudimos actualizar la disponibilidad.', type: 'error' });
    }
  };

  return (
    <div>
      <PageHeader eyebrow="Búsqueda" title="Disponibilidad" body="Filtra habitaciones disponibles por rango de fechas, capacidad y tipo." />
      <section className="rounded-[2rem] border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-soft)]">
        <form className="grid gap-4 lg:grid-cols-[1fr_1fr_1fr_1fr_auto]" onSubmit={search}>
          <FormField label="Desde" type="date" value={filters.desde} onChange={(event) => setFilters({ ...filters, desde: event.target.value })} required />
          <FormField label="Hasta" type="date" value={filters.hasta} onChange={(event) => setFilters({ ...filters, hasta: event.target.value })} error={dateError ? 'Debe ser posterior' : ''} required />
          <FormField label="Capacidad" type="number" min="1" value={filters.capacidad} onChange={(event) => setFilters({ ...filters, capacidad: event.target.value })} />
          <SelectField label="Tipo" value={filters.tipo} onChange={(event) => setFilters({ ...filters, tipo: event.target.value as RoomType | '' })}>
            <option value="">Todos</option>
            <option value="individual">Individual</option>
            <option value="doble">Doble</option>
            <option value="suite">Suite</option>
            <option value="familiar">Familiar</option>
          </SelectField>
          <Button className="self-end" icon={<SearchCheck size={17} />}>
            Buscar
          </Button>
        </form>
      </section>
      <div className="mt-5">
        <Toast message={toast.message} type={toast.type} />
      </div>
      <section className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {rooms.length === 0 ? (
          <div className="md:col-span-2 xl:col-span-3">
            <EmptyState title="Sin resultados todavia" body="Selecciona un rango de fechas para consultar disponibilidad." />
          </div>
        ) : (
          rooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              action={
                <Link
                  to={`/nueva-reserva?habitacionId=${room.id}&desde=${filters.desde}&hasta=${filters.hasta}&capacidad=${filters.capacidad}&tipo=${room.tipo}`}
                >
                  <Button className="w-full">Crear reserva</Button>
                </Link>
              }
            />
          ))
        )}
      </section>
    </div>
  );
}
