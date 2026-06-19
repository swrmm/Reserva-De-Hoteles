import type { ReactNode } from 'react';
import { Inbox } from 'lucide-react';

export function EmptyState({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return (
    <div className="rounded-3xl border border-dashed border-[var(--color-border)] bg-white/70 p-8 text-center">
      <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-[var(--color-surface-warm)] text-[var(--color-primary)]">
        <Inbox size={22} />
      </div>
      <h3 className="text-lg font-black text-[var(--color-ink)]">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--color-muted)]">{body}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
