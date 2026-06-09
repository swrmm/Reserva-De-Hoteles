import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const session = {
  get accessToken() {
    return sessionStorage.getItem('accessToken');
  },
  set accessToken(value) {
    value ? sessionStorage.setItem('accessToken', value) : sessionStorage.removeItem('accessToken');
  },
  get refreshToken() {
    return sessionStorage.getItem('refreshToken');
  },
  set refreshToken(value) {
    value ? sessionStorage.setItem('refreshToken', value) : sessionStorage.removeItem('refreshToken');
  },
  clear() {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
  },
};

async function api(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (session.accessToken) {
    headers.Authorization = `Bearer ${session.accessToken}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 204) return null;

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || 'No pudimos completar la solicitud');
  }
  return data;
}

function AuthView({ onLogin }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({
    nombre: '',
    email: 'fabian@example.com',
    password: '123456',
  });
  const [status, setStatus] = useState({ loading: false, message: '', type: '' });

  const title = mode === 'login' ? 'Iniciar sesion' : 'Crear cuenta';

  const submit = async (event) => {
    event.preventDefault();
    setStatus({ loading: true, message: '', type: '' });
    try {
      if (mode === 'register') {
        await api('/auth/register', {
          method: 'POST',
          body: JSON.stringify({
            nombre: form.nombre,
            email: form.email,
            password: form.password,
            rol: 'recepcionista',
          }),
        });
        setStatus({ loading: false, message: 'Cuenta creada. Ahora puedes iniciar sesion.', type: 'success' });
        setMode('login');
        return;
      }

      const response = await api('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      session.accessToken = response.data.accessToken;
      session.refreshToken = response.data.refreshToken;
      onLogin(response.data.usuario);
    } catch (error) {
      setStatus({ loading: false, message: error.message, type: 'error' });
    }
  };

  return (
    <main className="auth-shell">
      <section className="auth-panel" aria-labelledby="auth-title">
        <div className="brand-block">
          <span className="brand-mark">RH</span>
          <div>
            <p className="eyebrow">Reserva Hotel</p>
            <h1 id="auth-title">{title}</h1>
          </div>
        </div>

        <form className="auth-form" onSubmit={submit}>
          {mode === 'register' && (
            <label>
              Nombre
              <input
                value={form.nombre}
                onChange={(event) => setForm({ ...form, nombre: event.target.value })}
                placeholder="Ej: Fabian Mora"
                autoComplete="name"
                required
              />
            </label>
          )}

          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              placeholder="correo@hotel.cl"
              autoComplete="email"
              required
            />
          </label>

          <label>
            Contrasena
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              minLength={6}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              required
            />
          </label>

          {status.message && (
            <p className={`feedback ${status.type}`} role="alert">
              {status.message}
            </p>
          )}

          <button className="primary-button" type="submit" disabled={status.loading}>
            {status.loading ? 'Procesando...' : mode === 'login' ? 'Entrar al panel' : 'Crear cuenta'}
          </button>
        </form>

        <button className="text-button" type="button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
          {mode === 'login' ? 'Crear una cuenta nueva' : 'Ya tengo cuenta'}
        </button>

        <p className="session-note">
          La sesion usa sessionStorage: el token no queda guardado de forma permanente ni se conserva al cerrar la ventana privada.
        </p>
      </section>
    </main>
  );
}

function Dashboard({ user, onLogout }) {
  const [habitaciones, setHabitaciones] = useState([]);
  const [summary, setSummary] = useState(null);
  const [status, setStatus] = useState({ loading: true, message: '' });
  const [form, setForm] = useState({
    numero: '',
    tipo: 'doble',
    capacidad: 2,
    precio_noche: 75000,
    estado: 'disponible',
    descripcion: '',
    activo: true,
  });

  const loadData = async () => {
    setStatus({ loading: true, message: '' });
    try {
      const [rooms, dashboard] = await Promise.all([
        api('/habitaciones?limit=50'),
        api('/dashboard/resumen'),
      ]);
      setHabitaciones(rooms.data || []);
      setSummary(dashboard.data);
      setStatus({ loading: false, message: '' });
    } catch (error) {
      setStatus({ loading: false, message: error.message });
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const kpis = useMemo(() => {
    const habitacionesData = summary?.habitaciones;
    return [
      ['Habitaciones', habitacionesData?.total ?? habitaciones.length],
      ['Disponibles', habitacionesData?.disponibles ?? 0],
      ['Mantencion', habitacionesData?.mantenimiento ?? 0],
      ['Proximas reservas', summary?.proximasReservas?.length ?? 0],
    ];
  }, [summary, habitaciones.length]);

  const createRoom = async (event) => {
    event.preventDefault();
    try {
      await api('/habitaciones', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          capacidad: Number(form.capacidad),
          precio_noche: Number(form.precio_noche),
        }),
      });
      setForm({ ...form, numero: '', descripcion: '' });
      await loadData();
    } catch (error) {
      setStatus({ loading: false, message: error.message });
    }
  };

  const logout = async () => {
    try {
      if (session.refreshToken) {
        await api('/auth/logout', {
          method: 'POST',
          body: JSON.stringify({ refreshToken: session.refreshToken }),
        });
      }
    } catch {
      // La salida local se mantiene aunque el token ya haya expirado.
    }
    session.clear();
    onLogout();
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Hito 2</p>
          <h1>Panel de reservas</h1>
        </div>
        <div className="topbar-actions">
          <span className="user-pill">{user?.nombre || user?.email}</span>
          <button className="secondary-button" type="button" onClick={logout}>
            Cerrar sesion
          </button>
        </div>
      </header>

      <section className="kpi-grid" aria-label="Resumen operacional">
        {kpis.map(([label, value]) => (
          <article className="kpi-card" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </article>
        ))}
      </section>

      <section className="workspace-grid">
        <article className="panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Inventario</p>
              <h2>Habitaciones</h2>
            </div>
            <button className="secondary-button" type="button" onClick={loadData}>
              Actualizar
            </button>
          </div>

          {status.loading && <p className="muted">Cargando habitaciones...</p>}
          {status.message && <p className="feedback error">{status.message}</p>}
          {!status.loading && habitaciones.length === 0 && (
            <div className="empty-state">
              <h3>No hay habitaciones aun</h3>
              <p>Crea la primera habitacion para comenzar a probar el CRUD.</p>
            </div>
          )}

          <div className="room-list">
            {habitaciones.map((room) => (
              <article className="room-row" key={room.id}>
                <div>
                  <strong>Habitacion {room.numero}</strong>
                  <p>{room.tipo} · {room.capacidad} personas · ${Number(room.precio_noche).toLocaleString('es-CL')}</p>
                </div>
                <span className={`status-badge ${room.estado}`}>{room.estado}</span>
              </article>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">CRUD demo</p>
              <h2>Nueva habitacion</h2>
            </div>
          </div>

          <form className="room-form" onSubmit={createRoom}>
            <label>
              Numero
              <input value={form.numero} onChange={(event) => setForm({ ...form, numero: event.target.value })} required />
            </label>
            <label>
              Tipo
              <select value={form.tipo} onChange={(event) => setForm({ ...form, tipo: event.target.value })}>
                <option value="individual">Individual</option>
                <option value="doble">Doble</option>
                <option value="suite">Suite</option>
                <option value="familiar">Familiar</option>
              </select>
            </label>
            <label>
              Capacidad
              <input type="number" min="1" value={form.capacidad} onChange={(event) => setForm({ ...form, capacidad: event.target.value })} required />
            </label>
            <label>
              Precio noche
              <input type="number" min="1" value={form.precio_noche} onChange={(event) => setForm({ ...form, precio_noche: event.target.value })} required />
            </label>
            <label>
              Estado
              <select value={form.estado} onChange={(event) => setForm({ ...form, estado: event.target.value })}>
                <option value="disponible">Disponible</option>
                <option value="ocupada">Ocupada</option>
                <option value="mantenimiento">Mantenimiento</option>
                <option value="inactiva">Inactiva</option>
              </select>
            </label>
            <label>
              Descripcion
              <textarea value={form.descripcion} onChange={(event) => setForm({ ...form, descripcion: event.target.value })} rows="4" />
            </label>
            <button className="primary-button" type="submit">
              Guardar habitacion
            </button>
          </form>
        </article>
      </section>
    </main>
  );
}

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!session.accessToken) return;
    api('/auth/me')
      .then((response) => setUser(response.data))
      .catch(() => session.clear());
  }, []);

  if (!user) {
    return <AuthView onLogin={setUser} />;
  }

  return <Dashboard user={user} onLogout={() => setUser(null)} />;
}

createRoot(document.getElementById('root')).render(<App />);
