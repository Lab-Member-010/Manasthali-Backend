import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// Configure the transporter
const transporter = nodemailer.createTransport({
  service:process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: true,
  auth: {
    user: process.env.MAIL_USER, 
    pass: process.env.MAIL_PASS,
  },
});

// Utility to validate email format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Reusable function to send emails
export async function sendEmail({ to, subject, html }) {
  if (!isValidEmail(to)) {
    console.error("Invalid email format");
    throw new Error("Invalid email format");
  }

  const mailOptions = {
    from: process.env.MAIL_USER,
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", info.response);
    return true;
  } catch (err) {
    console.error("Error occurred while sending email: ", err);
    throw new Error("Failed to send email");
  }
}

// Function to generate and send OTP
export function myOPT(email) {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const htmlContent = `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Manasthali - OTP for Your Request</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f5f5f5;
    }
    .email-container {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      padding: 20px;
      background-color: #6a1b9a; /* Purple background */
      color: white;
      border-radius: 8px 8px 0 0;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .content {
      padding: 20px;
      font-size: 16px;
      line-height: 1.5;
      color: #333333;
    }
    .content p {
      margin-bottom: 20px;
    }
    .otp-display {
      font-size: 32px;
      color: #6a1b9a;
      font-weight: bold;
      text-align: center;
      margin: 20px 0;
    }
    .reset-button {
      display: block;
      width: 100%;
      max-width: 200px;
      margin: 20px auto;
      padding: 10px;
      background-color: #6a1b9a; /* Purple button */
      color: white;
      text-align: center;
      font-size: 18px;
      font-weight: bold;
      text-decoration: none;
      border-radius: 5px;
      transition: background-color 0.3s ease;
    }
    .reset-button:hover {
      background-color: #8e24aa; /* Darker purple on hover */
    }
    .footer {
      text-align: center;
      font-size: 12px;
      color: #888888;
      margin-top: 30px;
    }
    .footer p {
      margin: 5px 0;
    }
    .footer a {
      color: #6a1b9a;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Header -->
    <div class="header">
      <h1>One-Time Password (OTP) for Your Request</h1>
    </div>

    <!-- Email Content -->
    <div class="content">
      <p>Hi there,</p>
      <p>We received a request to verify your identity for your account on Manasthali. Use the OTP below to complete the process:</p>
      
      <!-- OTP Display -->
      <div class="otp-display">
        ${otp}  <!-- Replace ${otp} with actual OTP in backend -->
      </div>

      <p>This OTP is valid for 10 minutes. Enter it on the verification page to proceed.</p>

      <p>If you did not make this request, you can safely ignore this email.</p>

      <p>For any issues or concerns, feel free to contact our support team.</p>

    <!-- Footer -->
    <div class="footer">
      <p>Thank you for being part of Manasthali.</p>
      <p>Manasthali, Your Community, Your Connection.</p>
      <p>© 2025 Manasthali. All rights reserved.</p>
      <p>If you have any questions, feel free to <a href="mailto:${process.env.MAIL_USER}">contact support</a>.</p>
    </div>
  </div>
</body>
</html>

  `;

  sendEmail({ to: email, subject: "Your OTP Code", html: htmlContent }).catch((err) =>
    console.error("Error in sending OTP email:", err)
  );

  return otp;
}
