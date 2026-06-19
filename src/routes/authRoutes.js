const express = require("express");
const authController = require("../controllers/authController");
const authValidators = require("../validators/authValidators");
const validate = require("../middlewares/validate");
const { verifyAccessToken } = require("../middlewares/auth");

const router = express.Router();

router.post("/register", authValidators.register, validate, authController.register);
router.post("/login", authValidators.login, validate, authController.login);
router.post("/forgot-password", authValidators.forgotPassword, validate, authController.forgotPassword);
router.post("/reset-password", authValidators.resetPassword, validate, authController.resetPassword);
router.post("/refresh", authValidators.refresh, validate, authController.refresh);
router.post("/logout", verifyAccessToken, authValidators.logout, validate, authController.logout);
router.get("/me", verifyAccessToken, authController.me);
router.put("/me", verifyAccessToken, authValidators.updateProfile, validate, authController.updateMe);
router.get("/sesiones", verifyAccessToken, authController.listSesiones);

module.exports = router;
