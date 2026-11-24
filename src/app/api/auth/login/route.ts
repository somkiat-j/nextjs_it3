import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/lib/validation";
import { loginUser } from "@/services/auth.service";
export const runtime = "nodejs";
export async function POST(req: NextRequest) {
  try {
    const parsed = loginSchema.safeParse(await req.json());
    if (!parsed.success)
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 400 },
      );
    const user = await loginUser(parsed.data.email, parsed.data.password);
    return NextResponse.json({ message: "Login successful", user });
  } catch (e: any) {
    if (e?.message === "INVALID_CREDENTIALS")
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 },
      );
    console.error(e);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
