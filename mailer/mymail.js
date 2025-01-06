import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: "Gmail",
  port: 465,
  secure: true,
  auth: {
    user: "jayeshsharmarplm@gmail.com", 
    pass: "yhpg pnli jafg hywn"
  },
});

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function myOPT(email) {
  if (!isValidEmail(email)) {
    console.error("Invalid email format");
    return null; 
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString(); 

  const mymail = {
    from: "jayeshsharmarplm@gmail.com", 
    to: email,
    subject: "Your OTP Code",
    html: `<p>Your OTP is: <h1 style='color: green;'>${otp}</h1></p>`,
  };

  transporter.sendMail(mymail, (err, info) => {
    if (err) {
      console.error("Error occurred while sending email: ", err);
    } else {
      console.log("Email sent: ", info.response);
    }
  });

  return otp; 
}