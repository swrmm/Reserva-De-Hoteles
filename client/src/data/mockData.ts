import type { Room } from '../types';

export const hotelImages = {
  hero:
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1800&q=85',
  lobby:
    'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1400&q=85',
  restaurant:
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1400&q=85',
  suite:
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1400&q=85',
};

export const roomTypeImages = {
  individual: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=900&q=85',
  doble: 'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=900&q=85',
  suite: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=900&q=85',
  familiar: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=900&q=85',
};

export const mockRooms: Room[] = [
  {
    id: 1,
    numero: '101',
    tipo: 'individual',
    capacidad: 1,
    precio_noche: 45000,
    estado: 'disponible',
    descripcion: 'Habitación ejecutiva compacta con escritorio, luz natural y cama premium.',
    activo: true,
    image: roomTypeImages.individual,
  },
  {
    id: 2,
    numero: '202',
    tipo: 'doble',
    capacidad: 2,
    precio_noche: 68000,
    estado: 'disponible',
    descripcion: 'Habitación doble con cama queen, vista a la ciudad y atmósfera silenciosa.',
    activo: true,
    image: roomTypeImages.doble,
  },
  {
    id: 3,
    numero: '303',
    tipo: 'suite',
    capacidad: 3,
    precio_noche: 120000,
    estado: 'mantenimiento',
    descripcion: 'Suite con sala privada, tina y amenities de categoria superior.',
    activo: true,
    image: roomTypeImages.suite,
  },
];

export const benefits = [
  ['Check-in agil', 'Flujo simple para recepcion y reservas sin friccion.'],
  ['Ocupación visible', 'Estados de habitaciones y próximas reservas siempre a mano.'],
  ['Gestión segura', 'Acceso cuidado para que cada reserva y habitación se administre con confianza.'],
  ['Precio claro', 'Calculo de noches, extras y total para cada reserva.'],
];

export const testimonials = [
  ['La recepción trabaja más rápido y los estados se entienden al primer vistazo.', 'Camila Torres, Administradora'],
  ['El panel parece simple, pero tiene justo la información operativa que necesitamos.', 'Nicolas Herrera, Operaciones'],
  ['La experiencia de reserva se siente clara y profesional para el equipo.', 'Daniela Vega, Front desk'],
];
