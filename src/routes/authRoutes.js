const express = require("express");
const authController = require("../controllers/authController");
const asyncHandler = require("../middlewares/asyncHandler");

const router = express.Router();

router.post("/register", asyncHandler(authController.register));
router.post("/login", asyncHandler(authController.login));
router.post("/forgot-password", asyncHandler(authController.forgotPassword));
router.post("/reset-password", asyncHandler(authController.resetPassword));

module.exports = router;
