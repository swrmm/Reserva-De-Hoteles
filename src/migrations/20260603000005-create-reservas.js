'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('reservas', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      habitacion_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'habitaciones',
          key: 'id',
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      },
      usuario_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'usuarios',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      nombre_huesped: {
        allowNull: false,
        type: Sequelize.STRING(140),
      },
      email_huesped: {
        allowNull: false,
        type: Sequelize.STRING(160),
      },
      fecha_entrada: {
        allowNull: false,
        type: Sequelize.DATEONLY,
      },
      fecha_salida: {
        allowNull: false,
        type: Sequelize.DATEONLY,
      },
      estado: {
        allowNull: false,
        defaultValue: 'pendiente',
        type: Sequelize.ENUM('pendiente', 'confirmada', 'cancelada', 'finalizada'),
      },
      total: {
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.DECIMAL(10, 2),
      },
      extras_total: {
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.DECIMAL(10, 2),
      },
      observaciones: {
        allowNull: true,
        type: Sequelize.TEXT,
      },
      origen: {
        allowNull: false,
        defaultValue: 'postman',
        type: Sequelize.STRING(40),
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
    await queryInterface.dropTable('reservas');
  },
};
