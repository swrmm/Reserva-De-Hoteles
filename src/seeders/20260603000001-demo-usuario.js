'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const passwordHash = await bcrypt.hash('123456', 10);
    const email = 'fabian@example.com';

    const existingUserId = await queryInterface.rawSelect('usuarios', { where: { email } }, ['id']);

    if (!existingUserId) {
      await queryInterface.bulkInsert('usuarios', [
        {
          nombre: 'Fabian Mora',
          email,
          password_hash: passwordHash,
          rol: 'admin',
          activo: true,
          created_at: now,
          updated_at: now,
        },
      ]);
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('usuarios', { email: 'fabian@example.com' });
  },
};
