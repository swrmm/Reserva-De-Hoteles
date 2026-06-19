import { useEffect, useMemo, useState } from 'react';
import { Mail, ShieldCheck, UserRound } from 'lucide-react';
import { EmptyState } from '../components/ui/EmptyState';
import { FormField } from '../components/ui/FormField';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/ui/PageHeader';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Toast } from '../components/ui/Toast';
import { api } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import type { Reservation } from '../types';
import { formatCurrency, formatDate } from '../utils/format';

export function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [form, setForm] = useState({ nombre: user?.nombre || '', email: user?.email || '', password: '' });
  const [toast, setToast] = useState({ message: '', type: 'success' as 'success' | 'error' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm({ nombre: user?.nombre || '', email: user?.email || '', password: '' });
  }, [user]);

  useEffect(() => {
    api
      .getReservations()
      .then((response) => setReservations(response.data))
      .catch(() => setToast({ message: 'No pudimos cargar tus reservas en este momento.', type: 'error' }));
  }, []);

  const upcomingReservations = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return reservations
      .filter((reservation) => reservation.estado !== 'cancelada' && reservation.fecha_salida >= today)
      .sort((a, b) => a.fecha_entrada.localeCompare(b.fecha_entrada));
  }, [reservations]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setToast({ message: '', type: 'success' });
    try {
      await updateProfile({
        nombre: form.nombre,
        email: form.email,
        ...(form.password ? { password: form.password } : {}),
      });
      setForm((current) => ({ ...current, password: '' }));
      setToast({ message: 'Tus datos se actualizaron correctamente.', type: 'success' });
    } catch (error) {
      setToast({ message: error instanceof Error ? error.message : 'No pudimos actualizar tus datos.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Cuenta"
        title="Mi perfil"
        body="Gestiona tus datos personales y revisa tus próximas estadías en Hotel Bi Nario."
      />

      <section className="grid gap-5 xl:grid-cols-[420px_1fr]">
        <article className="h-fit rounded-[2rem] border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-card)]">
          <div className="mb-5 flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--color-surface-warm)] text-[var(--color-primary)]">
              <UserRound size={22} />
            </div>
            <div>
              <p className="text-xs font-black uppercase text-[var(--color-gold)]">Datos personales</p>
              <h2 className="text-2xl font-black text-[var(--color-ink)]">{user?.nombre}</h2>
            </div>
          </div>

          <Toast message={toast.message} type={toast.type} />

          <form className="mt-5 grid gap-4" onSubmit={submit}>
            <FormField
              label="Nombre"
              icon={<UserRound size={16} />}
              value={form.nombre}
              onChange={(event) => setForm({ ...form, nombre: event.target.value })}
              required
            />
            <FormField
              label="Email"
              type="email"
              icon={<Mail size={16} />}
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              required
            />
            <FormField
              label="Nueva contraseña"
              type="password"
              helper="Opcional. Debe incluir mayúscula y número."
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
            />
            <Button disabled={saving}>{saving ? 'Guardando...' : 'Guardar cambios'}</Button>
          </form>

          <div className="mt-5 rounded-3xl bg-[var(--color-surface-warm)] p-4">
            <p className="flex items-center gap-2 text-sm font-black text-[var(--color-ink)]">
              <ShieldCheck size={17} /> Tipo de cuenta
            </p>
            <p className="mt-1 text-sm font-bold text-[var(--color-muted)]">
              {user?.rol === 'admin' ? 'Administrador' : 'Usuario'}
            </p>
          </div>
        </article>

        <article className="rounded-[2rem] border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-soft)]">
          <div className="mb-5">
            <p className="text-xs font-black uppercase text-[var(--color-gold)]">Estadías</p>
            <h2 className="text-2xl font-black text-[var(--color-ink)]">Próximas reservas</h2>
          </div>

          {upcomingReservations.length === 0 ? (
            <EmptyState title="No tienes reservas próximas" body="Cuando hagas una reserva, aparecerá en esta sección." />
          ) : (
            <div className="grid gap-3">
              {upcomingReservations.map((reservation) => (
                <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4" key={reservation.id}>
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-lg font-black text-[var(--color-ink)]">
                        Habitación #{reservation.habitacion?.numero || reservation.habitacionId || reservation.habitacion_id}
                      </p>
                      <p className="mt-1 text-sm text-[var(--color-muted)]">
                        {formatDate(reservation.fecha_entrada)} al {formatDate(reservation.fecha_salida)}
                      </p>
                      <p className="mt-2 text-sm font-black text-[var(--color-primary)]">{formatCurrency(reservation.total)}</p>
                    </div>
                    <StatusBadge status={reservation.estado} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </article>
      </section>
    </div>
  );
}
