const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { sendOTPEmail } = require("../services/emailService");
dotenv.config();

const temp_data ={}

const saltRounds = 10;

const getSignupErrorMessage = (error) => {
  if (error.message === "Email send timeout") {
    return "OTP email timed out. Check deployed mail settings and try again.";
  }

  if (error.code === "MAIL_CONFIG_MISSING") {
    return "GMAIL_USER or GMAIL_PASSWORD is missing in backend deployment variables.";
  }

  if (error.code === "EAUTH") {
    return "Email login failed. Check Gmail address and app password in deployment variables.";
  }

  if (error.code === "ESOCKET" || error.code === "ECONNECTION" || error.code === "ETIMEDOUT") {
    return "Could not connect to the email server from deployment.";
  }

  if (error.code === "ENOTFOUND") {
    return "Email server host could not be resolved from deployment.";
  }

  if (error.name === "MongooseServerSelectionError") {
    return "Database connection failed in deployment.";
  }

  return error.message || "Failed to process signup request";
};

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!password || !email || !name) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const otp = await sendOTPEmail(email);
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    temp_data[email] = {
      name,
      password: hashedPassword,
      otp,
    };

    return res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    console.error("Signup error:", error);
    const message = getSignupErrorMessage(error);

    return res.status(500).json({ message });
  }
};

exports.otp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }
    if (!temp_data[email]) {
      return res.status(400).json({ message: "No signup in progress for this email" });
    }
    if (temp_data[email].otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    // Create user
    const newUser = new User({
      name: temp_data[email].name,
      email: email,
      password: temp_data[email].password
    });
    await newUser.save();
    // Clean up temp data
    delete temp_data[email];
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create and return JWT
    const payload = { userId: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}
