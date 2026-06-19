'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('reservas', 'precio_noche_aplicado', {
      allowNull: false,
      defaultValue: 0,
      type: Sequelize.DECIMAL(10, 2),
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('reservas', 'precio_noche_aplicado');
  },
};
