# Reserva de Hoteles

Proyecto web para administrar habitaciones y reservas de hotel. Incluye un backend con Node.js, Express, Sequelize, SQLite y JWT, mas un frontend con React + Vite para el avance del Hito 2.

## Variables de Entorno

Para que el proyecto funcione correctamente, es necesario configurar variables de entorno tanto en el entorno local de desarrollo como en produccion.

### Local vs Produccion

- **Entorno Local (Desarrollo):** En tu computador, las variables del backend se configuran en un archivo llamado `.env` en la raiz del proyecto, y las del frontend en `client/.env`. Estos archivos no se suben al repositorio por seguridad. En el repositorio solo quedan `.env.example` y `client/.env.example` como plantillas.

- **Entorno de Produccion:** Al desplegar la aplicacion, por ejemplo en Railway, Render, Vercel o Netlify, las variables no se suben mediante archivos `.env`. Se deben ingresar manualmente en la seccion de Environment Variables del hosting.

### Tabla de Variables del Sistema

| Variable | Servicio | Descripcion |
| :--- | :--- | :--- |
| `PORT` | API Backend | Puerto donde escucha el servidor Express, por ejemplo 3000. |
| `NODE_ENV` | API Backend | Define el entorno actual: `development`, `test` o `production`. |
| `DB_STORAGE` | API Backend | Ruta del archivo SQLite usado por Sequelize. |
| `JWT_ACCESS_SECRET` | API Backend | Clave secreta para firmar y verificar access tokens. |
| `JWT_REFRESH_SECRET` | API Backend | Clave secreta para firmar y verificar refresh tokens. |
| `JWT_ACCESS_EXPIRES_IN` | API Backend | Tiempo de vida del access token, por ejemplo `15m`. |
| `JWT_REFRESH_EXPIRES_IN` | API Backend | Tiempo de vida del refresh token, por ejemplo `7d`. |
| `CORS_ORIGIN` | API Backend | URL permitida para consumir la API desde el frontend. En local puede usarse `*`. |
| `VITE_API_URL` | Frontend | URL base de la API que consume React/Vite. |

### Ejemplo de archivo `.env.example` (Backend)

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

### Ejemplo de archivo `client/.env.example` (Frontend)

```env
VITE_API_URL=http://localhost:3000/api
```

## Estructura General

```txt
src/        Backend API REST
client/     Frontend React + Vite
```

El backend contiene modelos, migraciones, seeders, rutas, controladores, middlewares y servicios para JWT. El frontend contiene las pantallas demo del Hito 2.

## Instalacion

Instalar dependencias del backend:

```bash
npm install
```

Instalar dependencias del frontend:

```bash
npm install --prefix client
```

## Base de Datos

Crear las tablas con Sequelize:

```bash
npm run db:migrate
```

Cargar datos de prueba:

```bash
npm run db:seed
```

Reiniciar la base completa:

```bash
npm run db:reset
```

Usuario demo:

```txt
email: fabian@example.com
password: 123456
```

## Ejecucion

Levantar backend:

```bash
npm run dev
```

Levantar frontend:

```bash
npm run client:dev
```

Healthcheck:

```txt
GET http://localhost:3000/api/health
```

