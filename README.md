# API REST - Reserva de Hotel

Proyecto backend con Node.js, Express y MySQL para administrar habitaciones, reservas y autenticacion de usuarios.

## Requerimientos trabajados

- GEN-01: Repositorio y README ejecutable.
- GEN-02: Variables de entorno y `.env.example`.
- GEN-03: Conexion a base de datos y migraciones SQL.
- GEN-04: Registro de usuario.
- GEN-05: Login con JWT.
- GEN-06: Middleware de autenticacion para rutas protegidas.
- GEN-07: Restablecimiento de password con token demo.
- GEN-08: Errores centralizados y JSON uniforme.
- GEN-09 y GEN-10: CRUD REST con validaciones.
- GEN-11: Coleccion Postman.
- GEN-12: Migracion adicional documentada.
- GEN-13: Preparado para deploy con variables de entorno.
- RQ-01: Modelo Habitacion.
- RQ-02: Modelo Reserva.
- RQ-03: CRUD Habitaciones.
- RQ-04 a RQ-10: Reservas, disponibilidad, dashboard y precios basicos.

## Tecnologias

- Node.js
- Express
- MySQL
- mysql2
- dotenv
- cors
- bcryptjs
- jsonwebtoken
- Postman

## Variables de entorno

Para que el proyecto funcione correctamente, es necesario configurar variables de entorno en local y tambien en produccion si se despliega.

### Local vs produccion

- Entorno local: las variables se configuran en un archivo `.env` en la raiz del proyecto. Este archivo no se sube al repositorio porque contiene credenciales reales. En el repositorio queda `.env.example` como plantilla.
- Entorno de produccion: si se despliega en Railway, Render u otra plataforma, las variables se configuran desde el panel de Environment Variables del hosting.

### Tabla de variables del sistema

| Variable | Servicio | Descripcion |
| :--- | :--- | :--- |
| `PORT` | API Backend | Puerto donde escucha Express, por ejemplo 3000. |
| `DB_HOST` | Base de datos | Host del servidor MySQL. |
| `DB_PORT` | Base de datos | Puerto de MySQL, normalmente 3306. |
| `DB_USER` | Base de datos | Usuario de conexion a MySQL. |
| `DB_PASSWORD` | Base de datos | Password del usuario MySQL. |
| `DB_NAME` | Base de datos | Nombre de la base de datos, en este proyecto `eva2_hotel`. |
| `JWT_SECRET` | API Backend | Clave secreta para firmar y verificar tokens JWT. |
| `JWT_EXPIRES_IN` | API Backend | Duracion del token, por ejemplo `2h`. |
| `CORS_ORIGIN` | API Backend | Origen permitido para consumir la API. En local puede usarse `*`. |

### Ejemplo de archivo `.env.example`

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=eva2_hotel
JWT_SECRET=cambia_este_secreto
JWT_EXPIRES_IN=2h
CORS_ORIGIN=*
```

## Instalacion

```bash
npm install
```

## Base de datos

1. Crear la base ejecutando:

```sql
source database/schema.sql;
```

Tambien puedes abrir `database/schema.sql` en MySQL Workbench y ejecutarlo completo.

2. Copiar `.env.example` como `.env` y ajustar tus credenciales:

```txt
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=eva2_hotel
JWT_SECRET=cambia_este_secreto
JWT_EXPIRES_IN=2h
CORS_ORIGIN=*
```

## Ejecucion

Modo desarrollo:

```bash
npm run dev
```

Modo normal:

```bash
npm start
```

Healthcheck:

```txt
GET http://localhost:3000/api/health
```

## Rutas principales

Rutas publicas:

```txt
POST /api/auth/register
POST /api/auth/login
POST /api/auth/forgot-password
POST /api/auth/reset-password
GET  /api/health
```

Rutas protegidas con `Authorization: Bearer <token>`:

```txt
GET    /api/habitaciones
POST   /api/habitaciones
GET    /api/habitaciones/:id
PUT    /api/habitaciones/:id
DELETE /api/habitaciones/:id

GET    /api/reservas
POST   /api/reservas
GET    /api/reservas/:id
PUT    /api/reservas/:id
PATCH  /api/reservas/:id/cancelar
DELETE /api/reservas/:id

GET    /api/disponibilidad?desde=2026-07-10&hasta=2026-07-12
GET    /api/dashboard/resumen
GET    /api/extras
POST   /api/extras
```

## Flujo recomendado en Postman

1. Registrar usuario.
2. Iniciar sesion.
3. Guardar el token en la variable `token`.
4. Crear o listar habitaciones.
5. Buscar disponibilidad.
6. Crear reserva.
7. Probar errores: sin token, fechas invalidas y reserva solapada.

La coleccion esta en:

```txt
postman/reserva_hotel.postman_collection.json
```

## Migraciones

- `database/migrations/001_initial_hotel_schema.sql`: crea usuarios, habitaciones, reservas, extras y tokens.
- `database/migrations/002_add_reserva_origen.sql`: agrega el campo `origen` a reservas como evolucion del esquema.
