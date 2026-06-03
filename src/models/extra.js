'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Extra extends Model {}

  Extra.init(
    {
      nombre: {
        type: DataTypes.STRING(120),
        allowNull: false,
      },
      precio: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: { min: 0 },
      },
      activo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: 'Extra',
      tableName: 'extras',
      underscored: true,
    }
  );

  return Extra;
};
