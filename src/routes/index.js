const express = require("express");
const authRoutes = require("./authRoutes");
const habitacionesRoutes = require("./habitacionesRoutes");
const reservasRoutes = require("./reservasRoutes");
const disponibilidadRoutes = require("./disponibilidadRoutes");
const extrasRoutes = require("./extrasRoutes");
const dashboardRoutes = require("./dashboardRoutes");

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Bienvenido a Reserva de Hoteles API",
    version: "1.0.0"
  });
});

router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API funcionando correctamente"
  });
});

router.use("/auth", authRoutes);
router.use("/habitaciones", habitacionesRoutes);
router.use("/reservas", reservasRoutes);
router.use("/disponibilidad", disponibilidadRoutes);
router.use("/extras", extrasRoutes);
router.use("/dashboard", dashboardRoutes);

module.exports = router;
