import "server-only";
import nodemailer from "nodemailer";

export async function sendResetPasswordEmail(email: string, resetUrl: string) {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  const from = process.env.SMTP_FROM;
  if (!host || !user || !pass || !from)
    throw new Error("SMTP configuration is incomplete");
  const port = Number(process.env.SMTP_PORT || 587);
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
  await transporter.sendMail({
    from,
    to: email,
    subject: "Reset your password",
    text: `Use this link to reset your password: ${resetUrl}`,
    html: `<p>You requested a password reset.</p><p><a href="${resetUrl}">Reset password</a></p><p>This link expires in 15 minutes. If you did not request this, ignore this email.</p>`,
  });
}
