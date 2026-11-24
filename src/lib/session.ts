import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import Session from "@/models/Session";
import User from "@/models/User";

const COOKIE_NAME = "session";
const SESSION_MS = 7 * 24 * 60 * 60 * 1000;
const digest = (value: string) =>
  createHash("sha256").update(value).digest("hex");

export async function createSession(userId: string) {
  await connectDB();
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_MS);
  await Session.create({ userId, tokenHash: digest(token), expiresAt });
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function getCurrentUser() {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token || !/^[a-f0-9]{64}$/i.test(token)) return null;
  await connectDB();
  const session = await Session.findOne({
    tokenHash: digest(token),
    expiresAt: { $gt: new Date() },
  }).lean();
  if (!session) return null;
  const user = await User.findOne({ _id: session.userId, isActive: true })
    .select("name email role")
    .lean();
  if (!user) return null;
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

export async function deleteCurrentSession() {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (token && /^[a-f0-9]{64}$/i.test(token)) {
    await connectDB();
    await Session.deleteOne({ tokenHash: digest(token) });
  }
  store.delete(COOKIE_NAME);
}
