const https = require("https");

const BREVO_API_HOST = "api.brevo.com";
const BREVO_API_PATH = "/v3/smtp/email";

const maskKey = (key) => {
  if (!key) {
    return "missing";
  }

  if (key.length <= 10) {
    return `${key.slice(0, 2)}***`;
  }

  return `${key.slice(0, 6)}...${key.slice(-4)}`;
};

const sendBrevoEmail = (payload) =>
  new Promise((resolve, reject) => {
    const apiKey = process.env.BREVO_API_KEY;

    if (!apiKey) {
      const error = new Error("Brevo API key is missing");
      error.code = "MAIL_CONFIG_MISSING";
      reject(error);
      return;
    }

    const requestBody = JSON.stringify(payload);

    const req = https.request(
      {
        hostname: BREVO_API_HOST,
        path: BREVO_API_PATH,
        method: "POST",
        headers: {
          "api-key": apiKey,
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(requestBody),
        },
      },
      (res) => {
        let responseBody = "";

        res.on("data", (chunk) => {
          responseBody += chunk;
        });

        res.on("end", () => {
          let parsedBody = {};

          if (responseBody.length > 0) {
            try {
              parsedBody = JSON.parse(responseBody);
            } catch (parseError) {
              parsedBody = {};
            }
          }

          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsedBody);
            return;
          }

          const errorMessage =
            parsedBody?.message || `Brevo email request failed with status ${res.statusCode}`;
          const error = new Error(errorMessage);
          error.code = "BREVO_API_ERROR";
          error.statusCode = res.statusCode;
          error.details = parsedBody;

          console.error("Brevo API error", {
            statusCode: res.statusCode,
            message: errorMessage,
            keyPreview: maskKey(apiKey),
            senderEmail: payload?.sender?.email || "missing",
          });

          reject(error);
        });
      }
    );

    req.on("error", reject);
    req.write(requestBody);
    req.end();
  });

module.exports = {
  sendBrevoEmail,
};
