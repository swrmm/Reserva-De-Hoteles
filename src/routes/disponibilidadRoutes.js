const express = require("express");
const disponibilidadController = require("../controllers/disponibilidadController");
const reservasValidators = require("../validators/reservasValidators");
const validate = require("../middlewares/validate");
const { verifyAccessToken } = require("../middlewares/auth");

const router = express.Router();

router.use(verifyAccessToken);

router.get("/", reservasValidators.disponibilidad, validate, disponibilidadController.list);

module.exports = router;
