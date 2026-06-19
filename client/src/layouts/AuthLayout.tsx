import { Outlet } from 'react-router-dom';
import { hotelImages } from '../data/mockData';

export function AuthLayout() {
  return (
    <main className="grid min-h-dvh bg-[var(--color-page)] lg:grid-cols-[1.05fr_0.95fr]">
      <section className="hidden min-h-dvh p-4 lg:block">
        <div className="relative h-full overflow-hidden rounded-[2rem]">
          <img className="h-full w-full object-cover" src={hotelImages.lobby} alt="Lobby premium de Hotel Bi Nario" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/25 to-transparent" />
          <div className="absolute bottom-0 p-10 text-white">
            <p className="mb-3 text-xs font-black uppercase text-[var(--color-gold-light)]">Hotel Bi Nario</p>
            <h1 className="max-w-xl text-5xl font-black">Estadías memorables con atención cuidada en cada detalle.</h1>
            <p className="mt-5 max-w-lg text-sm leading-6 text-white/78">
              Habitaciones elegantes, reservas simples y una experiencia pensada para viajar con tranquilidad.
            </p>
          </div>
        </div>
      </section>
      <section className="grid min-h-dvh place-items-center px-5 py-10">
        <Outlet />
      </section>
    </main>
  );
}
