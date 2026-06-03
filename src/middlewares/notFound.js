function notFound(req, res) {
  res.status(404).json({
    success: false,
    code: "ROUTE_NOT_FOUND",
    message: "Ruta no encontrada"
  });
}

module.exports = notFound;
