import { AnimatePresence, motion } from 'framer-motion';
import {
  BedDouble,
  CalendarCheck,
  Hotel,
  LayoutDashboard,
  LogOut,
  UserRound,
  SearchCheck,
  Sparkles,
} from 'lucide-react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';

const adminNavItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/habitaciones', label: 'Habitaciones', icon: BedDouble },
  { to: '/reservas', label: 'Reservas', icon: CalendarCheck },
  { to: '/disponibilidad', label: 'Disponibilidad', icon: SearchCheck },
  { to: '/nueva-reserva', label: 'Nueva reserva', icon: Sparkles },
];

const userNavItems = [
  { to: '/dashboard', label: 'Inicio', icon: Hotel },
  { to: '/habitaciones', label: 'Habitaciones', icon: BedDouble },
  { to: '/nueva-reserva', label: 'Reservar', icon: Sparkles },
  { to: '/reservas', label: 'Mis reservas', icon: CalendarCheck },
  { to: '/perfil', label: 'Cuenta', icon: UserRound },
];

const accountLabel = (role?: string) => (role === 'admin' ? 'Administrador' : 'Usuario');

export function AppLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navItems = user?.rol === 'admin' ? adminNavItems : userNavItems;

  return (
    <div className="min-h-dvh bg-[var(--color-page)]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-white/70 bg-[var(--color-ink)] p-4 text-white shadow-2xl xl:block">
        <div className="flex h-full flex-col">
          <div className="rounded-3xl border border-white/10 bg-white/8 p-5">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--color-gold)] font-black text-[var(--color-ink)]">
                HB
              </span>
              <div>
                <p className="text-xs font-black uppercase text-[var(--color-gold-light)]">Hotel</p>
                <h1 className="font-black">Bi Nario</h1>
              </div>
            </div>
          </div>

          <nav className="mt-6 grid gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  className={({ isActive }) =>
                    `flex min-h-12 items-center gap-3 rounded-2xl px-4 text-sm font-bold transition ${
                      isActive ? 'bg-white !text-slate-950' : 'text-white/68 hover:bg-white/10 hover:text-white'
                    }`
                  }
                  key={item.to}
                  to={item.to}
                >
                  <Icon size={18} />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          <div className="mt-auto rounded-3xl border border-white/10 bg-white/8 p-4">
            <p className="text-xs font-bold uppercase text-white/45">Sesión activa</p>
            <p className="mt-2 truncate text-sm font-black">{user?.nombre || user?.email}</p>
            <p className="mt-1 text-xs font-bold text-white/50">{accountLabel(user?.rol)}</p>
            <div className="mt-4 grid gap-2">
              <NavLink
                className={({ isActive }) =>
                  `inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold transition ${
                    isActive
                      ? 'border-white bg-white text-[var(--color-ink)]'
                      : 'border-white/15 bg-white/8 text-white hover:bg-white/14'
                  }`
                }
                to="/perfil"
              >
                <UserRound size={16} />
                Mi cuenta
              </NavLink>
              <Button className="w-full" variant="secondary" icon={<LogOut size={16} />} onClick={logout}>
                Cerrar sesión
              </Button>
            </div>
          </div>
        </div>
      </aside>

      <header className="sticky top-0 z-20 border-b border-[var(--color-border)] bg-[rgba(248,246,241,0.86)] px-4 py-3 backdrop-blur-xl xl:hidden">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[var(--color-ink)] text-sm font-black text-white">
              HB
            </span>
            <div>
              <p className="text-xs font-black uppercase text-[var(--color-gold)]">Hotel Bi Nario</p>
              <p className="text-sm font-black text-[var(--color-ink)]">Gestion hotelera</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <NavLink
              className={({ isActive }) =>
                `grid h-11 w-11 place-items-center rounded-2xl border text-[var(--color-ink)] ${
                  isActive ? 'border-[var(--color-primary)] bg-white' : 'border-[var(--color-border)] bg-white'
                }`
              }
              to="/perfil"
              aria-label="Mi cuenta"
            >
              <UserRound size={18} />
            </NavLink>
            <button
              className="grid h-11 w-11 place-items-center rounded-2xl border border-[var(--color-border)] bg-white text-[var(--color-ink)]"
              type="button"
              onClick={logout}
              aria-label="Cerrar sesión"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
        <nav className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                className={({ isActive }) =>
                  `inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full px-3 text-xs font-black ${
                    isActive ? 'bg-[var(--color-ink)] text-white' : 'bg-white text-[var(--color-muted)]'
                  }`
                }
                key={item.to}
                to={item.to}
              >
                <Icon size={15} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </header>

      <main className="px-4 py-6 xl:ml-72 xl:px-8 xl:py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
