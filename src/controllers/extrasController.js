const extrasModel = require("../models/extrasModel");
const createHttpError = require("../utils/httpError");
const validateExtra = require("../validators/extrasValidator");

async function create(req, res) {
  const errors = validateExtra(req.body);
  if (errors.length) throw createHttpError(400, "Datos invalidos para crear extra", "VALIDATION_ERROR", errors);

  const created = await extrasModel.createExtra(req.body);
  return res.status(201).json({
    success: true,
    message: "Extra creado correctamente",
    data: created
  });
}

async function list(req, res) {
  const extras = await extrasModel.findAllExtras();
  return res.status(200).json({
    success: true,
    data: extras
  });
}

module.exports = {
  create,
  list
};
