import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api, tokenStore } from '../services/api';
import type { User } from '../types';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (payload: { email: string; password: string }) => Promise<void>;
  register: (payload: { nombre: string; email: string; password: string }) => Promise<void>;
  updateProfile: (payload: { nombre?: string; email?: string; password?: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tokenStore.accessToken) {
      setLoading(false);
      return;
    }

    api
      .me()
      .then((response) => setUser(response.data))
      .catch(() => tokenStore.clear())
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      login: async (payload) => {
        const response = await api.login(payload);
        tokenStore.accessToken = response.data.accessToken;
        tokenStore.refreshToken = response.data.refreshToken;
        setUser(response.data.usuario);
      },
      register: async (payload) => {
        await api.register(payload);
      },
      updateProfile: async (payload) => {
        const response = await api.updateProfile(payload);
        setUser(response.data);
      },
      logout: async () => {
        try {
          if (tokenStore.refreshToken) {
            await api.logout(tokenStore.refreshToken);
          }
        } catch {
          // La salida local se mantiene aunque el refresh token ya no sea válido.
        }
        tokenStore.clear();
        setUser(null);
      },
    }),
    [loading, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}
