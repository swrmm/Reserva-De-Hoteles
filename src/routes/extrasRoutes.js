const express = require("express");
const extrasController = require("../controllers/extrasController");
const asyncHandler = require("../middlewares/asyncHandler");

const router = express.Router();

router.post("/", asyncHandler(extrasController.create));
router.get("/", asyncHandler(extrasController.list));

module.exports = router;
