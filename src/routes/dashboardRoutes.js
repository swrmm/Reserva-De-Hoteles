const express = require("express");
const dashboardController = require("../controllers/dashboardController");
const { verifyAccessToken, requireRole } = require("../middlewares/auth");

const router = express.Router();

router.use(verifyAccessToken);
router.use(requireRole("admin"));

router.get("/resumen", dashboardController.resumen);

module.exports = router;
