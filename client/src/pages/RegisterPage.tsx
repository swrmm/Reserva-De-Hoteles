import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Lock, Mail, UserRound } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { FormField } from '../components/ui/FormField';
import { Toast } from '../components/ui/Toast';
import { useAuth } from '../hooks/useAuth';

const checks = [
  ['Mínimo 6 caracteres', (value: string) => value.length >= 6],
  ['Una letra mayúscula', (value: string) => /[A-Z]/.test(value)],
  ['Un número', (value: string) => /\d/.test(value)],
] as const;

export function RegisterPage() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from;
  const [form, setForm] = useState({ nombre: '', email: '', password: '' });
  const [status, setStatus] = useState({ loading: false, message: '', type: 'error' as 'success' | 'error' });
  const passwordOk = checks.every(([, validator]) => validator(form.password));

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!passwordOk) {
      setStatus({ loading: false, message: 'La contraseña debe tener mayúscula, número y mínimo 6 caracteres.', type: 'error' });
      return;
    }
    setStatus({ loading: true, message: '', type: 'error' });
    try {
      await register(form);
      await login({ email: form.email, password: form.password });
      setStatus({ loading: false, message: 'Cuenta creada correctamente.', type: 'success' });
      navigate(from || '/nueva-reserva', { replace: true });
    } catch (error) {
      setStatus({ loading: false, message: error instanceof Error ? error.message : 'No pudimos crear la cuenta', type: 'error' });
    }
  };

  return (
    <section className="w-full max-w-md rounded-[2rem] border border-[var(--color-border)] bg-white/88 p-6 shadow-[var(--shadow-card)] backdrop-blur-xl">
      <p className="text-xs font-black uppercase text-[var(--color-gold)]">Nueva cuenta</p>
      <h1 className="mt-2 text-4xl font-black text-[var(--color-ink)]">Crear cuenta</h1>
      <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">Completa tus datos para reservar y administrar tus estadías en Hotel Bi Nario.</p>

      <form className="mt-6 grid gap-4" onSubmit={submit}>
        <FormField label="Nombre" icon={<UserRound size={16} />} value={form.nombre} onChange={(event) => setForm({ ...form, nombre: event.target.value })} required />
        <FormField label="Email" type="email" icon={<Mail size={16} />} value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
        <FormField label="Contraseña" type="password" icon={<Lock size={16} />} value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
        <ul className="grid gap-2 rounded-2xl bg-[var(--color-surface-warm)] p-3">
          {checks.map(([label, validator]) => (
            <li className={`text-xs font-black ${validator(form.password) ? 'text-emerald-700' : 'text-[var(--color-muted)]'}`} key={label}>
              {label}
            </li>
          ))}
        </ul>
        <Toast message={status.message} type={status.type} />
        <Button className="w-full" disabled={status.loading}>
          {status.loading ? 'Creando cuenta...' : 'Crear cuenta'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm font-bold text-[var(--color-muted)]">
        ¿Ya tienes cuenta?{' '}
        <Link className="text-[var(--color-primary)]" to="/login" state={from ? { from } : undefined}>
          Iniciar sesión
        </Link>
      </p>
    </section>
  );
}
