const { validationResult } = require('express-validator');
const { AppError } = require('../utils/errors');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Error de validación', 400, errors.array());
  }
  next();
};

module.exports = validate;
