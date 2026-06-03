'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const passwordHash = await bcrypt.hash('123456', 10);

    await queryInterface.bulkInsert('usuarios', [
      {
        nombre: 'Fabian Mora',
        email: 'fabian@example.com',
        password_hash: passwordHash,
        rol: 'admin',
        activo: true,
        created_at: now,
        updated_at: now,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('usuarios', { email: 'fabian@example.com' });
  },
};
