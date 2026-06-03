const pool = require("../config/db");

function formatReserva(row) {
  if (!row) return null;

  return {
    ...row,
    total: Number(row.total),
    extras_total: Number(row.extras_total),
    precio_noche: row.precio_noche === undefined ? undefined : Number(row.precio_noche)
  };
}

async function createReserva(data) {
  const sql = `
    INSERT INTO reservas
      (habitacion_id, usuario_id, nombre_huesped, email_huesped, fecha_entrada,
       fecha_salida, estado, total, extras_total, observaciones, origen)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    data.habitacion_id,
    data.usuario_id || null,
    data.nombre_huesped.trim(),
    data.email_huesped.trim().toLowerCase(),
    data.fecha_entrada,
    data.fecha_salida,
    data.estado,
    data.total,
    data.extras_total || 0,
    data.observaciones ? data.observaciones.trim() : null,
    data.origen || "postman"
  ];

  const [result] = await pool.execute(sql, values);
  return findReservaById(result.insertId);
}

async function findAllReservas() {
  const [rows] = await pool.execute(`
    SELECT r.*, h.numero AS habitacion_numero, h.tipo AS habitacion_tipo, h.precio_noche
    FROM reservas r
    INNER JOIN habitaciones h ON h.id = r.habitacion_id
    ORDER BY r.fecha_entrada DESC, r.id DESC
  `);
  return rows.map(formatReserva);
}

async function findReservaById(id) {
  const [rows] = await pool.execute(
    `
      SELECT r.*, h.numero AS habitacion_numero, h.tipo AS habitacion_tipo, h.precio_noche
      FROM reservas r
      INNER JOIN habitaciones h ON h.id = r.habitacion_id
      WHERE r.id = ?
    `,
    [id]
  );
  return formatReserva(rows[0]);
}

async function updateReserva(id, data) {
  const sql = `
    UPDATE reservas
    SET habitacion_id = ?,
        nombre_huesped = ?,
        email_huesped = ?,
        fecha_entrada = ?,
        fecha_salida = ?,
        estado = ?,
        total = ?,
        extras_total = ?,
        observaciones = ?,
        origen = ?
    WHERE id = ?
  `;

  const values = [
    data.habitacion_id,
    data.nombre_huesped.trim(),
    data.email_huesped.trim().toLowerCase(),
    data.fecha_entrada,
    data.fecha_salida,
    data.estado,
    data.total,
    data.extras_total || 0,
    data.observaciones ? data.observaciones.trim() : null,
    data.origen || "postman",
    id
  ];

  const [result] = await pool.execute(sql, values);
  if (result.affectedRows === 0) return null;

  return findReservaById(id);
}

async function deleteReserva(id) {
  const [result] = await pool.execute("DELETE FROM reservas WHERE id = ?", [id]);
  return result.affectedRows > 0;
}

async function cancelarReserva(id) {
  const [result] = await pool.execute("UPDATE reservas SET estado = 'cancelada' WHERE id = ?", [id]);
  if (result.affectedRows === 0) return null;
  return findReservaById(id);
}

async function hasSolapamiento({ habitacionId, fechaEntrada, fechaSalida, reservaId = null }) {
  const values = [habitacionId, fechaSalida, fechaEntrada];
  let extraWhere = "";

  if (reservaId) {
    extraWhere = "AND id <> ?";
    values.push(reservaId);
  }

  const [rows] = await pool.execute(
    `
      SELECT id
      FROM reservas
      WHERE habitacion_id = ?
        AND estado IN ('pendiente', 'confirmada')
        AND fecha_entrada < ?
        AND fecha_salida > ?
        ${extraWhere}
      LIMIT 1
    `,
    values
  );

  return rows.length > 0;
}

module.exports = {
  createReserva,
  findAllReservas,
  findReservaById,
  updateReserva,
  deleteReserva,
  cancelarReserva,
  hasSolapamiento
};
