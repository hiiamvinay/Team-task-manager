const express = require("express");
const { getStartupStatus } = require("../controllers/systemController");

const router = express.Router();

router.get("/startup", getStartupStatus);

module.exports = router;
