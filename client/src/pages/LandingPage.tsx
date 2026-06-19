import { motion } from 'framer-motion';
import { ArrowRight, BedDouble, CalendarDays, MapPin, ShieldCheck, Sparkles, Star, Users } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { benefits, hotelImages, mockRooms, testimonials } from '../data/mockData';
import { Button } from '../components/ui/Button';
import { FormField, SelectField } from '../components/ui/FormField';
import { RoomCard } from '../components/RoomCard';
import type { RoomType } from '../types';
import { useAuth } from '../hooks/useAuth';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [search, setSearch] = useState({
    desde: '',
    hasta: '',
    capacidad: '2',
    tipo: '' as RoomType | '',
  });
  const dateError = search.desde && search.hasta && new Date(search.hasta) <= new Date(search.desde);

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (dateError) return;

    const params = new URLSearchParams();
    if (search.desde) params.set('desde', search.desde);
    if (search.hasta) params.set('hasta', search.hasta);
    if (search.capacidad) params.set('capacidad', search.capacidad);
    if (search.tipo) params.set('tipo', search.tipo);

    navigate(`/nueva-reserva${params.toString() ? `?${params.toString()}` : ''}`);
  };

  return (
    <main className="min-h-dvh bg-[var(--color-page)] text-[var(--color-ink)]">
      <header className="fixed left-0 right-0 top-0 z-40 px-4 py-4">
        <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-3xl border border-white/55 bg-white/78 px-4 py-3 shadow-[var(--shadow-soft)] backdrop-blur-xl">
          <Link className="flex items-center gap-3" to="/">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[var(--color-ink)] text-sm font-black text-white">
              HB
            </span>
            <div>
              <p className="text-xs font-black uppercase text-[var(--color-gold)]">Hotel</p>
              <p className="font-black">Bi Nario</p>
            </div>
          </Link>
          <div className="hidden items-center gap-6 text-sm font-bold text-[var(--color-muted)] md:flex">
            <a href="#habitaciones">Habitaciones</a>
            <a href="#experiencia">Experiencia</a>
            <a href="#beneficios">Beneficios</a>
          </div>
          <div className="flex items-center gap-2">
            <Link className="hidden text-sm font-black text-[var(--color-muted)] sm:block" to={user ? '/dashboard' : '/login'}>
              {user ? 'Mi cuenta' : 'Ingresar'}
            </Link>
            <Link to={user ? '/habitaciones' : '/nueva-reserva'}>
              <Button>{user ? 'Ver hotel' : 'Reservar'}</Button>
            </Link>
          </div>
        </nav>
      </header>

      <section className="relative min-h-[92dvh] overflow-hidden">
        <img className="absolute inset-0 h-full w-full object-cover" src={hotelImages.hero} alt="Fachada y piscina de hotel premium" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/82 via-slate-950/42 to-slate-950/12" />
        <div className="relative mx-auto flex min-h-[92dvh] max-w-7xl items-end px-5 pb-8 pt-32 md:pb-12">
          <div className="grid w-full gap-8 lg:grid-cols-[1fr_420px] lg:items-end">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.6 }}>
              <p className="mb-4 inline-flex rounded-full border border-white/20 bg-white/12 px-4 py-2 text-xs font-black uppercase text-[var(--color-gold-light)] backdrop-blur-md">
                Boutique ejecutivo en el centro
              </p>
              <h1 className="max-w-4xl text-5xl font-black leading-[0.96] text-white md:text-7xl">
                Reservas hoteleras con calma, precision y estilo.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-white/78 md:text-lg">
                Hotel Bi Nario combina estadías premium con una plataforma de gestión clara para habitaciones, disponibilidad y reservas.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to={user ? '/habitaciones' : '/nueva-reserva'}>
                  <Button icon={<CalendarDays size={18} />}>Crear reserva</Button>
                </Link>
                <a href="#habitaciones">
                  <Button variant="secondary" icon={<BedDouble size={18} />}>
                    Ver habitaciones
                  </Button>
                </a>
              </div>
            </motion.div>

            <motion.form
              className="rounded-[2rem] border border-white/25 bg-white/88 p-5 shadow-2xl backdrop-blur-xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.55 }}
              onSubmit={submitSearch}
            >
              <p className="mb-4 text-xs font-black uppercase text-[var(--color-gold)]">
                Buscar disponibilidad
              </p>
              <div className="grid gap-4">
                <FormField
                  label="Fecha entrada"
                  type="date"
                  value={search.desde}
                  onChange={(event) => setSearch({ ...search, desde: event.target.value })}
                  required
                />
                <FormField
                  label="Fecha salida"
                  type="date"
                  value={search.hasta}
                  onChange={(event) => setSearch({ ...search, hasta: event.target.value })}
                  error={dateError ? 'Debe ser posterior a la entrada' : ''}
                  required
                />
                <FormField
                  label="Huéspedes"
                  type="number"
                  min="1"
                  value={search.capacidad}
                  icon={<Users size={16} />}
                  onChange={(event) => setSearch({ ...search, capacidad: event.target.value })}
                />
                <SelectField
                  label="Tipo de habitación"
                  value={search.tipo}
                  onChange={(event) => setSearch({ ...search, tipo: event.target.value as RoomType | '' })}
                >
                  <option value="">Todas</option>
                  <option value="individual">Individual</option>
                  <option value="doble">Doble</option>
                  <option value="suite">Suite</option>
                  <option value="familiar">Familiar</option>
                </SelectField>
                <Button className="w-full" type="submit" icon={<SearchIcon />} disabled={Boolean(dateError)}>
                  Consultar ahora
                </Button>
              </div>
            </motion.form>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20" id="habitaciones">
        <SectionHeading eyebrow="Habitaciones destacadas" title="Opciones pensadas para descanso y operación eficiente." />
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {mockRooms.map((room, index) => (
            <motion.div key={room.id} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: index * 0.08 }}>
              <Link
                className="block h-full rounded-3xl focus:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-primary)]/25"
                to="/habitaciones"
              >
                <RoomCard room={room} />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-[var(--color-ink)] py-20 text-white" id="beneficios">
        <div className="mx-auto max-w-7xl px-5">
          <SectionHeading dark eyebrow="Beneficios" title="Una experiencia coherente desde la reserva hasta la recepcion." />
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {benefits.map(([title, body]) => (
              <article className="rounded-3xl border border-white/10 bg-white/8 p-5" key={title}>
                <ShieldCheck className="mb-4 text-[var(--color-gold-light)]" size={24} />
                <h3 className="font-black">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/62">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20" id="experiencia">
        <SectionHeading eyebrow="Experiencia" title="Habitaciones, restaurante y ubicación en una misma narrativa premium." />
        <div className="mt-8 grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
          <ExperienceCard image={hotelImages.suite} title="Suites silenciosas" body="Ambientes amplios para viajes ejecutivos y escapadas urbanas." />
          <div className="grid gap-5">
            <ExperienceCard image={hotelImages.restaurant} title="Restaurante curado" body="Desayuno, cena y extras listos para sumar al flujo de reserva." compact />
            <ExperienceCard image={hotelImages.lobby} title="Operación centralizada" body="Recepción con datos claros de ocupación y disponibilidad." compact />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20">
        <SectionHeading eyebrow="Testimonios" title="Confianza para operar cada dia." />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {testimonials.map(([quote, author]) => (
            <article className="rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-soft)]" key={author}>
              <Star className="mb-4 fill-[var(--color-gold)] text-[var(--color-gold)]" size={22} />
              <p className="text-sm leading-6 text-[var(--color-muted)]">"{quote}"</p>
              <p className="mt-5 font-black text-[var(--color-ink)]">{author}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="border-t border-[var(--color-border)] bg-white px-5 py-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-black text-[var(--color-ink)]">Hotel Bi Nario</p>
            <p className="mt-1 text-sm text-[var(--color-muted)]">Reservas, habitaciones y disponibilidad con una experiencia clara para cada estadía.</p>
          </div>
          <p className="inline-flex items-center gap-2 text-sm font-bold text-[var(--color-muted)]">
            <MapPin size={16} /> Santiago, Chile
          </p>
        </div>
      </footer>
    </main>
  );
}

function SectionHeading({ eyebrow, title, dark = false }: { eyebrow: string; title: string; dark?: boolean }) {
  return (
    <div>
      <p className="mb-3 text-xs font-black uppercase text-[var(--color-gold)]">{eyebrow}</p>
      <h2 className={`max-w-3xl text-3xl font-black md:text-5xl ${dark ? 'text-white' : 'text-[var(--color-ink)]'}`}>{title}</h2>
    </div>
  );
}

function ExperienceCard({ image, title, body, compact = false }: { image: string; title: string; body: string; compact?: boolean }) {
  return (
    <article className={`group relative overflow-hidden rounded-[2rem] ${compact ? 'min-h-64' : 'min-h-[34rem]'}`}>
      <img className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" src={image} alt={title} loading="lazy" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/18 to-transparent" />
      <div className="absolute bottom-0 p-6 text-white">
        <h3 className="text-2xl font-black">{title}</h3>
        <p className="mt-2 max-w-md text-sm leading-6 text-white/72">{body}</p>
      </div>
    </article>
  );
}

function SearchIcon() {
  return <ArrowRight size={18} />;
}
