const User = require("../models/user");

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}, "name email").sort({ name: 1 });

    return res.status(200).json({
      success: true,
      users: users.map((user) => ({
        id: user._id,
        name: user.name,
        email: user.email,
      })),
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};
