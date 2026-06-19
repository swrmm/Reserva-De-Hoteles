import type { ReactNode } from 'react';

export function PageHeader({
  eyebrow,
  title,
  body,
  action,
}: {
  eyebrow?: string;
  title: string;
  body?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        {eyebrow && <p className="mb-2 text-xs font-black uppercase text-[var(--color-gold)]">{eyebrow}</p>}
        <h1 className="text-3xl font-black text-[var(--color-ink)] md:text-4xl">{title}</h1>
        {body && <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--color-muted)]">{body}</p>}
      </div>
      {action}
    </div>
  );
}
