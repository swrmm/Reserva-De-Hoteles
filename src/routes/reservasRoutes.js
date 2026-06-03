const express = require("express");
const reservasController = require("../controllers/reservasController");
const reservasValidators = require("../validators/reservasValidators");
const validate = require("../middlewares/validate");
const { verifyAccessToken } = require("../middlewares/auth");

const router = express.Router();

router.use(verifyAccessToken);

router.get("/", reservasController.list);
router.get("/:id", reservasValidators.idParam, validate, reservasController.getById);
router.post("/", reservasValidators.create, validate, reservasController.create);
router.put("/:id", reservasValidators.idParam, reservasValidators.update, validate, reservasController.replace);
router.patch("/:id", reservasValidators.idParam, reservasValidators.update, validate, reservasController.patch);
router.patch("/:id/cancelar", reservasValidators.idParam, validate, reservasController.cancel);
router.delete("/:id", reservasValidators.idParam, validate, reservasController.remove);

module.exports = router;
