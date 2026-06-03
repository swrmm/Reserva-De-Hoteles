'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('extras', {
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
      precio: {
        allowNull: false,
        type: Sequelize.DECIMAL(10, 2),
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
    await queryInterface.dropTable('extras');
  },
};
