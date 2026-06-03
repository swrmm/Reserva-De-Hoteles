function isValidDate(value) {
  if (typeof value !== "string") return false;

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(value)) return false;

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function diffInNights(fechaEntrada, fechaSalida) {
  const entrada = new Date(`${fechaEntrada}T00:00:00.000Z`);
  const salida = new Date(`${fechaSalida}T00:00:00.000Z`);
  return Math.round((salida - entrada) / 86400000);
}

function isSalidaPosterior(fechaEntrada, fechaSalida) {
  if (!isValidDate(fechaEntrada) || !isValidDate(fechaSalida)) return false;
  return diffInNights(fechaEntrada, fechaSalida) > 0;
}

module.exports = {
  isValidDate,
  diffInNights,
  isSalidaPosterior
};
