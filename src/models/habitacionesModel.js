const pool = require("../config/db");

function formatHabitacion(row) {
  if (!row) return null;

  return {
    ...row,
    capacidad: Number(row.capacidad),
    precio_noche: Number(row.precio_noche),
    activo: Boolean(row.activo)
  };
}

async function createHabitacion(data) {
  const sql = `
    INSERT INTO habitaciones
      (numero, tipo, capacidad, precio_noche, estado, descripcion, activo)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    data.numero.trim(),
    data.tipo,
    data.capacidad,
    data.precio_noche,
    data.estado,
    data.descripcion ? data.descripcion.trim() : null,
    data.activo
  ];

  const [result] = await pool.execute(sql, values);
  return findHabitacionById(result.insertId);
}

async function findAllHabitaciones(filters = {}) {
  const where = [];
  const values = [];

  if (filters.estado) {
    where.push("estado = ?");
    values.push(filters.estado);
  }

  if (filters.tipo) {
    where.push("tipo = ?");
    values.push(filters.tipo);
  }

  if (filters.activo !== undefined) {
    where.push("activo = ?");
    values.push(filters.activo === "false" ? 0 : 1);
  }

  const sql = `
    SELECT * FROM habitaciones
    ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
    ORDER BY numero ASC
  `;
  const [rows] = await pool.execute(sql, values);
  return rows.map(formatHabitacion);
}

async function findHabitacionById(id) {
  const [rows] = await pool.execute("SELECT * FROM habitaciones WHERE id = ?", [id]);
  return formatHabitacion(rows[0]);
}

async function updateHabitacion(id, data) {
  const sql = `
    UPDATE habitaciones
    SET numero = ?,
        tipo = ?,
        capacidad = ?,
        precio_noche = ?,
        estado = ?,
        descripcion = ?,
        activo = ?
    WHERE id = ?
  `;

  const values = [
    data.numero.trim(),
    data.tipo,
    data.capacidad,
    data.precio_noche,
    data.estado,
    data.descripcion ? data.descripcion.trim() : null,
    data.activo,
    id
  ];

  const [result] = await pool.execute(sql, values);
  if (result.affectedRows === 0) return null;

  return findHabitacionById(id);
}

async function deleteHabitacion(id) {
  const [result] = await pool.execute("DELETE FROM habitaciones WHERE id = ?", [id]);
  return result.affectedRows > 0;
}

async function findDisponibles({ desde, hasta, capacidad, tipo }) {
  const values = [hasta, desde];
  const filters = [
    "h.activo = 1",
    "h.estado = 'disponible'",
    `h.id NOT IN (
      SELECT r.habitacion_id
      FROM reservas r
      WHERE r.estado IN ('pendiente', 'confirmada')
        AND r.fecha_entrada < ?
        AND r.fecha_salida > ?
    )`
  ];

  if (capacidad) {
    filters.push("h.capacidad >= ?");
    values.push(Number(capacidad));
  }

  if (tipo) {
    filters.push("h.tipo = ?");
    values.push(tipo);
  }

  const [rows] = await pool.execute(
    `
      SELECT h.*
      FROM habitaciones h
      WHERE ${filters.join(" AND ")}
      ORDER BY h.precio_noche ASC
    `,
    values
  );

  return rows.map(formatHabitacion);
}

module.exports = {
  createHabitacion,
  findAllHabitaciones,
  findHabitacionById,
  updateHabitacion,
  deleteHabitacion,
  findDisponibles
};
