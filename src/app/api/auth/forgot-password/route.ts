import { NextRequest, NextResponse } from "next/server";
import { forgotSchema } from "@/lib/validation";
import { requestPasswordReset } from "@/services/auth.service";
export const runtime = "nodejs";
export async function POST(req: NextRequest) {
  try {
    const parsed = forgotSchema.safeParse(await req.json());
    if (!parsed.success)
      return NextResponse.json(
        { message: "Enter a valid email address" },
        { status: 400 },
      );
    await requestPasswordReset(parsed.data.email);
    return NextResponse.json({
      message: "If the account exists, a reset email will be sent.",
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "Unable to process request" },
      { status: 500 },
    );
  }
}
