const { body, param, query } = require('express-validator');

const idParam = [
  param('id').isInt({ min: 1 }).withMessage('id debe ser un entero positivo'),
];

const listQuery = [
  query('page').optional().isInt({ min: 1 }).withMessage('page debe ser positivo'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('limit debe estar entre 1 y 50'),
  query('tipo').optional().isIn(['individual', 'doble', 'suite', 'familiar']).withMessage('tipo invalido'),
  query('estado')
    .optional()
    .isIn(['disponible', 'ocupada', 'mantenimiento', 'inactiva'])
    .withMessage('estado invalido'),
];

const create = [
  body('numero').trim().notEmpty().withMessage('número es obligatorio'),
  body('tipo').isIn(['individual', 'doble', 'suite', 'familiar']).withMessage('tipo invalido'),
  body('capacidad').isInt({ min: 1 }).withMessage('capacidad debe ser mayor a 0'),
  body('precio_noche').isFloat({ min: 1 }).withMessage('precio_noche debe ser mayor a 0'),
  body('estado')
    .isIn(['disponible', 'ocupada', 'mantenimiento', 'inactiva'])
    .withMessage('estado invalido'),
  body('descripcion').optional({ nullable: true }).isString().withMessage('descripcion debe ser texto'),
  body('activo').isBoolean().withMessage('activo debe ser boolean'),
];

module.exports = {
  idParam,
  listQuery,
  create,
  update: create,
};
