import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { CalendarCheck, Mail, ShieldCheck, UserRound, UsersRound } from 'lucide-react';
import { EmptyState } from '../components/ui/EmptyState';
import { PageHeader } from '../components/ui/PageHeader';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Toast } from '../components/ui/Toast';
import { api } from '../services/api';
import type { User } from '../types';
import { formatCurrency, formatDate } from '../utils/format';
import { useAuth } from '../hooks/useAuth';

const formatCreatedAt = (value?: string) => {
  if (!value) return 'Sin fecha';
  return new Intl.DateTimeFormat('es-CL', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
};

export function CustomersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [toast, setToast] = useState({ message: '', type: 'success' as 'success' | 'error' });

  useEffect(() => {
    if (user?.rol !== 'admin') return;
    api
      .getUsers()
      .then((response) => setUsers(response.data))
      .catch((error) =>
        setToast({
          message: error instanceof Error ? error.message : 'No pudimos cargar los clientes registrados.',
          type: 'error',
        })
      );
  }, [user?.rol]);

  const stats = useMemo(() => {
    const customers = users.filter((item) => item.rol !== 'admin');
    const reservations = users.flatMap((item) => item.reservas || []);
    const revenue = reservations.reduce((sum, reservation) => sum + Number(reservation.total || 0), 0);
    return {
      customers: customers.length,
      reservations: reservations.length,
      revenue,
    };
  }, [users]);

  if (user?.rol !== 'admin') {
    return <EmptyState title="Acceso restringido" body="Esta vista solo esta disponible para administradores." />;
  }

  return (
    <div>
      <PageHeader
        eyebrow="Administración"
        title="Clientes registrados"
        body="Consulta las cuentas creadas desde la web y las reservas asociadas para defender el flujo completo del sistema."
      />
      <Toast message={toast.message} type={toast.type} />

      <section className="mb-5 grid gap-4 md:grid-cols-3">
        <MetricCard icon={<UsersRound size={20} />} label="Clientes" value={String(stats.customers)} />
        <MetricCard icon={<CalendarCheck size={20} />} label="Reservas" value={String(stats.reservations)} />
        <MetricCard icon={<ShieldCheck size={20} />} label="Total reservado" value={formatCurrency(stats.revenue)} />
      </section>

      <section className="rounded-[2rem] border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-card)]">
        {users.length === 0 ? (
          <EmptyState title="Sin usuarios" body="Cuando alguien se registre desde la página, aparecerá en este listado." />
        ) : (
          <div className="grid gap-4">
            {users.map((item) => {
              const reservations = item.reservas || [];
              const total = reservations.reduce((sum, reservation) => sum + Number(reservation.total || 0), 0);
              return (
                <article className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4" key={item.id}>
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex gap-4">
                      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[var(--color-ink)] text-white">
                        <UserRound size={20} />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-lg font-black text-[var(--color-ink)]">{item.nombre}</h2>
                          <span className="rounded-full bg-white px-3 py-1 text-xs font-black uppercase text-[var(--color-muted)]">
                            {item.rol === 'admin' ? 'Admin' : 'Usuario'}
                          </span>
                        </div>
                        <p className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-[var(--color-muted)]">
                          <Mail size={15} /> {item.email}
                        </p>
                        <p className="mt-1 text-xs font-bold text-[var(--color-muted)]">Registro: {formatCreatedAt(item.createdAt)}</p>
                      </div>
                    </div>

                    <div className="grid min-w-56 grid-cols-2 gap-3 rounded-2xl bg-white p-3 text-center">
                      <div>
                        <p className="text-xs font-black uppercase text-[var(--color-muted)]">Reservas</p>
                        <p className="mt-1 text-xl font-black text-[var(--color-ink)]">{reservations.length}</p>
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase text-[var(--color-muted)]">Total</p>
                        <p className="mt-1 text-xl font-black text-[var(--color-ink)]">{formatCurrency(total)}</p>
                      </div>
                    </div>
                  </div>

                  {reservations.length > 0 && (
                    <div className="mt-4 grid gap-2">
                      {reservations.slice(0, 3).map((reservation) => (
                        <div className="flex flex-col gap-2 rounded-2xl bg-white px-4 py-3 md:flex-row md:items-center md:justify-between" key={reservation.id}>
                          <div>
                            <p className="text-sm font-black text-[var(--color-ink)]">
                              Habitación #{reservation.habitacion?.numero || reservation.habitacionId || reservation.habitacion_id}
                            </p>
                            <p className="text-xs font-bold text-[var(--color-muted)]">
                              {formatDate(reservation.fecha_entrada)} al {formatDate(reservation.fecha_salida)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <StatusBadge status={reservation.estado} />
                            <strong className="text-sm text-[var(--color-primary)]">{formatCurrency(reservation.total)}</strong>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

function MetricCard({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <article className="rounded-[1.75rem] border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-soft)]">
      <div className="mb-4 grid h-11 w-11 place-items-center rounded-2xl bg-[var(--color-surface-warm)] text-[var(--color-primary)]">
        {icon}
      </div>
      <p className="text-xs font-black uppercase text-[var(--color-muted)]">{label}</p>
      <p className="mt-2 text-2xl font-black text-[var(--color-ink)]">{value}</p>
    </article>
  );
}
