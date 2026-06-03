const { isEmail, isEmptyString } = require("./common");
const { isValidDate, isSalidaPosterior } = require("../utils/dateUtils");

const ESTADOS_RESERVA = ["pendiente", "confirmada", "cancelada", "finalizada"];

function validateReserva(payload) {
  const errors = [];

  if ("id" in payload) errors.push("El campo id no debe enviarse en el body");
  if (!Number.isInteger(payload.habitacion_id) || payload.habitacion_id <= 0) {
    errors.push("habitacion_id debe ser un entero positivo");
  }
  if (isEmptyString(payload.nombre_huesped)) errors.push("nombre_huesped es obligatorio");
  if (!isEmail(payload.email_huesped)) errors.push("email_huesped debe tener un formato valido");
  if (!isValidDate(payload.fecha_entrada)) errors.push("fecha_entrada debe tener formato YYYY-MM-DD");
  if (!isValidDate(payload.fecha_salida)) errors.push("fecha_salida debe tener formato YYYY-MM-DD");
  if (
    isValidDate(payload.fecha_entrada) &&
    isValidDate(payload.fecha_salida) &&
    !isSalidaPosterior(payload.fecha_entrada, payload.fecha_salida)
  ) {
    errors.push("fecha_salida debe ser posterior a fecha_entrada");
  }
  if (!ESTADOS_RESERVA.includes(payload.estado)) {
    errors.push("estado debe ser pendiente, confirmada, cancelada o finalizada");
  }
  if (
    payload.extras_total !== undefined &&
    (typeof payload.extras_total !== "number" || payload.extras_total < 0)
  ) {
    errors.push("extras_total debe ser un numero mayor o igual a 0");
  }
  if (payload.observaciones && typeof payload.observaciones !== "string") {
    errors.push("observaciones debe ser texto");
  }
  if (payload.origen && typeof payload.origen !== "string") {
    errors.push("origen debe ser texto");
  }

  return errors;
}

function validateDisponibilidad(query) {
  const errors = [];

  if (!isValidDate(query.desde)) errors.push("desde debe tener formato YYYY-MM-DD");
  if (!isValidDate(query.hasta)) errors.push("hasta debe tener formato YYYY-MM-DD");
  if (
    isValidDate(query.desde) &&
    isValidDate(query.hasta) &&
    !isSalidaPosterior(query.desde, query.hasta)
  ) {
    errors.push("hasta debe ser posterior a desde");
  }

  return errors;
}

module.exports = {
  validateReserva,
  validateDisponibilidad,
  ESTADOS_RESERVA
};
