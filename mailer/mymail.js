import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: "Gmail",
  port: 465,
  secure: true,
  auth: {
    user: "jayeshsharmarplm@gmail.com", // Use environment variables in production
    pass: "yhpg pnli jafg hywn",
  },
});

function myOPT(email){
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); 
    const mymail = {
        from: "jayeshsharmarplm@gmail.com",
        to: `${email}`,
        subject: "Checking nodemailer",
        html: `<p>Your otp is = <h1 style='color: green;'>${otp}</h1></p>`,
    };
    transporter.sendMail(mymail, (err, info) => {
        if (err) {
          console.error("Error occurred: ", err);
        } else {
          console.log("Email sent: ", info.response);
        }
      });
}

myOPT("aryangwale8827@gmail.com")