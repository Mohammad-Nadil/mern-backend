import nodemailer from "nodemailer";
import { MAIL_USER, MAIL_PASS } from "../constants.js";
import { ApiError } from "../utils/ApiError.js";

// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASS,
  },
});

export const sendMail = async ({ to, subject, text, html }) => {
  try {
    const info = await transporter.sendMail({
      from: '" Notes App " <${MAIL_USER}>',
      to,
      subject,
      text,
      html,
    });

    console.log("Message sent:", info.messageId);
  } catch (error) {
    throw new ApiError(500, error.message);
  }
};


