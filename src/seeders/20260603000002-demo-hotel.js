'use strict';

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    await queryInterface.bulkInsert('habitaciones', [
      {
        numero: '101',
        tipo: 'individual',
        capacidad: 1,
        precio_noche: 45000,
        estado: 'disponible',
        descripcion: 'Habitacion individual con escritorio y vista interior.',
        activo: true,
        created_at: now,
        updated_at: now,
      },
      {
        numero: '202',
        tipo: 'doble',
        capacidad: 2,
        precio_noche: 68000,
        estado: 'disponible',
        descripcion: 'Habitacion doble con cama queen y vista a la ciudad.',
        activo: true,
        created_at: now,
        updated_at: now,
      },
      {
        numero: '303',
        tipo: 'suite',
        capacidad: 3,
        precio_noche: 120000,
        estado: 'mantenimiento',
        descripcion: 'Suite con sala privada y tina.',
        activo: true,
        created_at: now,
        updated_at: now,
      },
    ]);

    await queryInterface.bulkInsert('extras', [
      {
        nombre: 'Desayuno buffet',
        precio: 8500,
        activo: true,
        created_at: now,
        updated_at: now,
      },
      {
        nombre: 'Estacionamiento',
        precio: 6000,
        activo: true,
        created_at: now,
        updated_at: now,
      },
      {
        nombre: 'Late checkout',
        precio: 15000,
        activo: true,
        created_at: now,
        updated_at: now,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('extras', null, {});
    await queryInterface.bulkDelete('habitaciones', null, {});
  },
};
