import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BedDouble,
  CalendarDays,
  Car,
  CheckCircle2,
  Clock3,
  Coffee,
  SearchCheck,
  Sparkles,
  UserRound,
  Users,
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { RoomCard } from '../components/RoomCard';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { FormField, SelectField } from '../components/ui/FormField';
import { Toast } from '../components/ui/Toast';
import { api } from '../services/api';
import type { Reservation, Room, RoomType } from '../types';
import { formatCurrency, formatDate, nightsBetween } from '../utils/format';
import { useAuth } from '../hooks/useAuth';

const steps = [
  { label: 'Fechas', helper: 'Estadía', Icon: CalendarDays },
  { label: 'Habitación', helper: 'Selección', Icon: BedDouble },
  { label: 'Huésped', helper: 'Datos', Icon: UserRound },
  { label: 'Extras', helper: 'Servicios', Icon: Sparkles },
];
const roomTypes: RoomType[] = ['individual', 'doble', 'suite', 'familiar'];

export function BookingWizardPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const queryTipo = searchParams.get('tipo');
  const initialTipo = roomTypes.includes(queryTipo as RoomType) ? (queryTipo as RoomType) : ('' as RoomType | '');
  const requestedHabitacionId = searchParams.get('habitacionId') || '';
  const [step, setStep] = useState(0);
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [createdReservation, setCreatedReservation] = useState<Reservation | null>(null);
  const [toast, setToast] = useState({ message: '', type: 'success' as 'success' | 'error' });
  const [form, setForm] = useState({
    desde: searchParams.get('desde') || '',
    hasta: searchParams.get('hasta') || '',
    capacidad: searchParams.get('capacidad') || '2',
    tipo: initialTipo,
    habitacion_id: requestedHabitacionId,
    nombre_huesped: '',
    email_huesped: '',
    desayuno: true,
    estacionamiento: false,
    lateCheckout: false,
  });

  useEffect(() => {
    if (!user || form.nombre_huesped || form.email_huesped) return;
    setForm((current) => ({
      ...current,
      nombre_huesped: user.nombre || '',
      email_huesped: user.email || '',
    }));
  }, [form.email_huesped, form.nombre_huesped, user]);

  const dateError = form.desde && form.hasta && new Date(form.hasta) <= new Date(form.desde);
  const selectedRoom = availableRooms.find((room) => String(room.id) === form.habitacion_id);
  const extras =
    (form.desayuno ? 8500 : 0) + (form.estacionamiento ? 6000 : 0) + (form.lateCheckout ? 15000 : 0);
  const nights = nightsBetween(form.desde, form.hasta);
  const total = nights * Number(selectedRoom?.precio_noche || 0) + extras;

  const canContinue = useMemo(() => {
    if (step === 0) return form.desde && form.hasta && !dateError;
    if (step === 1) return form.habitacion_id;
    if (step === 2) return form.nombre_huesped && form.email_huesped;
    return true;
  }, [dateError, form, step]);

  const resetForm = () => {
    setForm({
      desde: '',
      hasta: '',
      capacidad: '2',
      tipo: '',
      habitacion_id: '',
      nombre_huesped: user?.nombre || '',
      email_huesped: user?.email || '',
      desayuno: true,
      estacionamiento: false,
      lateCheckout: false,
    });
    setAvailableRooms([]);
    setStep(0);
  };

  const next = async () => {
    if (!canContinue) {
      setToast({ message: 'Completa los datos requeridos antes de continuar.', type: 'error' });
      return;
    }

    if (step === 0) {
      try {
        const response = await api.getAvailability({
          desde: form.desde,
          hasta: form.hasta,
          capacidad: form.capacidad,
          tipo: form.tipo,
        });
        setAvailableRooms(response.data);
        setForm((current) => ({
          ...current,
          habitacion_id: response.data.some((room) => String(room.id) === requestedHabitacionId) ? requestedHabitacionId : '',
        }));
      } catch (error) {
        setAvailableRooms([]);
        setToast({ message: error instanceof Error ? error.message : 'No pudimos consultar habitaciones disponibles.', type: 'error' });
        return;
      }
    }

    setToast({ message: '', type: 'success' });
    setStep((current) => Math.min(current + 1, steps.length - 1));
  };

  const confirm = async () => {
    if (!selectedRoom) return;
    try {
      const response = await api.createReservation({
        habitacion_id: Number(form.habitacion_id),
        nombre_huesped: form.nombre_huesped,
        email_huesped: form.email_huesped,
        fecha_entrada: form.desde,
        fecha_salida: form.hasta,
        estado: 'pendiente',
        extras_total: extras,
        observaciones: 'Reserva creada desde sitio web',
        origen: 'web',
      });
      setCreatedReservation(response.data);
      setToast({ message: 'Reserva creada correctamente.', type: 'success' });
      resetForm();
    } catch (error) {
      setToast({ message: error instanceof Error ? error.message : 'No pudimos confirmar la reserva.', type: 'error' });
    }
  };

  if (createdReservation) {
    return (
      <div className="mx-auto max-w-7xl">
        <section className="overflow-hidden rounded-[2rem] border border-emerald-200 bg-white shadow-[var(--shadow-card)]">
          <div className="grid gap-6 p-6 lg:grid-cols-[1fr_360px] lg:p-8">
            <div>
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
                <CheckCircle2 size={28} />
              </div>
              <p className="mt-6 text-xs font-black uppercase tracking-wide text-[var(--color-gold)]">Reserva confirmada</p>
              <h1 className="mt-2 max-w-2xl text-4xl font-black leading-tight text-[var(--color-ink)]">
                Tu estadía quedó registrada
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-[var(--color-muted)]">
                Guardamos la solicitud y la asociamos a tu cuenta. Desde mis reservas puedes revisar fechas, estado y total.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link to="/reservas">
                  <Button icon={<CalendarDays size={17} />}>Ver mis reservas</Button>
                </Link>
                <Button type="button" variant="secondary" onClick={() => setCreatedReservation(null)}>
                  Crear otra reserva
                </Button>
              </div>
            </div>

            <aside className="rounded-[1.75rem] bg-[var(--color-surface)] p-5">
              <p className="text-xs font-black uppercase text-[var(--color-gold)]">Resumen</p>
              <div className="mt-5 grid gap-4">
                <DetailRow label="Huésped" value={createdReservation.nombre_huesped} />
                <DetailRow
                  label="Fechas"
                  value={`${formatDate(createdReservation.fecha_entrada)} al ${formatDate(createdReservation.fecha_salida)}`}
                />
                <DetailRow label="Total" value={formatCurrency(createdReservation.total)} strong />
              </div>
            </aside>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      <section className="mb-6 overflow-hidden rounded-[2rem] border border-[var(--color-border)] bg-white shadow-[var(--shadow-soft)]">
        <div className="grid gap-5 p-5 lg:grid-cols-[1fr_auto] lg:items-end lg:p-7">
          <div>
            <p className="inline-flex rounded-full bg-[var(--color-surface-warm)] px-3 py-1 text-xs font-black uppercase text-[var(--color-gold)]">
              Reserva
            </p>
            <h1 className="mt-4 text-4xl font-black leading-tight text-[var(--color-ink)]">Nueva reserva</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--color-muted)]">
              Selecciona fechas, compara habitaciones disponibles y confirma los datos de tu estadía en pocos pasos.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 rounded-3xl bg-[var(--color-surface)] p-3 text-center">
            <MiniStat label="Noches" value={String(nights)} />
            <MiniStat label="Huéspedes" value={form.capacidad || '0'} />
            <MiniStat label="Total" value={formatCurrency(total)} />
          </div>
        </div>
      </section>

      <div className="mb-5">
        <Toast message={toast.message} type={toast.type} />
      </div>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <article className="overflow-hidden rounded-[2rem] border border-[var(--color-border)] bg-white shadow-[var(--shadow-card)]">
          <div className="border-b border-[var(--color-border)] bg-[var(--color-surface)] p-4 lg:p-5">
            <div className="grid gap-3 md:grid-cols-4">
              {steps.map(({ label, helper, Icon }, index) => {
                const active = index === step;
                const done = index < step;
                return (
                  <button
                    className={`flex min-h-16 items-center gap-3 rounded-2xl border px-3 text-left transition ${
                      active
                        ? 'border-[var(--color-primary)] bg-white shadow-[var(--shadow-soft)]'
                        : done
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                          : 'border-transparent bg-white/60 text-[var(--color-muted)] hover:bg-white'
                    }`}
                    key={label}
                    type="button"
                    onClick={() => setStep(index)}
                  >
                    <span
                      className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${
                        active ? 'bg-[var(--color-ink)] text-white' : done ? 'bg-emerald-600 text-white' : 'bg-[var(--color-surface-warm)]'
                      }`}
                    >
                      <Icon size={18} />
                    </span>
                    <span>
                      <span className="block text-xs font-black uppercase opacity-60">Paso {index + 1}</span>
                      <span className="block text-sm font-black text-[var(--color-ink)]">{label}</span>
                      <span className="block text-xs font-bold opacity-60">{helper}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-5 lg:p-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {step === 0 && (
                  <StepPanel
                    eyebrow="Datos de búsqueda"
                    title="Define tu estadía"
                    body="Estos datos se usan para consultar disponibilidad real antes de mostrar habitaciones."
                  >
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        label="Fecha entrada"
                        type="date"
                        value={form.desde}
                        onChange={(event) => setForm({ ...form, desde: event.target.value })}
                        required
                      />
                      <FormField
                        label="Fecha salida"
                        type="date"
                        value={form.hasta}
                        onChange={(event) => setForm({ ...form, hasta: event.target.value })}
                        error={dateError ? 'Debe ser posterior a la entrada' : ''}
                        required
                      />
                      <FormField
                        label="Huéspedes"
                        type="number"
                        min="1"
                        icon={<Users size={16} />}
                        value={form.capacidad}
                        onChange={(event) => setForm({ ...form, capacidad: event.target.value })}
                      />
                      <SelectField
                        label="Tipo de habitación"
                        value={form.tipo}
                        onChange={(event) => setForm({ ...form, tipo: event.target.value as RoomType | '' })}
                      >
                        <option value="">Todas</option>
                        <option value="individual">Individual</option>
                        <option value="doble">Doble</option>
                        <option value="suite">Suite</option>
                        <option value="familiar">Familiar</option>
                      </SelectField>
                    </div>
                  </StepPanel>
                )}

                {step === 1 && (
                  <StepPanel
                    eyebrow="Habitaciones disponibles"
                    title={availableRooms.length ? `${availableRooms.length} opción(es) encontradas` : 'Selecciona una habitación'}
                    body="El precio se calcula con la tarifa vigente de la habitación seleccionada."
                    action={
                      <Button type="button" variant="secondary" icon={<SearchCheck size={16} />} onClick={() => setStep(0)}>
                        Cambiar búsqueda
                      </Button>
                    }
                  >
                    {availableRooms.length === 0 ? (
                      <EmptyState
                        title="Sin habitaciones disponibles"
                        body="No encontramos habitaciones para esos filtros. Cambia fechas, huéspedes o tipo de habitación para intentar nuevamente."
                        action={
                          <Button type="button" variant="secondary" onClick={() => setStep(0)}>
                            Ajustar búsqueda
                          </Button>
                        }
                      />
                    ) : (
                      <div className="grid gap-4 md:grid-cols-2">
                        {availableRooms.map((room) => (
                          <button
                            className={`rounded-[1.75rem] text-left ring-2 ring-offset-2 ring-offset-white transition ${
                              String(room.id) === form.habitacion_id ? 'ring-[var(--color-primary)]' : 'ring-transparent hover:ring-[var(--color-border)]'
                            }`}
                            key={room.id}
                            type="button"
                            onClick={() => setForm({ ...form, habitacion_id: String(room.id) })}
                          >
                            <RoomCard room={room} />
                          </button>
                        ))}
                      </div>
                    )}
                  </StepPanel>
                )}

                {step === 2 && (
                  <StepPanel
                    eyebrow="Datos personales"
                    title="Confirma el huésped"
                    body="Usamos estos datos para asociar la reserva a tu cuenta y mostrarla en mis reservas."
                  >
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        label="Nombre huésped"
                        icon={<UserRound size={16} />}
                        value={form.nombre_huesped}
                        onChange={(event) => setForm({ ...form, nombre_huesped: event.target.value })}
                        required
                      />
                      <FormField
                        label="Email/contacto"
                        type="email"
                        value={form.email_huesped}
                        onChange={(event) => setForm({ ...form, email_huesped: event.target.value })}
                        required
                      />
                    </div>
                  </StepPanel>
                )}

                {step === 3 && (
                  <StepPanel
                    eyebrow="Servicios adicionales"
                    title="Personaliza tu estadía"
                    body="Puedes sumar extras antes de confirmar. El total estimado se actualiza automaticamente."
                  >
                    <div className="grid gap-3">
                      <ExtraToggle
                        icon={<Coffee size={20} />}
                        label="Desayuno buffet"
                        price={8500}
                        checked={form.desayuno}
                        onChange={() => setForm({ ...form, desayuno: !form.desayuno })}
                      />
                      <ExtraToggle
                        icon={<Car size={20} />}
                        label="Estacionamiento"
                        price={6000}
                        checked={form.estacionamiento}
                        onChange={() => setForm({ ...form, estacionamiento: !form.estacionamiento })}
                      />
                      <ExtraToggle
                        icon={<Clock3 size={20} />}
                        label="Late checkout"
                        price={15000}
                        checked={form.lateCheckout}
                        onChange={() => setForm({ ...form, lateCheckout: !form.lateCheckout })}
                      />
                    </div>
                  </StepPanel>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="mt-7 flex flex-col-reverse gap-3 border-t border-[var(--color-border)] pt-5 sm:flex-row sm:items-center sm:justify-between">
              {step === 0 ? (
                <span className="text-sm font-bold text-[var(--color-muted)]">Comienza revisando disponibilidad.</span>
              ) : (
                <Button variant="secondary" type="button" icon={<ArrowLeft size={17} />} onClick={() => setStep((current) => Math.max(current - 1, 0))}>
                  Volver
                </Button>
              )}
              {step < steps.length - 1 ? (
                <Button type="button" icon={<ArrowRight size={17} />} onClick={next} disabled={!canContinue}>
                  Continuar
                </Button>
              ) : (
                <Button type="button" icon={<CheckCircle2 size={17} />} onClick={confirm} disabled={!selectedRoom}>
                  Confirmar reserva
                </Button>
              )}
            </div>
          </div>
        </article>

        <ReservationSummary
          extras={extras}
          form={form}
          nights={nights}
          selectedRoom={selectedRoom}
          step={step}
          total={total}
        />
      </section>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-24 rounded-2xl bg-white px-4 py-3 shadow-sm">
      <p className="text-xs font-black uppercase text-[var(--color-muted)]">{label}</p>
      <p className="mt-1 text-lg font-black text-[var(--color-ink)]">{value}</p>
    </div>
  );
}

function StepPanel({
  eyebrow,
  title,
  body,
  action,
  children,
}: {
  eyebrow: string;
  title: string;
  body: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-[var(--color-gold)]">{eyebrow}</p>
          <h2 className="mt-2 text-2xl font-black text-[var(--color-ink)]">{title}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-muted)]">{body}</p>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function ExtraToggle({
  icon,
  label,
  price,
  checked,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  price: number;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      className={`flex items-center justify-between gap-4 rounded-3xl border p-4 text-left transition ${
        checked ? 'border-[var(--color-primary)] bg-[rgba(26,76,90,0.06)]' : 'border-[var(--color-border)] bg-white hover:bg-[var(--color-surface)]'
      }`}
      type="button"
      onClick={onChange}
    >
      <span className="flex items-center gap-4">
        <span className={`grid h-12 w-12 place-items-center rounded-2xl ${checked ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-surface-warm)] text-[var(--color-primary)]'}`}>
          {icon}
        </span>
        <span>
          <span className="block font-black text-[var(--color-ink)]">{label}</span>
          <span className="text-sm font-bold text-[var(--color-muted)]">{formatCurrency(price)}</span>
        </span>
      </span>
      <span className={`h-7 w-12 rounded-full p-1 transition ${checked ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-border)]'}`}>
        <span className={`block h-5 w-5 rounded-full bg-white transition ${checked ? 'translate-x-5' : ''}`} />
      </span>
    </button>
  );
}

function ReservationSummary({
  extras,
  form,
  nights,
  selectedRoom,
  step,
  total,
}: {
  extras: number;
  form: {
    desde: string;
    hasta: string;
    capacidad: string;
    nombre_huesped: string;
  };
  nights: number;
  selectedRoom?: Room;
  step: number;
  total: number;
}) {
  return (
    <aside className="h-fit rounded-[2rem] border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-card)] xl:sticky xl:top-6">
      <div className="flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--color-ink)] text-white">
          <CalendarDays size={20} />
        </div>
        <div>
          <p className="text-xs font-black uppercase text-[var(--color-gold)]">Resumen</p>
          <h2 className="text-xl font-black text-[var(--color-ink)]">Reserva en progreso</h2>
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-3xl bg-[var(--color-surface)]">
        <SummaryRow label="Fechas" value={form.desde && form.hasta ? `${formatDate(form.desde)} - ${formatDate(form.hasta)}` : 'Pendiente'} />
        <SummaryRow label="Huéspedes" value={form.capacidad || 'Pendiente'} />
        <SummaryRow label="Habitación" value={selectedRoom ? `#${selectedRoom.numero} - ${selectedRoom.tipo}` : 'Pendiente'} />
        <SummaryRow label="Huésped" value={form.nombre_huesped || 'Pendiente'} />
        <SummaryRow label="Noches" value={String(nights)} />
        <SummaryRow label="Extras" value={formatCurrency(extras)} />
      </div>

      <div className="mt-5 rounded-3xl bg-[var(--color-ink)] p-5 text-white">
        <p className="text-xs font-black uppercase text-white/50">Total estimado</p>
        <p className="mt-2 text-3xl font-black">{formatCurrency(total)}</p>
        <p className="mt-2 text-xs font-bold text-white/50">
          {step < 3 ? 'El total final se confirma al seleccionar extras.' : 'Listo para confirmar la reserva.'}
        </p>
      </div>
    </aside>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[var(--color-border)] px-4 py-3 last:border-b-0">
      <span className="text-sm font-bold text-[var(--color-muted)]">{label}</span>
      <strong className="text-right text-sm text-[var(--color-ink)]">{value}</strong>
    </div>
  );
}

function DetailRow({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[var(--color-border)] pb-3 last:border-b-0 last:pb-0">
      <span className="text-sm font-bold text-[var(--color-muted)]">{label}</span>
      <strong className={`text-right ${strong ? 'text-2xl' : 'text-sm'} text-[var(--color-ink)]`}>{value}</strong>
    </div>
  );
}
