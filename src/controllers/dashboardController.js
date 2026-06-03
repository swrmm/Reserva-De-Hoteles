const { Op } = require('sequelize');
const db = require('../models');
const asyncHandler = require('../utils/asyncHandler');

const { Habitacion, Reserva } = db;

const resumen = asyncHandler(async (req, res) => {
  const habitaciones = await Habitacion.findAll();
  const reservas = await Reserva.findAll({
    where: {
      estado: { [Op.in]: ['pendiente', 'confirmada'] },
    },
    include: [
      {
        model: Habitacion,
        as: 'habitacion',
        attributes: ['numero', 'tipo'],
      },
    ],
    order: [['fecha_entrada', 'ASC']],
    limit: 5,
  });

  res.json({
    success: true,
    data: {
      habitaciones: {
        total: habitaciones.length,
        disponibles: habitaciones.filter((h) => h.estado === 'disponible' && h.activo).length,
        ocupadas: habitaciones.filter((h) => h.estado === 'ocupada').length,
        mantenimiento: habitaciones.filter((h) => h.estado === 'mantenimiento').length,
        inactivas: habitaciones.filter((h) => h.estado === 'inactiva' || !h.activo).length,
      },
      proximasReservas: reservas,
    },
  });
});

module.exports = {
  resumen,
};
