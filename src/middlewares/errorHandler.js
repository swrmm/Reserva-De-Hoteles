const {
  ValidationError,
  UniqueConstraintError,
  ForeignKeyConstraintError,
} = require('sequelize');

function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);

  if (error instanceof SyntaxError && 'body' in error) {
    return res.status(400).json({
      success: false,
      message: 'JSON invalido en el body',
    });
  }

  let statusCode = error.statusCode || 500;
  let message = error.message || 'Error interno del servidor';
  let details = error.details || null;

  if (error.name === 'SequelizeValidationError' || error instanceof ValidationError) {
    statusCode = 400;
    message = 'Error de validacion en base de datos';
    details = error.errors?.map((item) => ({ field: item.path, message: item.message }));
  }

  if (error.name === 'SequelizeUniqueConstraintError' || error instanceof UniqueConstraintError) {
    statusCode = 409;
    message = 'Registro duplicado';
    details = error.errors?.map((item) => ({ field: item.path, message: item.message }));
  }

  if (error.name === 'SequelizeForeignKeyConstraintError' || error instanceof ForeignKeyConstraintError) {
    statusCode = 400;
    message = 'Referencia invalida';
  }

  if (process.env.NODE_ENV !== 'production' && statusCode === 500) {
    console.error(error);
  }

  return res.status(statusCode).json({
    success: false,
    message,
    ...(details && { details }),
  });
}

module.exports = errorHandler;
