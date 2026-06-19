import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

const variants: Record<Variant, string> = {
  primary:
    'bg-[var(--color-primary)] text-white shadow-[var(--shadow-button)] hover:-translate-y-0.5 hover:bg-[var(--color-primary-strong)]',
  secondary:
    'border border-[var(--color-border)] bg-white/80 text-[var(--color-ink)] hover:-translate-y-0.5 hover:border-[var(--color-primary)] hover:bg-white',
  ghost: 'text-[var(--color-muted)] hover:bg-white/70 hover:text-[var(--color-ink)]',
  danger: 'bg-red-600 text-white hover:-translate-y-0.5 hover:bg-red-700',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  icon?: ReactNode;
}

export function Button({ className = '', variant = 'primary', icon, children, ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
