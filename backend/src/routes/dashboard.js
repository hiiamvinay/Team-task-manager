const express = require("express");

const auth = require("../middleware/auth");
const { getDashboardMetrics } = require("../controllers/dashboardController");

const router = express.Router();

router.get("/", auth, getDashboardMetrics);

module.exports = router;
