import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { connectDB } from "@/lib/mongodb";
import { hashPassword, verifyPassword } from "@/lib/password";
import { createSession } from "@/lib/session";
import User from "@/models/User";
import Session from "@/models/Session";
import PasswordResetToken from "@/models/PasswordResetToken";
import { sendResetPasswordEmail } from "@/lib/email";

const digest = (v: string) => createHash("sha256").update(v).digest("hex");
export async function registerUser(input: {
  name: string;
  email: string;
  password: string;
}) {
  await connectDB();
  const email = input.email.toLowerCase().trim();
  const passwordHash = await hashPassword(input.password);
  try {
    return await User.create({
      name: input.name.trim(),
      email,
      passwordHash,
      role: "user",
    });
  } catch (error: any) {
    if (error?.code === 11000) throw new Error("EMAIL_EXISTS");
    throw error;
  }
}

export async function loginUser(emailInput: string, password: string) {
  await connectDB();
  const user = await User.findOne({
    email: emailInput.toLowerCase().trim(),
    isActive: true,
  }).select("+passwordHash");
  if (!user || !(await verifyPassword(password, user.passwordHash)))
    throw new Error("INVALID_CREDENTIALS");
  await createSession(user.id);
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

export async function requestPasswordReset(emailInput: string) {
  await connectDB();
  const user = await User.findOne({
    email: emailInput.toLowerCase().trim(),
    isActive: true,
  });
  if (!user) return;
  const token = randomBytes(32).toString("hex");
  const tokenHash = digest(token);
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
  await PasswordResetToken.deleteMany({ userId: user._id });
  await PasswordResetToken.create({ userId: user._id, tokenHash, expiresAt });
  const base = process.env.APP_URL;
  if (!base) throw new Error("APP_URL is not configured");
  await sendResetPasswordEmail(
    user.email,
    `${base.replace(/\/$/, "")}/reset-password?token=${encodeURIComponent(token)}`,
  );
}

export async function resetUserPassword(token: string, password: string) {
  await connectDB();
  const tokenHash = digest(token);
  const reset = await PasswordResetToken.findOne({
    tokenHash,
    expiresAt: { $gt: new Date() },
  });
  if (!reset) throw new Error("INVALID_RESET_TOKEN");
  const passwordHash = await hashPassword(password);
  // Consume token first to prevent concurrent reuse. For strict atomicity, run this workflow in a MongoDB transaction on a replica set.
  const consumed = await PasswordResetToken.findOneAndDelete({
    _id: reset._id,
    expiresAt: { $gt: new Date() },
  });
  if (!consumed) throw new Error("INVALID_RESET_TOKEN");
  await User.updateOne({ _id: reset.userId }, { $set: { passwordHash } });
  await PasswordResetToken.deleteMany({ userId: reset.userId });
  await Session.deleteMany({ userId: reset.userId });
}
