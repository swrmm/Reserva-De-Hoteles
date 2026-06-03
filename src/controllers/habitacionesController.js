const habitacionesModel = require("../models/habitacionesModel");
const parseId = require("../utils/parseId");
const createHttpError = require("../utils/httpError");
const { validateHabitacion } = require("../validators/habitacionesValidator");

async function create(req, res) {
  const errors = validateHabitacion(req.body);
  if (errors.length) throw createHttpError(400, "Datos invalidos para crear habitacion", "VALIDATION_ERROR", errors);

  const created = await habitacionesModel.createHabitacion(req.body);
  return res.status(201).json({
    success: true,
    message: "Habitacion creada correctamente",
    data: created
  });
}

async function list(req, res) {
  const habitaciones = await habitacionesModel.findAllHabitaciones(req.query);
  return res.status(200).json({
    success: true,
    data: habitaciones
  });
}

async function getById(req, res) {
  const id = parseId(req.params.id);
  if (!id) throw createHttpError(400, "El id debe ser un entero positivo", "INVALID_ID");

  const habitacion = await habitacionesModel.findHabitacionById(id);
  if (!habitacion) throw createHttpError(404, "Habitacion no encontrada", "ROOM_NOT_FOUND");

  return res.status(200).json({
    success: true,
    data: habitacion
  });
}

async function update(req, res) {
  const id = parseId(req.params.id);
  if (!id) throw createHttpError(400, "El id debe ser un entero positivo", "INVALID_ID");

  const errors = validateHabitacion(req.body);
  if (errors.length) throw createHttpError(400, "Datos invalidos para actualizar habitacion", "VALIDATION_ERROR", errors);

  const updated = await habitacionesModel.updateHabitacion(id, req.body);
  if (!updated) throw createHttpError(404, "Habitacion no encontrada", "ROOM_NOT_FOUND");

  return res.status(200).json({
    success: true,
    message: "Habitacion actualizada correctamente",
    data: updated
  });
}

async function remove(req, res) {
  const id = parseId(req.params.id);
  if (!id) throw createHttpError(400, "El id debe ser un entero positivo", "INVALID_ID");

  const deleted = await habitacionesModel.deleteHabitacion(id);
  if (!deleted) throw createHttpError(404, "Habitacion no encontrada", "ROOM_NOT_FOUND");

  return res.status(200).json({
    success: true,
    message: "Habitacion eliminada correctamente"
  });
}

module.exports = {
  create,
  list,
  getById,
  update,
  remove
};
