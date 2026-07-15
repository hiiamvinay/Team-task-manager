const express = require("express");

const authController = require("../controllers/userControllers")
const { getMe } = require("../controllers/meController");
const { getUsers } = require("../controllers/userListController");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/otp", authController.otp);
router.post("/forgot-password", authController.requestPasswordResetOtp);
router.post("/reset-password", authController.resetPassword);
router.get("/me", auth, getMe);
router.get("/", auth, getUsers);

module.exports = router;
