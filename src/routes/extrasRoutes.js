const express = require("express");
const extrasController = require("../controllers/extrasController");
const extrasValidators = require("../validators/extrasValidators");
const validate = require("../middlewares/validate");
const { verifyAccessToken } = require("../middlewares/auth");

const router = express.Router();

router.use(verifyAccessToken);

router.get("/", extrasController.list);
router.post("/", extrasValidators.create, validate, extrasController.create);

module.exports = router;
