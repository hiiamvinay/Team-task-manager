const Project = require("../models/project");
const User = require("../models/user");

const getMembership = (project, userId) =>
  project.members.find((member) => {
    const memberUserId = member.user?._id ? member.user._id.toString() : member.user.toString();
    return memberUserId === userId.toString();
  });

exports.createProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Project name is required" });
    }

    const project = await Project.create({
      name,
      description,
      createdBy: req.user._id,
      members: [
        {
          user: req.user._id,
          role: "Admin",
        },
      ],
    });

    return res.status(201).json({
      success: true,
      project: {
        id: project._id,
        name: project.name,
        description: project.description,
        createdBy: project.createdBy,
      },
      membership: {
        role: "Admin",
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ "members.user": req.user._id })
      .populate("members.user", "name email")
      .lean();

    return res.status(200).json({
      success: true,
      projects: projects.map((project) => {
        const membership = project.members.find(
          (member) => member.user?._id?.toString() === req.user._id.toString()
        );

        return {
          id: project._id,
          name: project.name,
          description: project.description,
          role: membership?.role || "Member",
          members: project.members.map((member) => ({
            id: member.user?._id,
            name: member.user?.name,
            email: member.user?.email,
            role: member.role,
          })),
        };
      }),
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

exports.addMember = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { email, role = "Member" } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Member email is required" });
    }

    if (!["Admin", "Member"].includes(role)) {
      return res.status(400).json({ message: "Role must be Admin or Member" });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const requesterMembership = getMembership(project, req.user._id);
    if (!requesterMembership || requesterMembership.role !== "Admin") {
      return res.status(403).json({ message: "Only Admin can manage members" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingMembership = getMembership(project, user._id);
    if (existingMembership) {
      existingMembership.role = role;
    } else {
      project.members.push({ user: user._id, role });
    }

    await project.save();

    return res.status(200).json({
      success: true,
      message: "Member added successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

exports.removeMember = async (req, res) => {
  try {
    const { projectId, memberId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const requesterMembership = getMembership(project, req.user._id);
    if (!requesterMembership || requesterMembership.role !== "Admin") {
      return res.status(403).json({ message: "Only Admin can manage members" });
    }

    if (req.user._id.toString() === memberId) {
      return res.status(400).json({ message: "Admin cannot remove themselves" });
    }

    const originalCount = project.members.length;
    project.members = project.members.filter(
      (member) => member.user.toString() !== memberId
    );

    if (project.members.length === originalCount) {
      return res.status(404).json({ message: "Member not found in project" });
    }

    await project.save();

    return res.status(200).json({
      success: true,
      message: "Member removed successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const requesterMembership = getMembership(project, req.user._id);
    if (!requesterMembership || requesterMembership.role !== "Admin") {
      return res.status(403).json({ message: "Only Admin can delete projects" });
    }

    await Project.findByIdAndDelete(projectId);

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};
