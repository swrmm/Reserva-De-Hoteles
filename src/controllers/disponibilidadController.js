const { Op } = require('sequelize');
const db = require('../models');
const asyncHandler = require('../utils/asyncHandler');

const { Habitacion, Reserva } = db;

const list = asyncHandler(async (req, res) => {
  const { desde, hasta, capacidad, tipo } = req.query;

  const reservas = await Reserva.findAll({
    attributes: ['habitacionId'],
    where: {
      estado: { [Op.in]: ['pendiente', 'confirmada'] },
      fecha_entrada: { [Op.lt]: hasta },
      fecha_salida: { [Op.gt]: desde },
    },
  });

  const ocupadas = reservas.map((reserva) => reserva.habitacionId);
  const where = {
    activo: true,
    estado: 'disponible',
  };

  if (ocupadas.length) where.id = { [Op.notIn]: ocupadas };
  if (capacidad) where.capacidad = { [Op.gte]: Number(capacidad) };
  if (tipo) where.tipo = tipo;

  const habitaciones = await Habitacion.findAll({
    where,
    order: [['precio_noche', 'ASC']],
  });

  res.json({ success: true, data: habitaciones });
});

module.exports = {
  list,
};
