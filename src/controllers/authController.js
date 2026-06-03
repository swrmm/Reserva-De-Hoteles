const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const usuariosModel = require("../models/usuariosModel");
const createHttpError = require("../utils/httpError");
const {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword
} = require("../validators/authValidator");

function createToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      rol: user.rol
    },
    process.env.JWT_SECRET || "dev-secret",
    { expiresIn: process.env.JWT_EXPIRES_IN || "2h" }
  );
}

async function register(req, res) {
  const errors = validateRegister(req.body);
  if (errors.length) throw createHttpError(400, "Datos invalidos para registrar usuario", "VALIDATION_ERROR", errors);

  const existing = await usuariosModel.findUsuarioByEmail(req.body.email);
  if (existing) throw createHttpError(409, "Ya existe un usuario con ese email", "EMAIL_ALREADY_EXISTS");

  const passwordHash = await bcrypt.hash(req.body.password, 10);
  const user = await usuariosModel.createUsuario({
    nombre: req.body.nombre,
    email: req.body.email,
    password_hash: passwordHash,
    rol: req.body.rol
  });

  return res.status(201).json({
    success: true,
    message: "Usuario registrado correctamente",
    data: user
  });
}

async function login(req, res) {
  const errors = validateLogin(req.body);
  if (errors.length) throw createHttpError(400, "Datos invalidos para iniciar sesion", "VALIDATION_ERROR", errors);

  const userRow = await usuariosModel.findUsuarioByEmail(req.body.email);
  const validPassword = userRow
    ? await bcrypt.compare(req.body.password, userRow.password_hash)
    : false;

  if (!userRow || !validPassword || !userRow.activo) {
    throw createHttpError(401, "Email o password incorrectos", "INVALID_CREDENTIALS");
  }

  const user = {
    id: userRow.id,
    nombre: userRow.nombre,
    email: userRow.email,
    rol: userRow.rol
  };

  return res.status(200).json({
    success: true,
    message: "Login correcto",
    token: createToken(user),
    data: user
  });
}

async function forgotPassword(req, res) {
  const errors = validateForgotPassword(req.body);
  if (errors.length) throw createHttpError(400, "Email invalido", "VALIDATION_ERROR", errors);

  const user = await usuariosModel.findUsuarioByEmail(req.body.email);
  const token = crypto.randomBytes(24).toString("hex");

  if (user) {
    await usuariosModel.createPasswordResetToken(user.id, token);
  }

  return res.status(200).json({
    success: true,
    message: "Si el email existe, se genero un token de recuperacion",
    token_demo: user ? token : null
  });
}

async function resetPassword(req, res) {
  const errors = validateResetPassword(req.body);
  if (errors.length) throw createHttpError(400, "Datos invalidos para restablecer password", "VALIDATION_ERROR", errors);

  const resetToken = await usuariosModel.findValidResetToken(req.body.token);
  if (!resetToken) throw createHttpError(400, "Token invalido o expirado", "INVALID_RESET_TOKEN");

  const passwordHash = await bcrypt.hash(req.body.password, 10);
  await usuariosModel.updatePassword(resetToken.usuario_id, passwordHash);
  await usuariosModel.markResetTokenUsed(resetToken.id);

  return res.status(200).json({
    success: true,
    message: "Password actualizado correctamente"
  });
}

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword
};
