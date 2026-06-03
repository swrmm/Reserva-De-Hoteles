const { isEmptyString, isPositiveNumber } = require("./common");

const TIPOS = ["individual", "doble", "suite", "familiar"];
const ESTADOS = ["disponible", "ocupada", "mantenimiento", "inactiva"];

function validateHabitacion(payload) {
  const errors = [];

  if ("id" in payload) errors.push("El campo id no debe enviarse en el body");
  if (isEmptyString(payload.numero)) errors.push("numero es obligatorio");
  if (!TIPOS.includes(payload.tipo)) errors.push("tipo debe ser individual, doble, suite o familiar");
  if (!Number.isInteger(payload.capacidad) || payload.capacidad <= 0) {
    errors.push("capacidad debe ser un entero mayor a 0");
  }
  if (!isPositiveNumber(payload.precio_noche)) {
    errors.push("precio_noche debe ser un numero mayor a 0");
  }
  if (!ESTADOS.includes(payload.estado)) {
    errors.push("estado debe ser disponible, ocupada, mantenimiento o inactiva");
  }
  if (payload.descripcion && typeof payload.descripcion !== "string") {
    errors.push("descripcion debe ser texto");
  }
  if (typeof payload.activo !== "boolean") {
    errors.push("activo debe ser boolean");
  }

  return errors;
}

module.exports = {
  validateHabitacion,
  TIPOS,
  ESTADOS
};
