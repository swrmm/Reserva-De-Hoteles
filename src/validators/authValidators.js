const { body } = require('express-validator');

const register = [
  body('email').isEmail().withMessage('Email invalido').normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contrasena debe tener al menos 6 caracteres'),
  body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio'),
  body('rol').optional().isIn(['admin', 'recepcionista']).withMessage('Rol invalido'),
];

const login = [
  body('email').isEmail().withMessage('Email invalido').normalizeEmail(),
  body('password').notEmpty().withMessage('La contrasena es obligatoria'),
];

const refresh = [
  body('refreshToken').notEmpty().withMessage('refreshToken es obligatorio'),
];

const logout = [
  body('refreshToken').notEmpty().withMessage('refreshToken es obligatorio'),
];

module.exports = {
  register,
  login,
  refresh,
  logout,
};
