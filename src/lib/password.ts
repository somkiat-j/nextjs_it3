import "server-only";
import bcrypt from "bcryptjs";

// bcrypt processes at most 72 UTF-8 bytes. Reject longer values instead of silently truncating.
export function assertPasswordLength(password: string) {
  if (Buffer.byteLength(password, "utf8") > 72)
    throw new Error(
      "Password must not exceed 72 UTF-8 bytes when using bcrypt",
    );
}
export async function hashPassword(password: string) {
  assertPasswordLength(password);
  return bcrypt.hash(password, 12);
}
export async function verifyPassword(password: string, hash: string) {
  assertPasswordLength(password);
  return bcrypt.compare(password, hash);
}
