import { useState } from 'react';
import { Link } from 'react-router-dom';
import { KeyRound, Lock } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { FormField } from '../components/ui/FormField';
import { Toast } from '../components/ui/Toast';
import { api } from '../services/api';

export function ResetPasswordPage() {
  const [form, setForm] = useState({ token: '', password: '' });
  const [status, setStatus] = useState({ loading: false, message: '', type: 'success' as 'success' | 'error' });

  return (
    <section className="w-full max-w-md rounded-[2rem] border border-[var(--color-border)] bg-white/88 p-6 shadow-[var(--shadow-card)] backdrop-blur-xl">
      <p className="text-xs font-black uppercase text-[var(--color-gold)]">Nueva clave</p>
      <h1 className="mt-2 text-4xl font-black text-[var(--color-ink)]">Definir contraseña</h1>
      <form
        className="mt-6 grid gap-4"
        onSubmit={async (event) => {
          event.preventDefault();
          setStatus({ loading: true, message: '', type: 'success' });
          try {
            await api.resetPassword(form);
            setStatus({ loading: false, message: 'Contraseña actualizada correctamente.', type: 'success' });
          } catch (error) {
            setStatus({ loading: false, message: error instanceof Error ? error.message : 'No pudimos actualizar la contraseña.', type: 'error' });
          }
        }}
      >
        <FormField label="Código de recuperación" icon={<KeyRound size={16} />} value={form.token} onChange={(event) => setForm({ ...form, token: event.target.value })} required />
        <FormField label="Nueva contraseña" type="password" icon={<Lock size={16} />} value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
        <Toast message={status.message} type={status.type} />
        <Button disabled={status.loading}>{status.loading ? 'Guardando...' : 'Guardar nueva contraseña'}</Button>
      </form>
      <Link className="mt-6 block text-sm font-black text-[var(--color-primary)]" to="/login">
        Iniciar sesión
      </Link>
    </section>
  );
}
