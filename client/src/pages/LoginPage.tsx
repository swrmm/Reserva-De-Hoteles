import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { FormField } from '../components/ui/FormField';
import { Toast } from '../components/ui/Toast';
import { useAuth } from '../hooks/useAuth';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from;
  const [form, setForm] = useState({ email: '', password: '' });
  const [status, setStatus] = useState({ loading: false, message: '', type: 'error' as 'success' | 'error' });

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus({ loading: true, message: '', type: 'error' });
    try {
      await login(form);
      navigate(from || '/dashboard', { replace: true });
    } catch (error) {
      setStatus({ loading: false, message: error instanceof Error ? error.message : 'No pudimos iniciar sesión', type: 'error' });
    }
  };

  return (
    <section className="w-full max-w-md rounded-[2rem] border border-[var(--color-border)] bg-white/88 p-6 shadow-[var(--shadow-card)] backdrop-blur-xl">
      <p className="text-xs font-black uppercase text-[var(--color-gold)]">Hotel Bi Nario</p>
      <h1 className="mt-2 text-4xl font-black text-[var(--color-ink)]">Iniciar sesión</h1>
      <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">Ingresa con tu cuenta para gestionar tu experiencia hotelera.</p>

      <form className="mt-6 grid gap-4" onSubmit={submit}>
        <FormField label="Email" type="email" icon={<Mail size={16} />} value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
        <FormField label="Contraseña" type="password" icon={<Lock size={16} />} value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
        <div className="flex justify-end">
          <Link className="text-sm font-black text-[var(--color-primary)]" to="/recuperar">
            Recuperar contraseña
          </Link>
        </div>
        <Toast message={status.message} type={status.type} />
        <Button className="w-full" disabled={status.loading}>
          {status.loading ? 'Ingresando...' : 'Ingresar'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm font-bold text-[var(--color-muted)]">
        ¿No tienes cuenta?{' '}
        <Link className="text-[var(--color-primary)]" to="/registro" state={from ? { from } : undefined}>
          Registrarse
        </Link>
      </p>
    </section>
  );
}
