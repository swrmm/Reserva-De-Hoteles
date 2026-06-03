const express = require("express");
const reservasController = require("../controllers/reservasController");
const asyncHandler = require("../middlewares/asyncHandler");

const router = express.Router();

router.post("/", asyncHandler(reservasController.create));
router.get("/", asyncHandler(reservasController.list));
router.get("/:id", asyncHandler(reservasController.getById));
router.put("/:id", asyncHandler(reservasController.update));
router.patch("/:id/cancelar", asyncHandler(reservasController.cancel));
router.delete("/:id", asyncHandler(reservasController.remove));

module.exports = router;
