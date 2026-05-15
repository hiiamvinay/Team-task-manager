const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { sendOTPEmail } = require("../services/emailService");
dotenv.config();

const temp_data ={}

const saltRounds = 10;

exports.signup = async (req, res) => {
  try {
    
    if (!req.body.password || !req.body.email || !req.body.name) {
        return res.status(400).json({ message: "All fields are required" });
        }
    else {
          const otp = await sendOTPEmail(req.body.email);
          if (!otp) {
            return res.status(500).json({ message: "Failed to send OTP" });
          }
          const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    
          temp_data[req.body.email] = {
          name: req.body.name,
          password: hashedPassword,
          otp: otp
            };

        res.status(200).json({ message: "OTP sent to email" });
    } } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}

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