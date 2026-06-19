const { Op } = require('sequelize');
const db = require('../models');
const config = require('../config');
const { AppError } = require('../utils/errors');
const tokenService = require('./tokenService');

const { Usuario, RefreshToken, PasswordResetToken } = db;

const issueTokens = async (usuario, meta = {}) => {
  const opaqueRefresh = tokenService.generateOpaqueRefreshToken();
  const session = await RefreshToken.create({
    usuarioId: usuario.id,
    tokenHash: tokenService.hashToken(opaqueRefresh),
    userAgent: meta.userAgent || null,
    ip: meta.ip || null,
    expiresAt: tokenService.getRefreshExpiresAt(),
  });

  const accessToken = tokenService.signAccessToken(usuario);
  const refreshTokenJwt = tokenService.signRefreshToken(usuario, session.id);

  return {
    accessToken,
    refreshToken: `${refreshTokenJwt}.${opaqueRefresh}`,
    expiresIn: config.jwt.accessExpiresIn,
    sessionId: session.id,
  };
};

const parseRefreshToken = (refreshToken) => {
  const lastDot = refreshToken.lastIndexOf('.');
  if (lastDot === -1) throw new AppError('Refresh token invalido', 401);

  return {
    jwtPart: refreshToken.slice(0, lastDot),
    opaquePart: refreshToken.slice(lastDot + 1),
  };
};

const findActiveSession = async (refreshToken) => {
  const { jwtPart, opaquePart } = parseRefreshToken(refreshToken);
  let payload;

  try {
    payload = tokenService.verifyRefreshToken(jwtPart);
  } catch {
    throw new AppError('Refresh token expirado o invalido', 401);
  }

  if (payload.type !== 'refresh') throw new AppError('Refresh token invalido', 401);

  const session = await RefreshToken.findByPk(payload.sid);
  if (!session || session.usuarioId !== payload.sub) {
    throw new AppError('Sesión no encontrada', 401);
  }

  const hash = tokenService.hashToken(opaquePart);
  if (session.tokenHash !== hash || !session.isActive()) {
    throw new AppError('Sesión revocada o expirada', 401);
  }

  const usuario = await Usuario.findByPk(payload.sub);
  if (!usuario) throw new AppError('Usuario no encontrado', 401);

  return { usuario, session };
};

const refreshTokens = async (refreshToken) => {
  const { usuario, session } = await findActiveSession(refreshToken);
  await session.update({ revokedAt: new Date() });
  return issueTokens(usuario, { userAgent: session.userAgent, ip: session.ip });
};

const revokeSession = async (refreshToken) => {
  const { session } = await findActiveSession(refreshToken);
  await session.update({ revokedAt: new Date() });
};

const listActiveSessions = async (usuarioId) => {
  const sessions = await RefreshToken.findAll({
    where: {
      usuarioId,
      revokedAt: null,
      expiresAt: { [Op.gt]: new Date() },
    },
    order: [['createdAt', 'DESC']],
  });

  return sessions.map((session) => session.toSessionJSON());
};

const requestPasswordReset = async (email) => {
  const usuario = await Usuario.unscoped().findOne({ where: { email } });
  if (!usuario) return null;

  await PasswordResetToken.update(
    { usedAt: new Date() },
    {
      where: {
        usuarioId: usuario.id,
        usedAt: null,
      },
    }
  );

  const resetToken = tokenService.generatePasswordResetToken();
  await PasswordResetToken.create({
    usuarioId: usuario.id,
    tokenHash: tokenService.hashToken(resetToken),
    expiresAt: new Date(Date.now() + 30 * 60 * 1000),
  });

  return resetToken;
};

const resetPassword = async ({ token, password }) => {
  const tokenHash = tokenService.hashToken(token);
  const resetRecord = await PasswordResetToken.findOne({ where: { tokenHash } });

  if (!resetRecord || !resetRecord.isActive()) {
    throw new AppError('Codigo de recuperacion invalido o expirado', 401);
  }

  const usuario = await Usuario.scope('withPassword').findByPk(resetRecord.usuarioId);
  if (!usuario) throw new AppError('Usuario no encontrado', 404);

  const passwordHash = await Usuario.hashPassword(password);
  await usuario.update({ passwordHash });
  await resetRecord.update({ usedAt: new Date() });
  await RefreshToken.update({ revokedAt: new Date() }, { where: { usuarioId: usuario.id, revokedAt: null } });
};

module.exports = {
  issueTokens,
  refreshTokens,
  revokeSession,
  listActiveSessions,
  requestPasswordReset,
  resetPassword,
};
