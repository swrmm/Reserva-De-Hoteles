const db = require('../models');
const { AppError } = require('../utils/errors');
const authService = require('../services/authService');
const asyncHandler = require('../utils/asyncHandler');

const { Habitacion, Reserva, Usuario } = db;

const register = asyncHandler(async (req, res) => {
  const { email, password, nombre } = req.body;

  const exists = await Usuario.unscoped().findOne({ where: { email } });
  if (exists) throw new AppError('El email ya está registrado', 409);

  const passwordHash = await Usuario.hashPassword(password);
  const usuario = await Usuario.create({ email, passwordHash, nombre, rol: 'recepcionista' });

  res.status(201).json({
    success: true,
    data: usuario.toSafeJSON(),
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const usuario = await Usuario.scope('withPassword').findOne({ where: { email } });
  if (!usuario || !(await usuario.validatePassword(password))) {
    throw new AppError('Credenciales inválidas', 401);
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

const updateMe = asyncHandler(async (req, res) => {
  const { nombre, email, password } = req.body;

  if (email && email !== req.usuario.email) {
    const exists = await Usuario.unscoped().findOne({ where: { email } });
    if (exists) throw new AppError('El email ya está registrado', 409);
    req.usuario.email = email;
  }

  if (nombre) req.usuario.nombre = nombre;
  if (password) req.usuario.passwordHash = await Usuario.hashPassword(password);

  await req.usuario.save();
  res.json({ success: true, data: req.usuario.toSafeJSON() });
});

const listSesiones = asyncHandler(async (req, res) => {
  const sesiones = await authService.listActiveSessions(req.usuario.id);
  res.json({ success: true, data: sesiones });
});

const listUsuarios = asyncHandler(async (req, res) => {
  const usuarios = await Usuario.findAll({
    attributes: ['id', 'nombre', 'email', 'rol', 'activo', 'createdAt', 'updatedAt'],
    include: [
      {
        model: Reserva,
        as: 'reservas',
        include: [
          {
            model: Habitacion,
            as: 'habitacion',
            attributes: ['id', 'numero', 'tipo', 'precio_noche'],
          },
        ],
      },
    ],
    order: [
      ['createdAt', 'DESC'],
      [{ model: Reserva, as: 'reservas' }, 'fecha_entrada', 'DESC'],
    ],
  });

  res.json({ success: true, data: usuarios });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const resetToken = await authService.requestPasswordReset(req.body.email);
  res.json({
    success: true,
    message: 'Si el email existe, se generó un código de recuperación',
    ...(resetToken && process.env.NODE_ENV !== 'production' && { data: { resetToken } }),
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  await authService.resetPassword(req.body);
  res.json({ success: true, message: 'Contraseña actualizada correctamente' });
});

module.exports = {
  register,
  login,
  refresh,
  logout,
  me,
  updateMe,
  listSesiones,
  listUsuarios,
  forgotPassword,
  resetPassword,
};
