# Reserva de Hoteles - Hotel Bi Nario

Aplicacion web para reserva y gestion hotelera. Incluye API REST con Express, Sequelize, JWT y migraciones, mas frontend React + Vite + TypeScript con pantallas publicas y privadas.

## Stack

- Backend: Node.js, Express, Sequelize, SQLite local, PostgreSQL opcional en Railway, JWT, bcrypt.
- Frontend: React, Vite, TypeScript, React Router, Tailwind CSS, Framer Motion.
- Herramientas: Sequelize CLI, Postman.

## Variables de entorno

Backend `.env` basado en `.env.example`:

```env
PORT=3000
NODE_ENV=development
DB_STORAGE=database.sqlite
DATABASE_URL=
DATABASE_SSL=false
JWT_ACCESS_SECRET=cambia_este_access_secret
JWT_REFRESH_SECRET=cambia_este_refresh_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=*
```

Frontend `client/.env` basado en `client/.env.example`:

```env
VITE_API_URL=http://localhost:3000/api
```

## Instalacion local

```bash
npm install
npm install --prefix client
```

## Base de datos

```bash
npm run db:migrate
npm run db:seed
```

Reiniciar todo:

```bash
npm run db:reset
```

Cuenta administrador predefinida:

```txt
email: fabian@example.com
password: 123456
```

El registro publico crea solamente cuentas de usuario. No se pueden crear nuevos administradores desde el formulario ni desde `POST /api/auth/register`.

