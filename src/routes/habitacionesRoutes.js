const express = require("express");
const habitacionesController = require("../controllers/habitacionesController");
const habitacionesValidators = require("../validators/habitacionesValidators");
const validate = require("../middlewares/validate");
const { verifyAccessToken, requireRole } = require("../middlewares/auth");

const router = express.Router();

router.use(verifyAccessToken);

router.get("/", habitacionesValidators.listQuery, validate, habitacionesController.list);
router.get("/:id", habitacionesValidators.idParam, validate, habitacionesController.getById);

router.use(requireRole("admin"));

router.post("/", habitacionesValidators.create, validate, habitacionesController.create);
router.put("/:id", habitacionesValidators.idParam, habitacionesValidators.update, validate, habitacionesController.replace);
router.patch("/:id", habitacionesValidators.idParam, habitacionesValidators.update, validate, habitacionesController.patch);
router.delete("/:id", habitacionesValidators.idParam, validate, habitacionesController.remove);

module.exports = router;
