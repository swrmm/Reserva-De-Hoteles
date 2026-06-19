import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { ArrowRight, BedDouble, CalendarCheck, CircleDollarSign, Hotel, SearchCheck, Wrench } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { PageHeader } from '../components/ui/PageHeader';
import { StatusBadge } from '../components/ui/StatusBadge';
import { RoomCard } from '../components/RoomCard';
import { api } from '../services/api';
import type { DashboardStats, Reservation, Room } from '../types';
import { formatCurrency, formatDate } from '../utils/format';
import { useAuth } from '../hooks/useAuth';
import { hotelImages } from '../data/mockData';

const emptyDashboard: DashboardStats = {
  habitaciones: {
    total: 0,
    disponibles: 0,
    ocupadas: 0,
    mantenimiento: 0,
    inactivas: 0,
  },
  proximasReservas: [],
};

export function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>(emptyDashboard);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.rol !== 'admin') {
      Promise.allSettled([api.getReservations(), api.getRooms()]).then(([reservationList, roomList]) => {
        if (reservationList.status === 'fulfilled') setReservations(reservationList.value.data);
        if (roomList.status === 'fulfilled') setRooms(roomList.value.data);
        if (reservationList.status === 'rejected' || roomList.status === 'rejected') {
          setError('No pudimos sincronizar toda la información. Intenta nuevamente en unos minutos.');
        }
      });
      return;
    }

    Promise.allSettled([api.getDashboardStats(), api.getRooms(), api.getReservations()]).then(([dashboard, roomList, reservationList]) => {
      if (dashboard.status === 'fulfilled') setStats(dashboard.value.data);
      if (roomList.status === 'fulfilled') setRooms(roomList.value.data);
      if (reservationList.status === 'fulfilled') setReservations(reservationList.value.data);
      if ([dashboard, roomList, reservationList].some((item) => item.status === 'rejected')) {
        setError('No pudimos sincronizar toda la información. Intenta actualizar nuevamente en unos minutos.');
      }
    });
  }, [user?.rol]);

  const revenue = useMemo(() => reservations.reduce((sum, item) => sum + Number(item.total || 0), 0), [reservations]);
  const kpis: Array<{ label: string; value: ReactNode; Icon: LucideIcon }> = [
    { label: 'Total habitaciones', value: stats.habitaciones.total || rooms.length, Icon: Hotel },
    { label: 'Disponibles', value: stats.habitaciones.disponibles, Icon: BedDouble },
    { label: 'Ocupadas/reservadas', value: stats.habitaciones.ocupadas, Icon: CalendarCheck },
    { label: 'Mantenimiento', value: stats.habitaciones.mantenimiento, Icon: Wrench },
    { label: 'Reservas próximas', value: stats.proximasReservas?.length || reservations.length, Icon: SearchCheck },
    { label: 'Ingresos estimados', value: formatCurrency(revenue), Icon: CircleDollarSign },
  ];

  if (user?.rol !== 'admin') {
    return (
      <div>
        <section className="relative overflow-hidden rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-ink)] shadow-[var(--shadow-card)]">
          <img className="absolute inset-0 h-full w-full object-cover opacity-45" src={hotelImages.hero} alt="Hotel Bi Nario" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/88 via-slate-950/54 to-slate-950/20" />
          <div className="relative p-6 text-white lg:p-8">
            <div>
              <p className="inline-flex rounded-full border border-white/15 bg-white/12 px-3 py-1 text-xs font-black uppercase text-[var(--color-gold-light)]">
                Bienvenido, {user?.nombre || 'huésped'}
              </p>
              <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight md:text-5xl">
                Planea tu próxima estadía en Hotel Bi Nario
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-white/72">
                Explora habitaciones, revisa precios por noche y crea una reserva con disponibilidad real.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/habitaciones">
                  <Button variant="secondary" icon={<BedDouble size={17} />}>Ver habitaciones</Button>
                </Link>
                <Link to="/nueva-reserva">
                  <Button icon={<ArrowRight size={17} />}>Reservar ahora</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-black uppercase text-[var(--color-gold)]">Habitaciones</p>
              <h2 className="mt-2 text-3xl font-black text-[var(--color-ink)]">Elige antes de reservar</h2>
              <p className="mt-2 text-sm text-[var(--color-muted)]">Imagenes, capacidad y precio para decidir con calma.</p>
            </div>
            <Link to="/habitaciones">
                  <Button variant="secondary" icon={<ArrowRight size={17} />}>Ver catálogo</Button>
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {rooms.length === 0 ? (
              <div className="md:col-span-3">
                <EmptyState title="Habitaciones no disponibles" body="No pudimos cargar el catálogo en este momento." />
              </div>
            ) : (
              rooms.slice(0, 3).map((room) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  action={
                    <Link to={`/nueva-reserva?habitacionId=${room.id}&tipo=${room.tipo}&capacidad=${room.capacidad}`}>
                      <Button className="w-full">Reservar esta habitación</Button>
                    </Link>
                  }
                />
              ))
            )}
          </div>
        </section>

        <article className="mt-6 rounded-[2rem] border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-soft)]">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-[var(--color-ink)]">Tus próximas reservas</h2>
              <p className="text-sm text-[var(--color-muted)]">Revisa fechas, habitación, estado y total.</p>
            </div>
            <Link to="/perfil">
              <Button variant="secondary">Mi cuenta</Button>
            </Link>
          </div>

          {reservations.length === 0 ? (
            <EmptyState
              title="Aún no tienes reservas"
              body="Crea tu primera reserva para verla reflejada en tu cuenta."
              action={
                <Link to="/nueva-reserva">
                  <Button>Crear reserva</Button>
                </Link>
              }
            />
          ) : (
            <div className="grid gap-3">
              {reservations.slice(0, 4).map((reservation) => (
                <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4" key={reservation.id}>
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="font-black text-[var(--color-ink)]">
                        Habitación #{reservation.habitacion?.numero || reservation.habitacionId || reservation.habitacion_id}
                      </p>
                      <p className="mt-1 text-sm text-[var(--color-muted)]">
                        {formatDate(reservation.fecha_entrada)} al {formatDate(reservation.fecha_salida)}
                      </p>
                    </div>
                    <StatusBadge status={reservation.estado} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </article>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        eyebrow="Operación hotelera"
        title="Panel de reservas"
        body="Vista principal para monitorear habitaciones, próximas reservas e indicadores clave del hotel."
        action={
          <Link to="/nueva-reserva">
            <Button icon={<ArrowRight size={17} />}>Crear reserva</Button>
          </Link>
        }
      />
      {error && <p className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800">{error}</p>}

      <section className="grid gap-4 md:grid-cols-2 2xl:grid-cols-6">
        {kpis.map(({ label, value, Icon }) => (
          <article className="rounded-3xl border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-soft)]" key={label}>
            <div className="mb-4 grid h-11 w-11 place-items-center rounded-2xl bg-[var(--color-surface-warm)] text-[var(--color-primary)]">
              <Icon size={21} />
            </div>
            <p className="text-xs font-black uppercase text-[var(--color-muted)]">{label}</p>
            <strong className="mt-2 block text-2xl font-black text-[var(--color-ink)]">{value}</strong>
          </article>
        ))}
      </section>

      <section className="mt-6 grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
        <article className="rounded-[2rem] border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-soft)]">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-[var(--color-ink)]">Reservas recientes</h2>
              <p className="text-sm text-[var(--color-muted)]">Huésped, fecha, habitación y estado.</p>
            </div>
            <Link to="/reservas">
              <Button variant="secondary">Ver todo</Button>
            </Link>
          </div>
          {reservations.length === 0 ? (
            <EmptyState title="Sin reservas" body="Cuando se creen reservas aparecerán en este panel." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="text-xs uppercase text-[var(--color-muted)]">
                  <tr>
                    <th className="py-3">Huésped</th>
                    <th>Habitación</th>
                    <th>Entrada</th>
                    <th>Salida</th>
                    <th>Total</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]">
                  {reservations.slice(0, 6).map((reservation) => (
                    <tr key={reservation.id}>
                      <td className="py-4 font-black text-[var(--color-ink)]">{reservation.nombre_huesped}</td>
                      <td>#{reservation.habitacion?.numero || reservation.habitacionId || reservation.habitacion_id}</td>
                      <td>{formatDate(reservation.fecha_entrada)}</td>
                      <td>{formatDate(reservation.fecha_salida)}</td>
                      <td className="font-black">{formatCurrency(reservation.total)}</td>
                      <td>
                        <StatusBadge status={reservation.estado} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </article>

        <article className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-ink)] p-5 text-white shadow-[var(--shadow-card)]">
          <h2 className="text-xl font-black">Ocupación compacta</h2>
          <p className="mt-1 text-sm text-white/60">Lectura rapida del inventario.</p>
          <div className="mt-5 grid gap-3">
            {rooms.slice(0, 5).map((room) => (
              <div className="flex items-center justify-between gap-3 rounded-2xl bg-white/8 p-3" key={room.id}>
                <div>
                  <p className="font-black">Habitación {room.numero}</p>
                  <p className="text-xs capitalize text-white/50">{room.tipo}</p>
                </div>
                <StatusBadge status={room.estado} />
              </div>
            ))}
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <Link to="/habitaciones">
              <Button className="w-full" variant="secondary">
                Habitaciones
              </Button>
            </Link>
            <Link to="/disponibilidad">
              <Button className="w-full" variant="secondary">
                Buscar
              </Button>
            </Link>
          </div>
        </article>
      </section>
    </div>
  );
}
