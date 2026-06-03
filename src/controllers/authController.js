const db = require('../models');
const { AppError } = require('../utils/errors');
const authService = require('../services/authService');
const asyncHandler = require('../utils/asyncHandler');

const { Usuario } = db;

const register = asyncHandler(async (req, res) => {
  const { email, password, nombre, rol } = req.body;

  const exists = await Usuario.unscoped().findOne({ where: { email } });
  if (exists) throw new AppError('El email ya esta registrado', 409);

  const passwordHash = await Usuario.hashPassword(password);
  const usuario = await Usuario.create({ email, passwordHash, nombre, rol });

  res.status(201).json({
    success: true,
    data: usuario.toSafeJSON(),
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const usuario = await Usuario.scope('withPassword').findOne({ where: { email } });
  if (!usuario || !(await usuario.validatePassword(password))) {
    throw new AppError('Credenciales invalidas', 401);
  }

  const tokens = await authService.issueTokens(usuario, {
    userAgent: req.get('user-agent'),
    ip: req.ip,
  });

  res.json({
    success: true,
    token: tokens.accessToken,
    data: {
      usuario: usuario.toSafeJSON(),
      ...tokens,
    },
  });
});

const refresh = asyncHandler(async (req, res) => {
  const tokens = await authService.refreshTokens(req.body.refreshToken);
  res.json({ success: true, data: tokens });
});

const logout = asyncHandler(async (req, res) => {
  await authService.revokeSession(req.body.refreshToken);
  res.status(204).send();
});

const me = asyncHandler(async (req, res) => {
  res.json({ success: true, data: req.usuario.toSafeJSON() });
});

const listSesiones = asyncHandler(async (req, res) => {
  const sesiones = await authService.listActiveSessions(req.usuario.id);
  res.json({ success: true, data: sesiones });
});

module.exports = {
  register,
  login,
  refresh,
  logout,
  me,
  listSesiones,
};
