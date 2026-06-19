# Hotel Bi Nario - Frontend

Frontend React + Vite para la plataforma de reserva y gestion hotelera.

## Stack

- React + Vite
- TypeScript
- React Router
- Tailwind CSS
- Framer Motion
- Lucide React

## Variables

Crear `client/.env` usando `client/.env.example`:

```env
VITE_API_URL=http://localhost:3000/api
```

## Ejecutar

```bash
npm install
npm run dev
```

Desde la raiz del proyecto tambien se puede usar:

```bash
npm run client:dev
```

## Estructura

```txt
src/components   Componentes reutilizables
src/pages        Landing, auth y pantallas privadas
src/layouts      Layout publico, auth y dashboard
src/services     Cliente API preparado para JWT
src/hooks        Contexto de autenticacion
src/types        Tipos TypeScript del dominio
src/data         Datos demo temporales para UI
src/utils        Formato de fechas, moneda y calculos
src/routes       Rutas publicas y protegidas
```
