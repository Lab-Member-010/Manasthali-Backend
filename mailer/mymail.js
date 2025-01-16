import nodemailer from "nodemailer";

// Configure the transporter
const transporter = nodemailer.createTransport({
  service: "Gmail",
  port: 465,
  secure: true,
  auth: {
    user: "contactmanasthali@gmail.com", 
    pass: "vmbx dezq txjm iblc",
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
    from: "contactmanasthali@gmail.com",
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
    <p>Your OTP is:</p>
    <h1 style='color: green;'>${otp}</h1>
  `;

  sendEmail({ to: email, subject: "Your OTP Code", html: htmlContent }).catch((err) =>
    console.error("Error in sending OTP email:", err)
  );

  return otp;
}
