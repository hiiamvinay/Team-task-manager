const Project = require("../models/project");
const Task = require("../models/task");

const getMembership = (project, userId) =>
  project.members.find((member) => {
    const memberUserId = member.user?._id ? member.user._id.toString() : member.user.toString();
    return memberUserId === userId.toString();
  });

exports.createTask = async (req, res) => {
  try {
    const { projectId, title, description, dueDate, priority, assigneeId } = req.body;

    if (!projectId || !title || !priority || !assigneeId) {
      return res
        .status(400)
        .json({ message: "Project, title, priority, and assignee are required" });
    }

    if (!["low", "medium", "high"].includes(priority)) {
      return res.status(400).json({ message: "Priority must be low, medium, or high" });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const requesterMembership = getMembership(project, req.user._id);
    if (!requesterMembership) {
      return res.status(403).json({ message: "You do not have access to this project" });
    }

    const assigneeMembership = getMembership(project, assigneeId);
    if (!assigneeMembership) {
      return res.status(400).json({ message: "Assignee must be a project member" });
    }

    const task = await Task.create({
      project: projectId,
      title,
      description,
      dueDate: dueDate || null,
      priority,
      assignee: assigneeId,
      createdBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      task: {
        id: task._id,
        projectId: task.project,
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        priority: task.priority,
        status: task.status,
        assigneeId: task.assignee,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getProjectTasks = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const requesterMembership = getMembership(project, req.user._id);
    if (!requesterMembership) {
      return res.status(403).json({ message: "You do not have access to this project" });
    }

    const tasks = await Task.find({ project: projectId })
      .populate("assignee", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      tasks: tasks.map((task) => ({
        id: task._id,
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        priority: task.priority,
        status: task.status,
        assignee: task.assignee
          ? {
              id: task.assignee._id,
              name: task.assignee.name,
              email: task.assignee.email,
            }
          : null,
      })),
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, description, dueDate, priority, status, assigneeId } = req.body;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const project = await Project.findById(task.project);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const requesterMembership = getMembership(project, req.user._id);
    if (!requesterMembership) {
      return res.status(403).json({ message: "You do not have access to this project" });
    }

    if (priority && !["low", "medium", "high"].includes(priority)) {
      return res.status(400).json({ message: "Priority must be low, medium, or high" });
    }

    if (status && !["To Do", "In Progress", "Done"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    if (assigneeId) {
      const assigneeMembership = getMembership(project, assigneeId);
      if (!assigneeMembership) {
        return res.status(400).json({ message: "Assignee must be a project member" });
      }
      task.assignee = assigneeId;
    }

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (dueDate !== undefined) task.dueDate = dueDate || null;
    if (priority !== undefined) task.priority = priority;
    if (status !== undefined) task.status = status;

    await task.save();
    await task.populate("assignee", "name email");

    return res.status(200).json({
      success: true,
      task: {
        id: task._id,
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        priority: task.priority,
        status: task.status,
        assignee: task.assignee
          ? {
              id: task.assignee._id,
              name: task.assignee.name,
              email: task.assignee.email,
            }
          : null,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};
