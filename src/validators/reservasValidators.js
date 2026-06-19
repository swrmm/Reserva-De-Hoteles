const { body, param, query } = require('express-validator');

const isSalidaPosterior = (value, { req }) => {
  if (!req.body.fecha_entrada || !value) return true;
  return new Date(value) > new Date(req.body.fecha_entrada);
};

const idParam = [
  param('id').isInt({ min: 1 }).withMessage('id debe ser un entero positivo'),
];

const create = [
  body('habitacion_id').isInt({ min: 1 }).withMessage('habitacion_id debe ser positivo'),
  body('nombre_huesped').trim().notEmpty().withMessage('nombre_huesped es obligatorio'),
  body('email_huesped').isEmail().withMessage('email_huesped inválido').normalizeEmail(),
  body('fecha_entrada').isISO8601().withMessage('fecha_entrada debe ser fecha válida'),
  body('fecha_salida')
    .isISO8601()
    .withMessage('fecha_salida debe ser fecha válida')
    .custom(isSalidaPosterior)
    .withMessage('fecha_salida debe ser posterior a fecha_entrada'),
  body('estado')
    .isIn(['pendiente', 'confirmada', 'cancelada', 'finalizada'])
    .withMessage('estado invalido'),
  body('extras_total').optional().isFloat({ min: 0 }).withMessage('extras_total debe ser mayor o igual a 0'),
  body('observaciones').optional({ nullable: true }).isString().withMessage('observaciones debe ser texto'),
  body('origen').optional().isString().withMessage('origen debe ser texto'),
];

const disponibilidad = [
  query('desde').isISO8601().withMessage('desde debe ser fecha válida'),
  query('hasta')
    .isISO8601()
    .withMessage('hasta debe ser fecha válida')
    .custom((value, { req }) => new Date(value) > new Date(req.query.desde))
    .withMessage('hasta debe ser posterior a desde'),
  query('capacidad').optional().isInt({ min: 1 }).withMessage('capacidad debe ser positiva'),
  query('tipo').optional().isIn(['individual', 'doble', 'suite', 'familiar']).withMessage('tipo invalido'),
];

module.exports = {
  idParam,
  create,
  update: create,
  disponibilidad,
};
