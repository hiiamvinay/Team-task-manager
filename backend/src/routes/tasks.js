const express = require("express");

const auth = require("../middleware/auth");
const {
  createTask,
  getProjectTasks,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

const router = express.Router();

router.post("/", auth, createTask);
router.get("/project/:projectId", auth, getProjectTasks);
router.patch("/:taskId", auth, updateTask);
router.delete("/:taskId", auth, deleteTask);

module.exports = router;
