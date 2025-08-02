// backend/services/emailService.js
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendVerificationEmail = async (to, verificationToken) => {
  const url = `http://localhost:5173/verify-email/${verificationToken}`; // Frontend URL for verification

  try {
    await transporter.sendMail({
      from: "univents.events@gmail.com",
      to,
      subject: "Email Verification",
      html: `<p>Click <a href="${url}">here</a> to verify your email address.</p>`,
    });
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Email not sent");
  }
};
