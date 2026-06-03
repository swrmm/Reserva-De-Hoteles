# Planificacion del proyecto Reserva de Hotel

## Orden sugerido de implementacion

1. GEN-01 a GEN-03: base del proyecto, README, variables y base de datos.
2. GEN-04 a GEN-06: registro, login y middleware JWT.
3. RQ-01 y RQ-02: modelos de Habitacion y Reserva.
4. GEN-04, GEN-05 y GEN-07: auth para flujo de usuario y recuperacion de password.
5. RQ-03 a RQ-10 junto a GEN-09 y GEN-10: CRUD, validaciones, disponibilidad, dashboard y precios.
6. GEN-11, GEN-12 y GEN-13: Postman, evolucion de esquema y preparacion para deploy.

## Hito 0 - Inicio

- Proyecto Express creado.
- Conexion MySQL configurada con variables de entorno.
- Estructura definida en `src/config`, `src/routes`, `src/controllers`, `src/models`, `src/validators` y `src/middlewares`.

## Hito 1 - 20%

- README ejecutable.
- `.env.example` creado.
- `database/schema.sql` creado.
- Migracion inicial documentada.
- Healthcheck disponible en `/api/health`.

## Hito 2 - 40%

- Registro de usuario.
- Login con JWT.
- Middleware de autenticacion.
- Modelo Habitacion.
- Modelo Reserva.
- Rutas protegidas con `Authorization: Bearer <token>`.

## Hito 3 - 100% + deploy

- CRUD de habitaciones.
- CRUD de reservas.
- Validacion de fechas.
- Validacion de solapamiento de reservas.
- Busqueda de disponibilidad.
- Dashboard resumen.
- Extras y calculo basico del total.
- Coleccion Postman.
- Migracion adicional GEN-12.
- Proyecto preparado para deploy usando variables de entorno.
