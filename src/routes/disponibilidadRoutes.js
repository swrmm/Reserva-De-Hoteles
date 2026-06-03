const express = require("express");
const disponibilidadController = require("../controllers/disponibilidadController");
const asyncHandler = require("../middlewares/asyncHandler");

const router = express.Router();

router.get("/", asyncHandler(disponibilidadController.list));

module.exports = router;
