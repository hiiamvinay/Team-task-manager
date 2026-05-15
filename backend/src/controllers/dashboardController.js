const Project = require("../models/project");
const Task = require("../models/task");

exports.getDashboardMetrics = async (req, res) => {
  try {
    const projects = await Project.find({ "members.user": req.user._id }).select("_id");
    const projectIds = projects.map((project) => project._id);

    const tasks = await Task.find({ project: { $in: projectIds } }).select("status dueDate");

    const tasksByStatus = {
      "To Do": 0,
      "In Progress": 0,
      Done: 0,
    };

    let overdueTasks = 0;
    const now = new Date();

    tasks.forEach((task) => {
      if (tasksByStatus[task.status] !== undefined) {
        tasksByStatus[task.status] += 1;
      }

      if (task.dueDate && task.dueDate < now && task.status !== "Done") {
        overdueTasks += 1;
      }
    });

    return res.status(200).json({
      success: true,
      metrics: {
        totalTasks: tasks.length,
        tasksByStatus,
        overdueTasks,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};
