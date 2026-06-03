const express = require("express");
const authRoutes = require("./authRoutes");
const habitacionesRoutes = require("./habitacionesRoutes");
const reservasRoutes = require("./reservasRoutes");
const disponibilidadRoutes = require("./disponibilidadRoutes");
const extrasRoutes = require("./extrasRoutes");
const dashboardRoutes = require("./dashboardRoutes");
const authenticate = require("../middlewares/authenticate");

const router = express.Router();

router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API funcionando correctamente"
  });
});

router.use("/auth", authRoutes);
router.use("/habitaciones", authenticate, habitacionesRoutes);
router.use("/reservas", authenticate, reservasRoutes);
router.use("/disponibilidad", authenticate, disponibilidadRoutes);
router.use("/extras", authenticate, extrasRoutes);
router.use("/dashboard", authenticate, dashboardRoutes);

module.exports = router;
