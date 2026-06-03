const express = require("express");
const dashboardController = require("../controllers/dashboardController");
const asyncHandler = require("../middlewares/asyncHandler");

const router = express.Router();

router.get("/resumen", asyncHandler(dashboardController.resumen));

module.exports = router;
