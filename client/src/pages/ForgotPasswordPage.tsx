import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { FormField } from '../components/ui/FormField';
import { Toast } from '../components/ui/Toast';
import { api } from '../services/api';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ loading: false, message: '', type: 'success' as 'success' | 'error' });

  return (
    <section className="w-full max-w-md rounded-[2rem] border border-[var(--color-border)] bg-white/88 p-6 shadow-[var(--shadow-card)] backdrop-blur-xl">
      <p className="text-xs font-black uppercase text-[var(--color-gold)]">Recuperación</p>
      <h1 className="mt-2 text-4xl font-black text-[var(--color-ink)]">Restablecer acceso</h1>
      <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">Ingresa tu correo y te ayudaremos a recuperar el acceso a tu cuenta.</p>
      <form
        className="mt-6 grid gap-4"
        onSubmit={async (event) => {
          event.preventDefault();
          setStatus({ loading: true, message: '', type: 'success' });
          try {
            const response = await api.forgotPassword(email);
            const recoveryCode = response.data?.resetToken ? ` Código de recuperación: ${response.data.resetToken}` : '';
            setStatus({ loading: false, message: `${response.message || 'Solicitud enviada.'}${recoveryCode}`, type: 'success' });
          } catch (error) {
            setStatus({ loading: false, message: error instanceof Error ? error.message : 'No pudimos solicitar recuperación.', type: 'error' });
          }
        }}
      >
        <FormField label="Email" type="email" icon={<Mail size={16} />} value={email} onChange={(event) => setEmail(event.target.value)} required />
        <Toast message={status.message} type={status.type} />
        <Button disabled={status.loading}>{status.loading ? 'Solicitando...' : 'Solicitar código'}</Button>
      </form>
      <div className="mt-6 flex justify-between text-sm font-black">
        <Link className="text-[var(--color-muted)]" to="/login">
          Volver
        </Link>
        <Link className="text-[var(--color-primary)]" to="/reset-password">
          Ya tengo código
        </Link>
      </div>
    </section>
  );
}
