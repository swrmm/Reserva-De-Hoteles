const { Op } = require('sequelize');
const db = require('../models');
const { AppError } = require('../utils/errors');
const asyncHandler = require('../utils/asyncHandler');
const { parsePagination, buildPaginatedResponse } = require('../utils/pagination');

const { Habitacion, Reserva } = db;

const buildWhere = (query) => {
  const where = {};
  if (query.tipo) where.tipo = query.tipo;
  if (query.estado) where.estado = query.estado;
  if (query.search) {
    where[Op.or] = [
      { numero: { [Op.like]: `%${query.search}%` } },
      { descripcion: { [Op.like]: `%${query.search}%` } },
    ];
  }
  return where;
};

const list = asyncHandler(async (req, res) => {
  const { page, limit, offset } = parsePagination(req.query);

  const { rows, count } = await Habitacion.findAndCountAll({
    where: buildWhere(req.query),
    limit,
    offset,
    order: [['numero', 'ASC']],
  });

  res.json({
    success: true,
    ...buildPaginatedResponse(rows, count, { page, limit }),
  });
});

const getById = asyncHandler(async (req, res) => {
  const habitacion = await Habitacion.findByPk(req.params.id);
  if (!habitacion) throw new AppError('Habitación no encontrada', 404);

  res.json({ success: true, data: habitacion });
});

const create = asyncHandler(async (req, res) => {
  const habitacion = await Habitacion.create(req.body);
  res.status(201).json({ success: true, data: habitacion });
});

const replace = asyncHandler(async (req, res) => {
  const habitacion = await Habitacion.findByPk(req.params.id);
  if (!habitacion) throw new AppError('Habitación no encontrada', 404);

  await habitacion.update(req.body);
  res.json({ success: true, data: habitacion });
});

const patch = replace;

const remove = asyncHandler(async (req, res) => {
  const habitacion = await Habitacion.findByPk(req.params.id);
  if (!habitacion) throw new AppError('Habitación no encontrada', 404);

  const reservas = await Reserva.count({ where: { habitacionId: habitacion.id } });
  if (reservas > 0) {
    throw new AppError('No se puede eliminar una habitación con reservas asociadas', 409);
  }

  await habitacion.destroy();
  res.status(204).send();
});

module.exports = {
  list,
  getById,
  create,
  replace,
  patch,
  remove,
};
