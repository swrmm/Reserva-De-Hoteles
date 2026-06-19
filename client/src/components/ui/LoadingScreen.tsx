export function LoadingScreen({ label = 'Cargando' }: { label?: string }) {
  return (
    <main className="grid min-h-dvh place-items-center bg-[var(--color-page)]">
      <div className="rounded-3xl border border-[var(--color-border)] bg-white/80 px-8 py-7 text-center shadow-[var(--shadow-card)]">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[var(--color-border)] border-t-[var(--color-primary)]" />
        <p className="text-sm font-bold text-[var(--color-muted)]">{label}</p>
      </div>
    </main>
  );
}
