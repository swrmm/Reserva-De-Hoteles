const express = require("express");
const dashboardController = require("../controllers/dashboardController");
const { verifyAccessToken } = require("../middlewares/auth");

const router = express.Router();

router.use(verifyAccessToken);

router.get("/resumen", dashboardController.resumen);

module.exports = router;
