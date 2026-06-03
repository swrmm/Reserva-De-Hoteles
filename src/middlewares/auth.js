const tokenService = require('../services/tokenService');
const db = require('../models');
const { AppError } = require('../utils/errors');
const asyncHandler = require('../utils/asyncHandler');

const verifyAccessToken = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    throw new AppError('Token de acceso requerido', 401);
  }

  const token = header.slice(7);
  let payload;

  try {
    payload = tokenService.verifyAccessToken(token);
  } catch {
    throw new AppError('Token de acceso invalido o expirado', 401);
  }

  const usuario = await db.Usuario.findByPk(payload.sub);
  if (!usuario) throw new AppError('Usuario no encontrado', 401);

  req.usuario = usuario;
  req.tokenPayload = payload;
  next();
});

module.exports = { verifyAccessToken };
