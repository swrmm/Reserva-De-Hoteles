const pool = require("../config/db");

async function getResumen() {
  const [[habitaciones]] = await pool.execute(`
    SELECT
      COUNT(*) AS total,
      SUM(estado = 'disponible' AND activo = 1) AS disponibles,
      SUM(estado = 'ocupada') AS ocupadas,
      SUM(estado = 'mantenimiento') AS mantenimiento,
      SUM(activo = 0 OR estado = 'inactiva') AS inactivas
    FROM habitaciones
  `);

  const [[reservas]] = await pool.execute(`
    SELECT
      COUNT(*) AS total_reservas,
      SUM(estado = 'pendiente') AS pendientes,
      SUM(estado = 'confirmada') AS confirmadas,
      SUM(estado = 'cancelada') AS canceladas,
      COALESCE(SUM(CASE WHEN estado IN ('pendiente', 'confirmada') THEN total ELSE 0 END), 0) AS ingresos_activos
    FROM reservas
  `);

  const [proximas] = await pool.execute(`
    SELECT r.id, r.nombre_huesped, r.fecha_entrada, r.fecha_salida, r.estado, h.numero AS habitacion_numero
    FROM reservas r
    INNER JOIN habitaciones h ON h.id = r.habitacion_id
    WHERE r.estado IN ('pendiente', 'confirmada')
    ORDER BY r.fecha_entrada ASC
    LIMIT 5
  `);

  return {
    habitaciones: {
      total: Number(habitaciones.total || 0),
      disponibles: Number(habitaciones.disponibles || 0),
      ocupadas: Number(habitaciones.ocupadas || 0),
      mantenimiento: Number(habitaciones.mantenimiento || 0),
      inactivas: Number(habitaciones.inactivas || 0)
    },
    reservas: {
      total: Number(reservas.total_reservas || 0),
      pendientes: Number(reservas.pendientes || 0),
      confirmadas: Number(reservas.confirmadas || 0),
      canceladas: Number(reservas.canceladas || 0),
      ingresos_activos: Number(reservas.ingresos_activos || 0)
    },
    proximas
  };
}

module.exports = {
  getResumen
};
