'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Reserva extends Model {
    static associate(models) {
      Reserva.belongsTo(models.Habitacion, {
        foreignKey: 'habitacionId',
        as: 'habitacion',
      });
      Reserva.belongsTo(models.Usuario, {
        foreignKey: 'usuarioId',
        as: 'usuario',
      });
    }
  }

  Reserva.init(
    {
      habitacionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'habitacion_id',
      },
      usuarioId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'usuario_id',
      },
      nombre_huesped: {
        type: DataTypes.STRING(140),
        allowNull: false,
      },
      email_huesped: {
        type: DataTypes.STRING(160),
        allowNull: false,
        validate: { isEmail: true },
      },
      fecha_entrada: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      fecha_salida: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      estado: {
        type: DataTypes.ENUM('pendiente', 'confirmada', 'cancelada', 'finalizada'),
        allowNull: false,
        defaultValue: 'pendiente',
      },
      total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      extras_total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      precio_noche_aplicado: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      observaciones: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      origen: {
        type: DataTypes.STRING(40),
        allowNull: false,
        defaultValue: 'postman',
      },
    },
    {
      sequelize,
      modelName: 'Reserva',
      tableName: 'reservas',
      underscored: true,
    }
  );

  return Reserva;
};
