const transporter = require("../config/mailConfig");
const otpGenerator = require("otp-generator");

const MAIL_TIMEOUT_MS = 15000;

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
    await Promise.race([
      transporter.sendMail(mailOptions),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Email send timeout")), MAIL_TIMEOUT_MS)
      ),
    ]);
    console.log("OTP Email sent");

    return otp;   // return OTP so controller can verify
  } catch (error) {
    console.log("Email error:", error);
    throw error;
  }
};

module.exports = {
  sendOTPEmail,
  generateOTP
};
