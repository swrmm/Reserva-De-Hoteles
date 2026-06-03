const habitacionesModel = require("../models/habitacionesModel");
const reservasModel = require("../models/reservasModel");
const parseId = require("../utils/parseId");
const createHttpError = require("../utils/httpError");
const { diffInNights } = require("../utils/dateUtils");
const { validateReserva } = require("../validators/reservasValidator");

async function buildReservaData(payload, userId) {
  const habitacion = await habitacionesModel.findHabitacionById(payload.habitacion_id);

  if (!habitacion || !habitacion.activo) {
    throw createHttpError(404, "Habitacion no encontrada o inactiva", "ROOM_NOT_FOUND");
  }

  if (habitacion.estado === "mantenimiento" || habitacion.estado === "inactiva") {
    throw createHttpError(409, "La habitacion no esta disponible para reservas", "ROOM_NOT_AVAILABLE");
  }

  const noches = diffInNights(payload.fecha_entrada, payload.fecha_salida);
  const extrasTotal = payload.extras_total || 0;

  return {
    ...payload,
    usuario_id: userId,
    total: noches * habitacion.precio_noche + extrasTotal
  };
}

async function create(req, res) {
  const errors = validateReserva(req.body);
  if (errors.length) throw createHttpError(422, "Datos invalidos para crear reserva", "VALIDATION_ERROR", errors);

  const overlap = await reservasModel.hasSolapamiento({
    habitacionId: req.body.habitacion_id,
    fechaEntrada: req.body.fecha_entrada,
    fechaSalida: req.body.fecha_salida
  });

  if (overlap) {
    throw createHttpError(409, "No hay disponibilidad para esa habitacion en las fechas seleccionadas", "BOOKING_OVERLAP");
  }

  const reservaData = await buildReservaData(req.body, req.user ? req.user.id : null);
  const created = await reservasModel.createReserva(reservaData);

  return res.status(201).json({
    success: true,
    message: "Reserva creada correctamente",
    data: created
  });
}

async function list(req, res) {
  const reservas = await reservasModel.findAllReservas();
  return res.status(200).json({
    success: true,
    data: reservas
  });
}

async function getById(req, res) {
  const id = parseId(req.params.id);
  if (!id) throw createHttpError(400, "El id debe ser un entero positivo", "INVALID_ID");

  const reserva = await reservasModel.findReservaById(id);
  if (!reserva) throw createHttpError(404, "Reserva no encontrada", "BOOKING_NOT_FOUND");

  return res.status(200).json({
    success: true,
    data: reserva
  });
}

async function update(req, res) {
  const id = parseId(req.params.id);
  if (!id) throw createHttpError(400, "El id debe ser un entero positivo", "INVALID_ID");

  const errors = validateReserva(req.body);
  if (errors.length) throw createHttpError(422, "Datos invalidos para actualizar reserva", "VALIDATION_ERROR", errors);

  const overlap = await reservasModel.hasSolapamiento({
    habitacionId: req.body.habitacion_id,
    fechaEntrada: req.body.fecha_entrada,
    fechaSalida: req.body.fecha_salida,
    reservaId: id
  });

  if (overlap) {
    throw createHttpError(409, "No hay disponibilidad para esa habitacion en las fechas seleccionadas", "BOOKING_OVERLAP");
  }

  const reservaData = await buildReservaData(req.body, req.user ? req.user.id : null);
  const updated = await reservasModel.updateReserva(id, reservaData);
  if (!updated) throw createHttpError(404, "Reserva no encontrada", "BOOKING_NOT_FOUND");

  return res.status(200).json({
    success: true,
    message: "Reserva actualizada correctamente",
    data: updated
  });
}

async function remove(req, res) {
  const id = parseId(req.params.id);
  if (!id) throw createHttpError(400, "El id debe ser un entero positivo", "INVALID_ID");

  const deleted = await reservasModel.deleteReserva(id);
  if (!deleted) throw createHttpError(404, "Reserva no encontrada", "BOOKING_NOT_FOUND");

  return res.status(200).json({
    success: true,
    message: "Reserva eliminada correctamente"
  });
}

async function cancel(req, res) {
  const id = parseId(req.params.id);
  if (!id) throw createHttpError(400, "El id debe ser un entero positivo", "INVALID_ID");

  const reserva = await reservasModel.cancelarReserva(id);
  if (!reserva) throw createHttpError(404, "Reserva no encontrada", "BOOKING_NOT_FOUND");

  return res.status(200).json({
    success: true,
    message: "Reserva cancelada correctamente",
    data: reserva
  });
}

module.exports = {
  create,
  list,
  getById,
  update,
  remove,
  cancel
};
