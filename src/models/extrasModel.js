const pool = require("../config/db");

function formatExtra(row) {
  if (!row) return null;
  return {
    ...row,
    precio: Number(row.precio),
    activo: Boolean(row.activo)
  };
}

async function createExtra(data) {
  const [result] = await pool.execute(
    "INSERT INTO extras (nombre, precio, activo) VALUES (?, ?, ?)",
    [data.nombre.trim(), data.precio, data.activo]
  );
  return findExtraById(result.insertId);
}

async function findAllExtras() {
  const [rows] = await pool.execute("SELECT * FROM extras ORDER BY nombre ASC");
  return rows.map(formatExtra);
}

async function findExtraById(id) {
  const [rows] = await pool.execute("SELECT * FROM extras WHERE id = ?", [id]);
  return formatExtra(rows[0]);
}

module.exports = {
  createExtra,
  findAllExtras,
  findExtraById
};
