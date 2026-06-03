const express = require("express");
const habitacionesController = require("../controllers/habitacionesController");
const asyncHandler = require("../middlewares/asyncHandler");

const router = express.Router();

router.post("/", asyncHandler(habitacionesController.create));
router.get("/", asyncHandler(habitacionesController.list));
router.get("/:id", asyncHandler(habitacionesController.getById));
router.put("/:id", asyncHandler(habitacionesController.update));
router.delete("/:id", asyncHandler(habitacionesController.remove));

module.exports = router;
