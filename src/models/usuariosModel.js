const crypto = require("crypto");
const pool = require("../config/db");

function formatUser(row) {
  if (!row) return null;

  return {
    id: row.id,
    nombre: row.nombre,
    email: row.email,
    rol: row.rol,
    activo: Boolean(row.activo),
    created_at: row.created_at,
    updated_at: row.updated_at
  };
}

async function createUsuario(data) {
  const sql = `
    INSERT INTO usuarios (nombre, email, password_hash, rol)
    VALUES (?, ?, ?, ?)
  `;
  const values = [
    data.nombre.trim(),
    data.email.trim().toLowerCase(),
    data.password_hash,
    data.rol || "recepcionista"
  ];

  const [result] = await pool.execute(sql, values);
  return findUsuarioById(result.insertId);
}

async function findUsuarioById(id) {
  const [rows] = await pool.execute("SELECT * FROM usuarios WHERE id = ?", [id]);
  return formatUser(rows[0]);
}

async function findUsuarioByEmail(email) {
  const [rows] = await pool.execute("SELECT * FROM usuarios WHERE email = ?", [
    email.trim().toLowerCase()
  ]);
  return rows[0] || null;
}

async function createPasswordResetToken(usuarioId, token) {
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 30);

  await pool.execute(
    "INSERT INTO password_reset_tokens (usuario_id, token_hash, expires_at) VALUES (?, ?, ?)",
    [usuarioId, tokenHash, expiresAt]
  );
}

async function findValidResetToken(token) {
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const [rows] = await pool.execute(
    `
      SELECT prt.*, u.email
      FROM password_reset_tokens prt
      INNER JOIN usuarios u ON u.id = prt.usuario_id
      WHERE prt.token_hash = ?
        AND prt.used_at IS NULL
        AND prt.expires_at > NOW()
      LIMIT 1
    `,
    [tokenHash]
  );

  return rows[0] || null;
}

async function updatePassword(usuarioId, passwordHash) {
  const [result] = await pool.execute("UPDATE usuarios SET password_hash = ? WHERE id = ?", [
    passwordHash,
    usuarioId
  ]);
  return result.affectedRows > 0;
}

async function markResetTokenUsed(tokenId) {
  await pool.execute("UPDATE password_reset_tokens SET used_at = NOW() WHERE id = ?", [tokenId]);
}

module.exports = {
  createUsuario,
  findUsuarioById,
  findUsuarioByEmail,
  createPasswordResetToken,
  findValidResetToken,
  updatePassword,
  markResetTokenUsed
};
