import { useEffect, useMemo, useState } from 'react';
import { Ban, CalendarPlus, Edit3 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { FormField, SelectField, TextareaField } from '../components/ui/FormField';
import { PageHeader } from '../components/ui/PageHeader';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Toast } from '../components/ui/Toast';
import { api } from '../services/api';
import type { Reservation, ReservationStatus, Room } from '../types';
import { formatCurrency, formatDate, nightsBetween } from '../utils/format';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

const blankReservation = {
  habitacion_id: '',
  nombre_huesped: '',
  email_huesped: '',
  fecha_entrada: '',
  fecha_salida: '',
  estado: 'pendiente' as ReservationStatus,
  extras_total: 0,
  observaciones: '',
  origen: 'web',
};

export function ReservationsPage() {
  const { user } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [form, setForm] = useState(blankReservation);
  const [editing, setEditing] = useState<Reservation | null>(null);
  const [toast, setToast] = useState({ message: '', type: 'success' as 'success' | 'error' });

  const selectedRoom = rooms.find((room) => String(room.id) === String(form.habitacion_id));
  const nights = nightsBetween(form.fecha_entrada, form.fecha_salida);
  const total = nights * Number(selectedRoom?.precio_noche || 0) + Number(form.extras_total || 0);

  const loadData = async () => {
    if (user?.rol === 'admin') {
      const [roomsResult, reservationsResult] = await Promise.allSettled([api.getRooms(), api.getReservations()]);
      if (roomsResult.status === 'fulfilled') setRooms(roomsResult.value.data);
      if (reservationsResult.status === 'fulfilled') setReservations(reservationsResult.value.data);
      if (roomsResult.status === 'rejected' || reservationsResult.status === 'rejected') {
        setToast({ message: 'No pudimos actualizar toda la información de reservas.', type: 'error' });
      }
      return;
    }

    try {
      const reservationsResult = await api.getReservations();
      setReservations(reservationsResult.data);
    } catch {
      setToast({ message: 'No pudimos actualizar tus reservas.', type: 'error' });
    }
  };

  useEffect(() => {
    loadData();
  }, [user?.rol]);

  const dateError = form.fecha_entrada && form.fecha_salida && new Date(form.fecha_salida) <= new Date(form.fecha_entrada);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (dateError) {
      setToast({ message: 'La fecha de salida debe ser posterior a la fecha de entrada.', type: 'error' });
      return;
    }

    const payload = {
      ...form,
      habitacion_id: Number(form.habitacion_id),
      extras_total: Number(form.extras_total),
    };

    try {
      if (editing) {
        await api.updateReservation(editing.id, payload);
        setToast({ message: 'Reserva actualizada.', type: 'success' });
      } else {
        await api.createReservation(payload);
        setToast({ message: 'Reserva creada.', type: 'success' });
      }
      setForm(blankReservation);
      setEditing(null);
      await loadData();
    } catch (error) {
      setToast({
        message: error instanceof Error ? error.message : 'No pudimos guardar. Revisa fechas, disponibilidad o datos obligatorios.',
        type: 'error',
      });
    }
  };

  const startEdit = (reservation: Reservation) => {
    setEditing(reservation);
    setForm({
      habitacion_id: String(reservation.habitacion?.id || reservation.habitacionId || reservation.habitacion_id || ''),
      nombre_huesped: reservation.nombre_huesped,
      email_huesped: reservation.email_huesped,
      fecha_entrada: reservation.fecha_entrada,
      fecha_salida: reservation.fecha_salida,
      estado: reservation.estado,
      extras_total: Number(reservation.extras_total || 0),
      observaciones: reservation.observaciones || '',
      origen: 'web',
    });
  };

  const cancelReservation = async (reservation: Reservation) => {
    try {
      await api.cancelReservation(reservation.id);
      setToast({ message: 'Reserva cancelada.', type: 'success' });
      await loadData();
    } catch (error) {
      setToast({ message: error instanceof Error ? error.message : 'No se pudo cancelar la reserva.', type: 'error' });
    }
  };

  const roomOptions = useMemo(() => rooms.filter((room) => room.activo !== false), [rooms]);
  const canCancel = (reservation: Reservation) => !['cancelada', 'finalizada'].includes(reservation.estado);

  return (
    <div>
      <PageHeader
        eyebrow={user?.rol === 'admin' ? 'Gestión' : 'Estadías'}
        title={user?.rol === 'admin' ? 'Reservas' : 'Mis reservas'}
        body={
          user?.rol === 'admin'
            ? 'Organiza estadías, fechas, huéspedes, extras y estados de cada reserva.'
            : 'Revisa tus estadías, fechas, habitación asignada y estado de cada reserva.'
        }
        action={
          user?.rol !== 'admin' && (
            <Link to="/nueva-reserva">
              <Button>Crear reserva</Button>
            </Link>
          )
        }
      />
      <Toast message={toast.message} type={toast.type} />

      <section className={`mt-5 grid gap-5 ${user?.rol === 'admin' ? '2xl:grid-cols-[1.1fr_0.9fr]' : ''}`}>
        <article className="rounded-[2rem] border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-soft)]">
          <h2 className="text-xl font-black text-[var(--color-ink)]">Listado de reservas</h2>
          <div className="mt-5 grid gap-3">
            {reservations.length === 0 ? (
              <EmptyState title="Sin reservas" body="Crea una reserva para verla en este listado." />
            ) : (
              reservations.map((reservation) => (
                <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4" key={reservation.id}>
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-lg font-black text-[var(--color-ink)]">{reservation.nombre_huesped}</p>
                      <p className="mt-1 text-sm text-[var(--color-muted)]">
                        Habitación #{reservation.habitacion?.numero || reservation.habitacionId || reservation.habitacion_id} · {formatDate(reservation.fecha_entrada)} al {formatDate(reservation.fecha_salida)}
                      </p>
                      <p className="mt-2 text-sm font-black text-[var(--color-primary)]">{formatCurrency(reservation.total)}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={reservation.estado} />
                      {user?.rol === 'admin' && (
                        <Button variant="secondary" icon={<Edit3 size={15} />} onClick={() => startEdit(reservation)}>
                          Editar
                        </Button>
                      )}
                      {canCancel(reservation) && (
                        <Button variant="danger" icon={<Ban size={15} />} onClick={() => cancelReservation(reservation)}>
                          Cancelar
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </article>

        {user?.rol === 'admin' && (
        <article className="h-fit rounded-[2rem] border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-card)]">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-black uppercase text-[var(--color-gold)]">Formulario</p>
              <h2 className="text-2xl font-black text-[var(--color-ink)]">{editing ? 'Editar reserva' : 'Crear reserva'}</h2>
            </div>
            <CalendarPlus className="text-[var(--color-primary)]" />
          </div>
          <form className="grid gap-4" onSubmit={submit}>
            <SelectField label="Habitación" value={form.habitacion_id} onChange={(event) => setForm({ ...form, habitacion_id: event.target.value })} required>
              <option value="">Seleccionar</option>
              {roomOptions.map((room) => (
                <option key={room.id} value={room.id}>
                  #{room.numero} · {room.tipo} · {formatCurrency(room.precio_noche)}
                </option>
              ))}
            </SelectField>
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Huésped" value={form.nombre_huesped} onChange={(event) => setForm({ ...form, nombre_huesped: event.target.value })} required />
              <FormField label="Email/contacto" type="email" value={form.email_huesped} onChange={(event) => setForm({ ...form, email_huesped: event.target.value })} required />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Fecha entrada" type="date" value={form.fecha_entrada} onChange={(event) => setForm({ ...form, fecha_entrada: event.target.value })} required />
              <FormField label="Fecha salida" type="date" value={form.fecha_salida} onChange={(event) => setForm({ ...form, fecha_salida: event.target.value })} error={dateError ? 'Debe ser posterior a la entrada' : ''} required />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <SelectField label="Estado" value={form.estado} onChange={(event) => setForm({ ...form, estado: event.target.value as ReservationStatus })}>
                <option value="pendiente">Pendiente</option>
                <option value="confirmada">Confirmada</option>
                <option value="cancelada">Cancelada</option>
                <option value="finalizada">Finalizada</option>
              </SelectField>
              <FormField label="Extras" type="number" min="0" value={form.extras_total} onChange={(event) => setForm({ ...form, extras_total: Number(event.target.value) })} />
            </div>
            <TextareaField label="Observaciones" value={form.observaciones} onChange={(event) => setForm({ ...form, observaciones: event.target.value })} />
            <div className="rounded-3xl bg-[var(--color-surface-warm)] p-4">
              <p className="text-xs font-black uppercase text-[var(--color-muted)]">Resumen</p>
              <p className="mt-2 text-sm text-[var(--color-muted)]">
                {nights} noches x {formatCurrency(selectedRoom?.precio_noche || 0)} + extras
              </p>
              <p className="mt-2 text-2xl font-black text-[var(--color-ink)]">{formatCurrency(total)}</p>
            </div>
            <Button>{editing ? 'Guardar cambios' : 'Crear reserva'}</Button>
          </form>
        </article>
        )}
      </section>
    </div>
  );
}
