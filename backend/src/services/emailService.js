const transporter = require("../config/mailConfig");
const otpGenerator = require("otp-generator");

// function to generate OTP
const generateOTP = () => {
  const otp = otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    digits: true,
    specialChars: false,
  });

  return otp;
};

// function to send OTP email
const sendOTPEmail = async (email) => {

  const otp = generateOTP();

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP of Team Task Manager : ${otp}`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("OTP Email sent");

    return otp;   // return OTP so controller can verify
  } catch (error) {
    console.log("Email error:", error);
  }
};

module.exports = {
  sendOTPEmail,
  generateOTP
};