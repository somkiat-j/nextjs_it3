import { NextRequest, NextResponse } from "next/server";
import { resetSchema } from "@/lib/validation";
import { resetUserPassword } from "@/services/auth.service";
export const runtime = "nodejs";
export async function POST(req: NextRequest) {
  try {
    const parsed = resetSchema.safeParse(await req.json());
    if (!parsed.success)
      return NextResponse.json(
        {
          message: "Invalid reset data",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    await resetUserPassword(parsed.data.token, parsed.data.password);
    return NextResponse.json({
      message: "Password reset successful. Please log in again.",
    });
  } catch (e: any) {
    if (e?.message === "INVALID_RESET_TOKEN")
      return NextResponse.json(
        { message: "Invalid or expired reset link" },
        { status: 400 },
      );
    console.error(e);
    return NextResponse.json(
      { message: "Unable to reset password" },
      { status: 500 },
    );
  }
}
