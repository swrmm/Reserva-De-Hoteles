function errorHandler(error, req, res, next) {
  console.error(error);

  if (error instanceof SyntaxError && "body" in error) {
    return res.status(400).json({
      success: false,
      code: "INVALID_JSON",
      message: "JSON invalido en el body"
    });
  }

  if (error.statusCode) {
    return res.status(error.statusCode).json({
      success: false,
      code: error.code || "REQUEST_ERROR",
      message: error.message,
      errors: error.details || []
    });
  }

  if (error.code === "ER_DUP_ENTRY") {
    return res.status(409).json({
      success: false,
      code: "DUPLICATE_RESOURCE",
      message: "Ya existe un registro con esos datos"
    });
  }

  if (error.code === "ER_ROW_IS_REFERENCED_2" || error.code === "ER_NO_REFERENCED_ROW_2") {
    return res.status(409).json({
      success: false,
      code: "RELATION_CONFLICT",
      message: "No se puede completar la accion porque existen datos relacionados"
    });
  }

  return res.status(500).json({
    success: false,
    code: "INTERNAL_ERROR",
    message: "Error interno del servidor"
  });
}

module.exports = errorHandler;
