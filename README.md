# API REST - Reserva de Hotel

Proyecto con backend Node.js + Express + Sequelize + SQLite + JWT y cliente React + Vite para el hito 2.

## Estructura

```txt
src/        Backend API REST
client/     Frontend React + Vite
```

## Variables de entorno

Backend `.env`:

```env
PORT=3000
NODE_ENV=development
DB_STORAGE=database.sqlite
JWT_ACCESS_SECRET=cambia_este_access_secret
JWT_REFRESH_SECRET=cambia_este_refresh_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=*
```

Frontend `client/.env`:

```env
VITE_API_URL=http://localhost:3000/api
```

## Instalacion

```bash
npm install
npm install --prefix client
```

## Base de datos

```bash
npm run db:migrate
npm run db:seed
```

Para reiniciar todo:

```bash
npm run db:reset
```

Usuario demo:

```txt
email: fabian@example.com
password: 123456
```

## Ejecucion

Backend:

```bash
npm run dev
```

Frontend:

```bash
npm run client:dev
```

## Hito 2

Evidencia principal:

```txt
MATRIZ_REQUISITOS.md
```

Avances:

- GEN-04: Registro de usuario.
- GEN-05: Login con access token y refresh token.
- GEN-06: Middleware de autenticacion.
- RQ-03: CRUD de habitaciones.
- RQ-08: Pantalla visual de habitaciones y ocupacion.

El cliente usa `sessionStorage` para tokens, no `localStorage`, por lo que la sesion no queda guardada de forma permanente ni se conserva al cerrar una ventana privada/incognito.
