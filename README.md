# API REST - Reserva de Hotel

Proyecto backend con Node.js, Express, Sequelize, SQLite y JWT para administrar habitaciones, reservas y autenticacion de usuarios.

## Variables de entorno

Para que el proyecto funcione correctamente, es necesario configurar variables de entorno en local y tambien en produccion si se despliega.

### Local vs produccion

- Entorno local: las variables se configuran en un archivo `.env` en la raiz del proyecto. Este archivo no se sube al repositorio porque contiene secretos reales. En el repositorio queda `.env.example` como plantilla.
- Entorno de produccion: si se despliega en Railway, Render u otra plataforma, las variables se configuran desde el panel de Environment Variables del hosting.

### Tabla de variables del sistema

| Variable | Servicio | Descripcion |
| :--- | :--- | :--- |
| `PORT` | API Backend | Puerto donde escucha Express, por ejemplo 3000. |
| `NODE_ENV` | API Backend | Entorno de ejecucion: development, test o production. |
| `DB_STORAGE` | Base de datos | Ruta del archivo SQLite usado por Sequelize. |
| `JWT_ACCESS_SECRET` | API Backend | Clave secreta para firmar access tokens. |
| `JWT_REFRESH_SECRET` | API Backend | Clave secreta para firmar refresh tokens. |
| `JWT_ACCESS_EXPIRES_IN` | API Backend | Duracion del access token, por ejemplo `15m`. |
| `JWT_REFRESH_EXPIRES_IN` | API Backend | Duracion del refresh token, por ejemplo `7d`. |
| `CORS_ORIGIN` | API Backend | Origen permitido para consumir la API. En local puede usarse `*`. |

### Ejemplo de `.env.example`

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

