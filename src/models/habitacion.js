'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Habitacion extends Model {
    static associate(models) {
      Habitacion.hasMany(models.Reserva, {
        foreignKey: 'habitacionId',
        as: 'reservas',
      });
    }
  }

  Habitacion.init(
    {
      numero: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
      },
      tipo: {
        type: DataTypes.ENUM('individual', 'doble', 'suite', 'familiar'),
        allowNull: false,
      },
      capacidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1 },
      },
      precio_noche: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: { min: 1 },
      },
      estado: {
        type: DataTypes.ENUM('disponible', 'ocupada', 'mantenimiento', 'inactiva'),
        allowNull: false,
        defaultValue: 'disponible',
      },
      descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      activo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: 'Habitacion',
      tableName: 'habitaciones',
      underscored: true,
    }
  );

  return Habitacion;
};
