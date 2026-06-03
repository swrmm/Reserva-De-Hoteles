const { isEmptyString } = require("./common");

function validateExtra(payload) {
  const errors = [];

  if (isEmptyString(payload.nombre)) errors.push("nombre es obligatorio");
  if (typeof payload.precio !== "number" || payload.precio < 0) {
    errors.push("precio debe ser un numero mayor o igual a 0");
  }
  if (typeof payload.activo !== "boolean") errors.push("activo debe ser boolean");

  return errors;
}

module.exports = validateExtra;
