function isEmptyString(value) {
  return typeof value !== "string" || value.trim() === "";
}

function isEmail(value) {
  return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isPositiveNumber(value) {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

module.exports = {
  isEmptyString,
  isEmail,
  isPositiveNumber
};
