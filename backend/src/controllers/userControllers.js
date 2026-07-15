const User = require("../models/user");
const PendingSignup = require("../models/pendingSignup");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { sendOTPEmail } = require("../services/emailService");
dotenv.config();

const saltRounds = 10;
const OTP_EXPIRY_MINUTES = 10;

const getAuthEmailErrorMessage = (error) => {
  if (error.message === "Email send timeout") {
    return "OTP email timed out. Check deployed mail settings and try again.";
  }

  if (error.code === "MAIL_CONFIG_MISSING") {
    return "BREVO_API_KEY is missing in backend deployment variables.";
  }

  if (error.code === "MAIL_CONFIG_INVALID") {
    return "BREVO_API_KEY format is invalid. Use the Brevo API key that starts with xkeysib-.";
  }

  if (error.code === "EMAIL_FROM_MISSING") {
    return "EMAIL_FROM is missing for Brevo email delivery.";
  }

  if (error.code === "EAUTH") {
    return "Email provider authentication failed. Check your Brevo API key.";
  }

  if (error.code === "ESOCKET" || error.code === "ECONNECTION" || error.code === "ETIMEDOUT") {
    return "Could not connect to the email server from deployment.";
  }

  if (error.code === "ENOTFOUND") {
    return "Email server host could not be resolved from deployment.";
  }

  if (error.code === "BREVO_API_ERROR") {
    return error.message || "Brevo email request failed.";
  }

  if (error.name === "MongooseServerSelectionError") {
    return "Database connection failed in deployment.";
  }

  return error.message || "Failed to process signup request";
};

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();

    if (!password || !normalizedEmail || !name) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const otp = await sendOTPEmail(normalizedEmail);
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await PendingSignup.findOneAndUpdate(
      { email: normalizedEmail },
      {
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        otp,
        expiresAt: new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000),
      },
      {
        upsert: true,
        returnDocument: "after",
        setDefaultsOnInsert: true,
      }
    );

    return res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    console.error("Signup error:", error);
    const message = getAuthEmailErrorMessage(error);

    return res.status(500).json({ message });
  }
};

exports.otp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedEmail || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const pendingSignup = await PendingSignup.findOne({ email: normalizedEmail });

    if (!pendingSignup) {
      return res.status(400).json({ message: "No signup in progress for this email" });
    }

    if (pendingSignup.expiresAt < new Date()) {
      await PendingSignup.deleteOne({ _id: pendingSignup._id });
      return res.status(400).json({ message: "OTP has expired. Please sign up again." });
    }

    if (pendingSignup.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      await PendingSignup.deleteOne({ _id: pendingSignup._id });
      return res.status(409).json({ message: "User already exists" });
    }

    const newUser = new User({
      name: pendingSignup.name,
      email: normalizedEmail,
      password: pendingSignup.password
    });

    await newUser.save();

    await PendingSignup.deleteOne({ _id: pendingSignup._id });

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: normalizedEmail });
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

exports.requestPasswordResetOtp = async (req, res) => {
  try {
    const normalizedEmail = req.body.email?.trim().toLowerCase();

    if (!normalizedEmail) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({ message: "No account found with this email" });
    }

    const otp = await sendOTPEmail(normalizedEmail, {
      subject: "Reset your password",
      htmlContent: (generatedOtp) =>
        `<p>Use this OTP to reset your Team Task Manager password: <strong>${generatedOtp}</strong></p>`,
    });

    user.resetPasswordOtp = otp;
    user.resetPasswordExpiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
    await user.save();

    return res.status(200).json({ message: "Password reset OTP sent to email" });
  } catch (error) {
    console.error("Password reset OTP error:", error);
    const message = getAuthEmailErrorMessage(error);

    return res.status(500).json({ message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedEmail || !otp || !password) {
      return res.status(400).json({ message: "Email, OTP, and new password are required" });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({ message: "No account found with this email" });
    }

    if (!user.resetPasswordOtp || !user.resetPasswordExpiresAt) {
      return res.status(400).json({ message: "No password reset request found for this email" });
    }

    if (user.resetPasswordExpiresAt < new Date()) {
      user.resetPasswordOtp = null;
      user.resetPasswordExpiresAt = null;
      await user.save();
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    if (user.resetPasswordOtp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.password = await bcrypt.hash(password, saltRounds);
    user.resetPasswordOtp = null;
    user.resetPasswordExpiresAt = null;
    await user.save();

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}
