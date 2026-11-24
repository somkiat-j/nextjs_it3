import { z } from "zod";

const password = z
  .string()
  .min(12)
  .refine(
    (v) => Buffer.byteLength(v, "utf8") <= 72,
    "Password is too long for bcrypt",
  );
export const registerSchema = z
  .object({
    name: z.string().trim().min(2).max(100),
    email: z.string().trim().email().max(254),
    password,
    confirmPassword: z.string(),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export const loginSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z
    .string()
    .min(1)
    .refine((v) => Buffer.byteLength(v, "utf8") <= 72, "Invalid password"),
});
export const forgotSchema = z.object({
  email: z.string().trim().email().max(254),
});
export const resetSchema = z
  .object({
    token: z.string().regex(/^[a-f0-9]{64}$/i),
    password,
    confirmPassword: z.string(),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
