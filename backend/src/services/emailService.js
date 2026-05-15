const { sendBrevoEmail } = require("../config/mailConfig");
const otpGenerator = require("otp-generator");

const MAIL_TIMEOUT_MS = 15000;

const ensureMailConfig = () => {
  if (!process.env.BREVO_API_KEY) {
    const error = new Error("Brevo API key is missing");
    error.code = "MAIL_CONFIG_MISSING";
    throw error;
  }

  if (!process.env.BREVO_API_KEY.startsWith("xkeysib-")) {
    const error = new Error("Brevo API key format looks invalid");
    error.code = "MAIL_CONFIG_INVALID";
    throw error;
  }

  if (!process.env.EMAIL_FROM) {
    const error = new Error("Email sender address is missing");
    error.code = "EMAIL_FROM_MISSING";
    throw error;
  }
};

const sendWithBrevo = async ({ email, otp }) => {
  await Promise.race([
    sendBrevoEmail({
      sender: {
        name: process.env.EMAIL_FROM_NAME || "Team Task Manager",
        email: process.env.EMAIL_FROM,
      },
      to: [{ email }],
      subject: "Your OTP Code",
      htmlContent: `<p>Your OTP of Team Task Manager : <strong>${otp}</strong></p>`,
    }),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Email send timeout")), MAIL_TIMEOUT_MS)
    ),
  ]);
};

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
  ensureMailConfig();

  const otp = generateOTP();

  try {
    await sendWithBrevo({ email, otp });

    console.log("OTP email sent with Brevo");

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
