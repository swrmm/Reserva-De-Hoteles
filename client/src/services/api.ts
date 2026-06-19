import type {
  ApiListResponse,
  ApiResponse,
  DashboardStats,
  LoginResponse,
  Reservation,
  Room,
  RoomType,
} from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

export const tokenStore = {
  get accessToken() {
    return sessionStorage.getItem(ACCESS_TOKEN_KEY);
  },
  set accessToken(value: string | null) {
    value ? sessionStorage.setItem(ACCESS_TOKEN_KEY, value) : sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  },
  get refreshToken() {
    return sessionStorage.getItem(REFRESH_TOKEN_KEY);
  },
  set refreshToken(value: string | null) {
    value ? sessionStorage.setItem(REFRESH_TOKEN_KEY, value) : sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  },
  clear() {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};

type RequestOptions = RequestInit & { skipAuth?: boolean };

async function request<T>(path: string, options: RequestOptions = {}, retry = true): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');

  if (!options.skipAuth && tokenStore.accessToken) {
    headers.set('Authorization', `Bearer ${tokenStore.accessToken}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 204) return null as T;

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401 && retry && !options.skipAuth && tokenStore.refreshToken) {
      try {
        const refreshed = await request<ApiResponse<Pick<LoginResponse, 'accessToken' | 'refreshToken' | 'expiresIn' | 'sessionId'>>>(
          '/auth/refresh',
          {
            method: 'POST',
            body: JSON.stringify({ refreshToken: tokenStore.refreshToken }),
            skipAuth: true,
          },
          false
        );
        tokenStore.accessToken = refreshed.data.accessToken;
        tokenStore.refreshToken = refreshed.data.refreshToken;
        return request<T>(path, options, false);
      } catch {
        tokenStore.clear();
      }
    }

    const details = Array.isArray(data.details)
      ? ` ${data.details.map((item: { msg?: string; message?: string }) => item.msg || item.message).filter(Boolean).join(' ')}`
      : '';
    throw new Error(`${data.message || 'No pudimos completar la solicitud'}${details}`.trim());
  }

  return data as T;
}

export const api = {
  login: (payload: { email: string; password: string }) =>
    request<ApiResponse<LoginResponse>>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
      skipAuth: true,
    }),
  register: (payload: { nombre: string; email: string; password: string }) =>
    request<ApiResponse<unknown>>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
      skipAuth: true,
    }),
  updateProfile: (payload: { nombre?: string; email?: string; password?: string }) =>
    request<ApiResponse<LoginResponse['usuario']>>('/auth/me', {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  forgotPassword: (email: string) =>
    request<ApiResponse<{ resetToken?: string }>>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
      skipAuth: true,
    }),
  resetPassword: (payload: { token: string; password: string }) =>
    request<ApiResponse<unknown>>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(payload),
      skipAuth: true,
    }),
  me: () => request<ApiResponse<LoginResponse['usuario']>>('/auth/me'),
  getUsers: () => request<ApiResponse<LoginResponse['usuario'][]>>('/auth/usuarios'),
  logout: (refreshToken: string) =>
    request<null>('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    }),
  getRooms: () => request<ApiListResponse<Room>>('/habitaciones?limit=50'),
  createRoom: (payload: Omit<Room, 'id' | 'image'>) =>
    request<ApiResponse<Room>>('/habitaciones', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateRoom: (id: number, payload: Omit<Room, 'id' | 'image'>) =>
    request<ApiResponse<Room>>(`/habitaciones/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  deleteRoom: (id: number) =>
    request<null>(`/habitaciones/${id}`, {
      method: 'DELETE',
    }),
  getReservations: () => request<ApiResponse<Reservation[]>>('/reservas'),
  createReservation: (payload: Record<string, unknown>) =>
    request<ApiResponse<Reservation>>('/reservas', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateReservation: (id: number, payload: Record<string, unknown>) =>
    request<ApiResponse<Reservation>>(`/reservas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  cancelReservation: (id: number) =>
    request<ApiResponse<Reservation>>(`/reservas/${id}/cancelar`, {
      method: 'PATCH',
    }),
  getAvailability: (query: { desde: string; hasta: string; capacidad?: string; tipo?: RoomType | '' }) => {
    const params = new URLSearchParams();
    params.set('desde', query.desde);
    params.set('hasta', query.hasta);
    if (query.capacidad) params.set('capacidad', query.capacidad);
    if (query.tipo) params.set('tipo', query.tipo);
    return request<ApiResponse<Room[]>>(`/disponibilidad?${params.toString()}`);
  },
  getDashboardStats: () => request<ApiResponse<DashboardStats>>('/dashboard/resumen'),
};
