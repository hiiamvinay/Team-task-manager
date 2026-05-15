const express = require("express");

const auth = require("../middleware/auth");
const {
  createProject,
  getProjects,
  addMember,
  removeMember,
  deleteProject,
} = require("../controllers/projectController");

const router = express.Router();

router.post("/", auth, createProject);
router.get("/", auth, getProjects);
router.post("/:projectId/members", auth, addMember);
router.delete("/:projectId/members/:memberId", auth, removeMember);
router.delete("/:projectId", auth, deleteProject);

module.exports = router;
