import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';

interface BaseProps {
  label: string;
  error?: string;
  helper?: string;
  icon?: ReactNode;
}

export function FormField({
  label,
  error,
  helper,
  icon,
  className = '',
  ...props
}: BaseProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={`grid gap-2 text-sm font-bold text-[var(--color-ink)] ${className}`}>
      <span>{label}</span>
      <span className="relative">
        {icon && <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]">{icon}</span>}
        <input
          className={`min-h-12 w-full rounded-2xl border border-[var(--color-border)] bg-white/90 px-4 text-sm text-[var(--color-ink)] outline-none transition focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[rgba(26,76,90,0.14)] ${
            icon ? 'pl-10' : ''
          } ${error ? 'border-red-400 bg-red-50/60' : ''}`}
          {...props}
        />
      </span>
      {(helper || error) && <span className={error ? 'text-xs font-semibold text-red-700' : 'text-xs font-medium text-[var(--color-muted)]'}>{error || helper}</span>}
    </label>
  );
}

export function SelectField({
  label,
  error,
  helper,
  className = '',
  children,
  ...props
}: BaseProps & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <label className={`grid gap-2 text-sm font-bold text-[var(--color-ink)] ${className}`}>
      <span>{label}</span>
      <select
        className={`min-h-12 w-full rounded-2xl border border-[var(--color-border)] bg-white/90 px-4 text-sm text-[var(--color-ink)] outline-none transition focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[rgba(26,76,90,0.14)] ${
          error ? 'border-red-400 bg-red-50/60' : ''
        }`}
        {...props}
      >
        {children}
      </select>
      {(helper || error) && <span className={error ? 'text-xs font-semibold text-red-700' : 'text-xs font-medium text-[var(--color-muted)]'}>{error || helper}</span>}
    </label>
  );
}

export function TextareaField({
  label,
  error,
  helper,
  className = '',
  ...props
}: BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className={`grid gap-2 text-sm font-bold text-[var(--color-ink)] ${className}`}>
      <span>{label}</span>
      <textarea
        className={`min-h-28 w-full resize-y rounded-2xl border border-[var(--color-border)] bg-white/90 px-4 py-3 text-sm text-[var(--color-ink)] outline-none transition focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[rgba(26,76,90,0.14)] ${
          error ? 'border-red-400 bg-red-50/60' : ''
        }`}
        {...props}
      />
      {(helper || error) && <span className={error ? 'text-xs font-semibold text-red-700' : 'text-xs font-medium text-[var(--color-muted)]'}>{error || helper}</span>}
    </label>
  );
}
