const { isEmail, isEmptyString } = require("./common");

function validateRegister(payload) {
  const errors = [];

  if (isEmptyString(payload.nombre)) errors.push("nombre es obligatorio");
  if (!isEmail(payload.email)) errors.push("email debe tener un formato valido");
  if (typeof payload.password !== "string" || payload.password.length < 6) {
    errors.push("password debe tener al menos 6 caracteres");
  }

  if (payload.rol && !["admin", "recepcionista"].includes(payload.rol)) {
    errors.push("rol debe ser admin o recepcionista");
  }

  return errors;
}

function validateLogin(payload) {
  const errors = [];

  if (!isEmail(payload.email)) errors.push("email debe tener un formato valido");
  if (isEmptyString(payload.password)) errors.push("password es obligatorio");

  return errors;
}

function validateForgotPassword(payload) {
  const errors = [];
  if (!isEmail(payload.email)) errors.push("email debe tener un formato valido");
  return errors;
}

function validateResetPassword(payload) {
  const errors = [];

  if (isEmptyString(payload.token)) errors.push("token es obligatorio");
  if (typeof payload.password !== "string" || payload.password.length < 6) {
    errors.push("password debe tener al menos 6 caracteres");
  }

  return errors;
}

module.exports = {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword
};
