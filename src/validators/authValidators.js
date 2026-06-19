const { body } = require('express-validator');

const register = [
  body('email').isEmail().withMessage('Email invalido').normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres')
    .matches(/[A-Z]/)
    .withMessage('La contraseña debe incluir al menos una letra mayúscula')
    .matches(/\d/)
    .withMessage('La contraseña debe incluir al menos un número'),
  body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio'),
];

const login = [
  body('email').isEmail().withMessage('Email invalido').normalizeEmail(),
  body('password').notEmpty().withMessage('La contraseña es obligatoria'),
];

const refresh = [
  body('refreshToken').notEmpty().withMessage('refreshToken es obligatorio'),
];

const logout = [
  body('refreshToken').notEmpty().withMessage('refreshToken es obligatorio'),
];

const updateProfile = [
  body('nombre').optional().trim().notEmpty().withMessage('El nombre no puede estar vacio'),
  body('email').optional().isEmail().withMessage('Email invalido').normalizeEmail(),
  body('password')
    .optional({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres')
    .matches(/[A-Z]/)
    .withMessage('La contraseña debe incluir al menos una letra mayúscula')
    .matches(/\d/)
    .withMessage('La contraseña debe incluir al menos un número'),
];

const forgotPassword = [
  body('email').isEmail().withMessage('Email invalido').normalizeEmail(),
];

const resetPassword = [
  body('token').notEmpty().withMessage('El código de recuperación es obligatorio'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres')
    .matches(/[A-Z]/)
    .withMessage('La contraseña debe incluir al menos una letra mayúscula')
    .matches(/\d/)
    .withMessage('La contraseña debe incluir al menos un número'),
];

module.exports = {
  register,
  login,
  refresh,
  logout,
  updateProfile,
  forgotPassword,
  resetPassword,
};
