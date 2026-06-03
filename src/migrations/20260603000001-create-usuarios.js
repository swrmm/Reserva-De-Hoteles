'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('usuarios', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      nombre: {
        allowNull: false,
        type: Sequelize.STRING(120),
      },
      email: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING(160),
      },
      password_hash: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      rol: {
        allowNull: false,
        defaultValue: 'recepcionista',
        type: Sequelize.ENUM('admin', 'recepcionista'),
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
    await queryInterface.dropTable('usuarios');
  },
};
