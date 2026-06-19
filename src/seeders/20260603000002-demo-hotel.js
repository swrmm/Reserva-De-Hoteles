'use strict';

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    const habitaciones = [
      {
        numero: '101',
        tipo: 'individual',
        capacidad: 1,
        precio_noche: 45000,
        estado: 'disponible',
        descripcion: 'Habitación individual con escritorio y vista interior.',
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
        descripcion: 'Habitación doble con cama queen y vista a la ciudad.',
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
    ];

    const extras = [
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
    ];

    const habitacionesPendientes = [];
    for (const habitacion of habitaciones) {
      const existingRoomId = await queryInterface.rawSelect(
        'habitaciones',
        { where: { numero: habitacion.numero } },
        ['id']
      );

      if (!existingRoomId) {
        habitacionesPendientes.push(habitacion);
      }
    }

    if (habitacionesPendientes.length > 0) {
      await queryInterface.bulkInsert('habitaciones', habitacionesPendientes);
    }

    const extrasPendientes = [];
    for (const extra of extras) {
      const existingExtraId = await queryInterface.rawSelect(
        'extras',
        { where: { nombre: extra.nombre } },
        ['id']
      );

      if (!existingExtraId) {
        extrasPendientes.push(extra);
      }
    }

    if (extrasPendientes.length > 0) {
      await queryInterface.bulkInsert('extras', extrasPendientes);
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('extras', null, {});
    await queryInterface.bulkDelete('habitaciones', null, {});
  },
};
