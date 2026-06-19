const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const config = require('../config');

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

const signAccessToken = (usuario) =>
  jwt.sign(
    { sub: usuario.id, email: usuario.email, rol: usuario.rol },
    config.jwt.accessSecret,
    { expiresIn: config.jwt.accessExpiresIn }
  );

const signRefreshToken = (usuario, sessionId) =>
  jwt.sign(
    { sub: usuario.id, sid: sessionId, type: 'refresh' },
    config.jwt.refreshSecret,
    { expiresIn: config.jwt.refreshExpiresIn }
  );

const verifyAccessToken = (token) => jwt.verify(token, config.jwt.accessSecret);

const verifyRefreshToken = (token) => jwt.verify(token, config.jwt.refreshSecret);

const getRefreshExpiresAt = () => {
  const expiresIn = config.jwt.refreshExpiresIn;
  const match = /^(\d+)([dhms])$/.exec(expiresIn);
  if (!match) return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const value = parseInt(match[1], 10);
  const unit = match[2];
  const multipliers = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
  return new Date(Date.now() + value * multipliers[unit]);
};

const generateOpaqueRefreshToken = () => crypto.randomBytes(48).toString('hex');

const generatePasswordResetToken = () => crypto.randomBytes(32).toString('hex');

module.exports = {
  hashToken,
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  getRefreshExpiresAt,
  generateOpaqueRefreshToken,
  generatePasswordResetToken,
};
