import { useEffect, useState } from 'react';
import { ArrowRight, BedDouble, Edit3, Plus, Sparkles, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { EmptyState } from '../components/ui/EmptyState';
import { FormField, SelectField, TextareaField } from '../components/ui/FormField';
import { PageHeader } from '../components/ui/PageHeader';
import { RoomCard } from '../components/RoomCard';
import { Toast } from '../components/ui/Toast';
import { api } from '../services/api';
import type { Room, RoomStatus, RoomType } from '../types';
import { useAuth } from '../hooks/useAuth';

const blankRoom = {
  numero: '',
  tipo: 'doble' as RoomType,
  capacidad: 2,
  precio_noche: 75000,
  estado: 'disponible' as RoomStatus,
  descripcion: '',
  activo: true,
};

export function RoomsPage() {
  const { user } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [form, setForm] = useState(blankRoom);
  const [editing, setEditing] = useState<Room | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Room | null>(null);
  const [toast, setToast] = useState({ message: '', type: 'success' as 'success' | 'error' });

  const loadRooms = async () => {
    try {
      const response = await api.getRooms();
      setRooms(response.data);
    } catch {
      setToast({ message: 'No pudimos actualizar las habitaciones. Intenta nuevamente.', type: 'error' });
    }
  };

  useEffect(() => {
    if (user?.rol !== 'admin') return;
    loadRooms();
  }, [user?.rol]);

  if (user?.rol !== 'admin') {
    return <GuestRoomsCatalog />;
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const payload = { ...form, capacidad: Number(form.capacidad), precio_noche: Number(form.precio_noche) };
      if (editing) {
        await api.updateRoom(editing.id, payload);
        setToast({ message: 'Habitación actualizada.', type: 'success' });
      } else {
        await api.createRoom(payload);
        setToast({ message: 'Habitación creada.', type: 'success' });
      }
      setForm(blankRoom);
      setEditing(null);
      await loadRooms();
    } catch (error) {
      setToast({ message: error instanceof Error ? error.message : 'No pudimos guardar la habitación.', type: 'error' });
    }
  };

  const startEdit = (room: Room) => {
    setEditing(room);
    setForm({
      numero: room.numero,
      tipo: room.tipo,
      capacidad: Number(room.capacidad),
      precio_noche: Number(room.precio_noche),
      estado: room.estado,
      descripcion: room.descripcion || '',
      activo: room.activo ?? true,
    });
  };

  const remove = async () => {
    if (!deleteTarget) return;
    try {
      await api.deleteRoom(deleteTarget.id);
      setRooms((current) => current.filter((room) => room.id !== deleteTarget.id));
      setToast({ message: 'Habitación eliminada.', type: 'success' });
    } catch (error) {
      setToast({ message: error instanceof Error ? error.message : 'No se pudo eliminar.', type: 'error' });
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div>
      <PageHeader eyebrow="Gestión" title="Habitaciones" body="Administra el inventario de habitaciones, sus precios, capacidad y estado operativo." />
      <Toast message={toast.message} type={toast.type} />

      <section className="mt-5 grid gap-5 xl:grid-cols-[1fr_420px]">
        <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
          {rooms.length === 0 ? (
            <div className="md:col-span-2">
              <EmptyState title="No hay habitaciones" body="Crea la primera habitación para iniciar el inventario." />
            </div>
          ) : (
            rooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                action={
                  <div className="flex gap-2">
                    <Button className="flex-1" variant="secondary" icon={<Edit3 size={16} />} onClick={() => startEdit(room)}>
                      Editar
                    </Button>
                    <Button variant="danger" icon={<Trash2 size={16} />} onClick={() => setDeleteTarget(room)} aria-label={`Eliminar habitación ${room.numero}`} />
                  </div>
                }
              />
            ))
          )}
        </div>

        <article className="h-fit rounded-[2rem] border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-card)]">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase text-[var(--color-gold)]">Formulario</p>
              <h2 className="text-2xl font-black text-[var(--color-ink)]">{editing ? 'Editar habitación' : 'Nueva habitación'}</h2>
            </div>
            <Plus className="text-[var(--color-primary)]" />
          </div>
          <form className="grid gap-4" onSubmit={submit}>
            <FormField label="Número" value={form.numero} onChange={(event) => setForm({ ...form, numero: event.target.value })} required />
            <SelectField label="Tipo" value={form.tipo} onChange={(event) => setForm({ ...form, tipo: event.target.value as RoomType })}>
              <option value="individual">Individual</option>
              <option value="doble">Doble</option>
              <option value="suite">Suite</option>
              <option value="familiar">Familiar</option>
            </SelectField>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Capacidad" type="number" min="1" value={form.capacidad} onChange={(event) => setForm({ ...form, capacidad: Number(event.target.value) })} required />
              <FormField label="Precio noche" type="number" min="1" value={form.precio_noche} onChange={(event) => setForm({ ...form, precio_noche: Number(event.target.value) })} required />
            </div>
            <SelectField label="Estado" value={form.estado} onChange={(event) => setForm({ ...form, estado: event.target.value as RoomStatus })}>
              <option value="disponible">Disponible</option>
              <option value="ocupada">Ocupada</option>
              <option value="mantenimiento">Mantenimiento</option>
              <option value="inactiva">Fuera de servicio</option>
            </SelectField>
            <TextareaField label="Descripcion" value={form.descripcion} onChange={(event) => setForm({ ...form, descripcion: event.target.value })} />
            <Button>{editing ? 'Guardar cambios' : 'Crear habitación'}</Button>
            {editing && (
              <Button type="button" variant="ghost" onClick={() => { setEditing(null); setForm(blankRoom); }}>
                Cancelar edicion
              </Button>
            )}
          </form>
        </article>
      </section>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Eliminar habitación"
        body="Si la habitación tiene reservas asociadas, no podrá eliminarse para proteger el historial del hotel."
        confirmLabel="Eliminar"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={remove}
      />
    </div>
  );
}

function GuestRoomsCatalog() {
  const [type, setType] = useState<RoomType | 'todas'>('todas');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [toast, setToast] = useState({ message: '', type: 'success' as 'success' | 'error' });
  const filteredRooms = type === 'todas' ? rooms : rooms.filter((room) => room.tipo === type);

  useEffect(() => {
    api
      .getRooms()
      .then((response) => setRooms(response.data.filter((room) => room.activo !== false)))
      .catch(() => setToast({ message: 'No pudimos cargar las habitaciones disponibles.', type: 'error' }));
  }, []);

  return (
    <div>
      <section className="overflow-hidden rounded-[2rem] border border-[var(--color-border)] bg-white shadow-[var(--shadow-card)]">
        <div className="grid gap-6 p-5 lg:grid-cols-[1fr_360px] lg:items-end lg:p-7">
          <div>
            <p className="inline-flex rounded-full bg-[var(--color-surface-warm)] px-3 py-1 text-xs font-black uppercase text-[var(--color-gold)]">
              Habitaciones
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight text-[var(--color-ink)]">
              Elige una habitación antes de reservar
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--color-muted)]">
              Revisa imágenes, capacidad, precio por noche y estilo de cada habitación. Luego puedes iniciar una reserva con el tipo ya seleccionado.
            </p>
          </div>
          <div className="rounded-3xl bg-[var(--color-surface)] p-4">
            <SelectField label="Filtrar por tipo" value={type} onChange={(event) => setType(event.target.value as RoomType | 'todas')}>
              <option value="todas">Todas las habitaciones</option>
              <option value="individual">Individual</option>
              <option value="doble">Doble</option>
              <option value="suite">Suite</option>
              <option value="familiar">Familiar</option>
            </SelectField>
          </div>
        </div>
      </section>

      <div className="mt-5">
        <Toast message={toast.message} type={toast.type} />
      </div>

      <section className="mt-6 grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
        {filteredRooms.length === 0 ? (
          <div className="md:col-span-2 2xl:col-span-3">
            <EmptyState title="Sin habitaciones para mostrar" body="Ajusta el filtro o intenta nuevamente más tarde." />
          </div>
        ) : (
          filteredRooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              action={
                <Link to={`/nueva-reserva?habitacionId=${room.id}&tipo=${room.tipo}&capacidad=${room.capacidad}`}>
                  <Button className="w-full" icon={<ArrowRight size={17} />}>
                    Reservar esta habitación
                  </Button>
                </Link>
              }
            />
          ))
        )}
      </section>

      <section className="mt-6 grid gap-5 lg:grid-cols-[1fr_0.8fr]">
        <article className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-ink)] p-6 text-white shadow-[var(--shadow-card)]">
          <Sparkles className="text-[var(--color-gold-light)]" size={26} />
          <h2 className="mt-4 text-2xl font-black">Reserva con disponibilidad real</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-white/62">
            El catálogo te ayuda a elegir estilo y precio. Al reservar, el sistema consulta disponibilidad por fechas antes de confirmar.
          </p>
          <Link className="mt-5 inline-flex" to="/nueva-reserva">
            <Button variant="secondary">Buscar fechas</Button>
          </Link>
        </article>
        <article className="rounded-[2rem] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-soft)]">
          <BedDouble className="text-[var(--color-primary)]" size={26} />
          <h2 className="mt-4 text-2xl font-black text-[var(--color-ink)]">Precios transparentes</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
            Cada tarjeta muestra el valor por noche y la capacidad. Los extras se agregan al final del flujo de reserva.
          </p>
        </article>
      </section>
    </div>
  );
}
