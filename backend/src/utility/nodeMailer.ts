import dotenv from "dotenv";
import nodemailer from "nodemailer";
dotenv.config();
export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_FROM,
    pass: process.env.APP_PASSWORD,
  },
});

export const send_Mail = (mailOptions: any): Promise<void> => {
  // mailoption has some definate type, specify return type as Promise<void>
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error occurred: " + error.message);
        return reject(new Error("Email not sent successfully"));
      }
      console.log("Message sent: %s", info.messageId);
      resolve();
    });
  });
};
