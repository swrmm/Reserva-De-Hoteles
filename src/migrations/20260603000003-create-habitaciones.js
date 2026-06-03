'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('habitaciones', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      numero: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING(20),
      },
      tipo: {
        allowNull: false,
        type: Sequelize.ENUM('individual', 'doble', 'suite', 'familiar'),
      },
      capacidad: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      precio_noche: {
        allowNull: false,
        type: Sequelize.DECIMAL(10, 2),
      },
      estado: {
        allowNull: false,
        defaultValue: 'disponible',
        type: Sequelize.ENUM('disponible', 'ocupada', 'mantenimiento', 'inactiva'),
      },
      descripcion: {
        allowNull: true,
        type: Sequelize.TEXT,
      },
      activo: {
        allowNull: false,
        defaultValue: true,
        type: Sequelize.BOOLEAN,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('habitaciones');
  },
};
