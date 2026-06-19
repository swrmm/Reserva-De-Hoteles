const { Op } = require('sequelize');
const db = require('../models');
const { AppError } = require('../utils/errors');
const asyncHandler = require('../utils/asyncHandler');
const { diffInNights } = require('../utils/dateUtils');

const { Habitacion, Reserva } = db;

const includeHabitacion = {
  model: Habitacion,
  as: 'habitacion',
  attributes: ['id', 'numero', 'tipo', 'precio_noche'],
};

const buildOwnershipWhere = (usuario) => {
  if (usuario.rol === 'admin') return {};
  return { usuarioId: usuario.id };
};

const findReservaForUser = async (id, usuario, options = {}) => {
  const reserva = await Reserva.findOne({
    where: {
      id,
      ...buildOwnershipWhere(usuario),
    },
    ...options,
  });

  if (!reserva) throw new AppError('Reserva no encontrada', 404);
  return reserva;
};

const hasSolapamiento = async ({ habitacionId, fechaEntrada, fechaSalida, reservaId = null }) => {
  const where = {
    habitacionId,
    estado: { [Op.in]: ['pendiente', 'confirmada'] },
    fecha_entrada: { [Op.lt]: fechaSalida },
    fecha_salida: { [Op.gt]: fechaEntrada },
  };

  if (reservaId) where.id = { [Op.ne]: reservaId };

  const count = await Reserva.count({ where });
  return count > 0;
};

const buildReservaData = async (payload, usuarioId) => {
  const habitacion = await Habitacion.findByPk(payload.habitacion_id);
  if (!habitacion || !habitacion.activo) {
    throw new AppError('Habitación no encontrada o inactiva', 404);
  }

  if (['mantenimiento', 'inactiva'].includes(habitacion.estado)) {
    throw new AppError('La habitación no está disponible para reservas', 409);
  }

  const noches = diffInNights(payload.fecha_entrada, payload.fecha_salida);
  const extrasTotal = Number(payload.extras_total || 0);
  const precioNocheAplicado = Number(habitacion.precio_noche);

  return {
    habitacionId: payload.habitacion_id,
    usuarioId,
    nombre_huesped: payload.nombre_huesped,
    email_huesped: payload.email_huesped,
    fecha_entrada: payload.fecha_entrada,
    fecha_salida: payload.fecha_salida,
    estado: payload.estado,
    precio_noche_aplicado: precioNocheAplicado,
    extras_total: extrasTotal,
    total: noches * precioNocheAplicado + extrasTotal,
    observaciones: payload.observaciones || null,
    origen: payload.origen || 'postman',
  };
};

const list = asyncHandler(async (req, res) => {
  const reservas = await Reserva.findAll({
    where: buildOwnershipWhere(req.usuario),
    include: [includeHabitacion],
    order: [['fecha_entrada', 'DESC']],
  });

  res.json({ success: true, data: reservas });
});

const getById = asyncHandler(async (req, res) => {
  const reserva = await findReservaForUser(req.params.id, req.usuario, { include: [includeHabitacion] });

  res.json({ success: true, data: reserva });
});

const create = asyncHandler(async (req, res) => {
  const overlap = await hasSolapamiento({
    habitacionId: req.body.habitacion_id,
    fechaEntrada: req.body.fecha_entrada,
    fechaSalida: req.body.fecha_salida,
  });

  if (overlap) {
    throw new AppError('No hay disponibilidad para esa habitación en las fechas seleccionadas', 409);
  }

  const data = await buildReservaData(req.body, req.usuario.id);
  const reserva = await Reserva.create(data);
  const withHabitacion = await Reserva.findByPk(reserva.id, { include: [includeHabitacion] });

  res.status(201).json({ success: true, data: withHabitacion });
});

const replace = asyncHandler(async (req, res) => {
  const reserva = await findReservaForUser(req.params.id, req.usuario);

  const overlap = await hasSolapamiento({
    habitacionId: req.body.habitacion_id,
    fechaEntrada: req.body.fecha_entrada,
    fechaSalida: req.body.fecha_salida,
    reservaId: reserva.id,
  });

  if (overlap) {
    throw new AppError('No hay disponibilidad para esa habitación en las fechas seleccionadas', 409);
  }

  const data = await buildReservaData(req.body, req.usuario.id);
  await reserva.update(data);
  const withHabitacion = await Reserva.findByPk(reserva.id, { include: [includeHabitacion] });

  res.json({ success: true, data: withHabitacion });
});

const patch = replace;

const cancel = asyncHandler(async (req, res) => {
  const reserva = await findReservaForUser(req.params.id, req.usuario, { include: [includeHabitacion] });

  await reserva.update({ estado: 'cancelada' });
  res.json({ success: true, data: reserva });
});

const remove = asyncHandler(async (req, res) => {
  const reserva = await findReservaForUser(req.params.id, req.usuario);

  await reserva.destroy();
  res.status(204).send();
});

module.exports = {
  list,
  getById,
  create,
  replace,
  patch,
  cancel,
  remove,
};
