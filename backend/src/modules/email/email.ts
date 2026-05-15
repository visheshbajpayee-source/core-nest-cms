import { Request, Response } from "express";
import { send_Mail } from "../../utility/nodeMailer";
import Handlebars from "handlebars";
import fs from "fs";
import path from "path";

export const sendMail = async (req: Request, res: Response) => {
  try {
    const { to, subject, text } = req.body;

    const templatePath = path.join(__dirname, "templates", "welcome.hbs");
    const source = fs.readFileSync(templatePath, "utf-8");
    const template = Handlebars.compile(source);
    const htmlToSend = template({ name: "John Doe" });

    const mailOptions = {
      from: `"startappss system" <${process.env.MAIL_FROM}>`,
      to,
      subject,
      text,
      html: htmlToSend,
    };

    await send_Mail(mailOptions); // now properly awaited
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Email not sent successfully" });
  }
};
