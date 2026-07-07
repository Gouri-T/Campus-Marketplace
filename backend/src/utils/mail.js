import { google } from "googleapis";

const sendMail = async ({ to, subject, html, text }) => {
  // Validate input
  if (!to || !subject || (!html && !text)) {
    throw new Error("Missing required email fields");
  }

  // Validate environment variables
  const requiredEnv = [
    "GMAIL_CLIENT_ID",
    "GMAIL_CLIENT_SECRET",
    "GMAIL_REFRESH_TOKEN",
    "GMAIL_EMAIL",
  ];

  for (const key of requiredEnv) {
    if (!process.env[key]) {
      throw new Error(`Missing environment variable: ${key}`);
    }
  }

  console.log(`📨 [Mailer] Sending email to: ${to}`);

  const oauth2Client = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.GMAIL_REFRESH_TOKEN,
  });

  const gmail = google.gmail({
    version: "v1",
    auth: oauth2Client,
  });

  const emailLines = [
    `From: "IIT Ropar Marketplace" <${process.env.GMAIL_EMAIL}>`,
    `To: ${to}`,
    `Subject: ${subject}`,
    "MIME-Version: 1.0",
    "Content-Type: text/html; charset=utf-8",
    "",
    html || text,
  ];

  const rawEmail = emailLines.join("\n");

  const encodedEmail = Buffer.from(rawEmail)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  try {
    const result = await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: encodedEmail,
      },
    });

    console.log(`✅ Email sent successfully (ID: ${result.data.id})`);

    return result;
  } catch (err) {
    console.error("❌ Gmail API Error:", err.message);

    if (err.response?.data) {
      console.error("Details:", err.response.data);
    }

    throw new Error("Failed to send email");
  }
};

export default sendMail;