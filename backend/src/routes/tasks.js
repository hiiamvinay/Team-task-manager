const express = require("express");

const auth = require("../middleware/auth");
const {
  createTask,
  getProjectTasks,
  updateTask,
} = require("../controllers/taskController");

const router = express.Router();

router.post("/", auth, createTask);
router.get("/project/:projectId", auth, getProjectTasks);
router.patch("/:taskId", auth, updateTask);

module.exports = router;
