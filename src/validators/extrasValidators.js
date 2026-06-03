const { body } = require('express-validator');

const create = [
  body('nombre').trim().notEmpty().withMessage('nombre es obligatorio'),
  body('precio').isFloat({ min: 0 }).withMessage('precio debe ser mayor o igual a 0'),
  body('activo').isBoolean().withMessage('activo debe ser boolean'),
];

module.exports = {
  create,
};
