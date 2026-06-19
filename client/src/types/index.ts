export type RoomStatus = 'disponible' | 'ocupada' | 'mantenimiento' | 'inactiva';
export type RoomType = 'individual' | 'doble' | 'suite' | 'familiar';
export type ReservationStatus = 'pendiente' | 'confirmada' | 'cancelada' | 'finalizada';

export interface User {
  id: number;
  nombre: string;
  email: string;
  rol: 'admin' | 'recepcionista';
  activo?: boolean;
  createdAt?: string;
  updatedAt?: string;
  reservas?: Reservation[];
}

export interface Room {
  id: number;
  numero: string;
  tipo: RoomType;
  capacidad: number;
  precio_noche: number | string;
  estado: RoomStatus;
  descripcion?: string;
  activo?: boolean;
  image?: string;
}

export interface Reservation {
  id: number;
  habitacionId?: number;
  habitacion_id?: number;
  habitacion?: Pick<Room, 'id' | 'numero' | 'tipo' | 'precio_noche'>;
  nombre_huesped: string;
  email_huesped: string;
  fecha_entrada: string;
  fecha_salida: string;
  estado: ReservationStatus;
  precio_noche_aplicado?: number;
  extras_total: number | string;
  total: number | string;
  observaciones?: string;
}

export interface DashboardStats {
  habitaciones: {
    total: number;
    disponibles: number;
    ocupadas: number;
    mantenimiento: number;
    inactivas?: number;
  };
  proximasReservas: Reservation[];
}

export interface LoginResponse {
  usuario: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
  sessionId: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  token?: string;
  meta?: unknown;
}

export interface ApiListResponse<T> extends ApiResponse<T[]> {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
}
