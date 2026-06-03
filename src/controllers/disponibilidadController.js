const habitacionesModel = require("../models/habitacionesModel");
const createHttpError = require("../utils/httpError");
const { validateDisponibilidad } = require("../validators/reservasValidator");

async function list(req, res) {
  const errors = validateDisponibilidad(req.query);
  if (errors.length) throw createHttpError(422, "Parametros de disponibilidad invalidos", "VALIDATION_ERROR", errors);

  const habitaciones = await habitacionesModel.findDisponibles({
    desde: req.query.desde,
    hasta: req.query.hasta,
    capacidad: req.query.capacidad,
    tipo: req.query.tipo
  });

  return res.status(200).json({
    success: true,
    message: habitaciones.length ? "Habitaciones disponibles encontradas" : "No hay habitaciones disponibles",
    data: habitaciones
  });
}

module.exports = {
  list
};
