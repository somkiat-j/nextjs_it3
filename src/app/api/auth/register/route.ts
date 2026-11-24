import { NextRequest, NextResponse } from "next/server";
import { registerSchema } from "@/lib/validation";
import { registerUser } from "@/services/auth.service";
export const runtime = "nodejs";
export async function POST(req: NextRequest) {
  try {
    const parsed = registerSchema.safeParse(await req.json());
    if (!parsed.success)
      return NextResponse.json(
        {
          message: "Invalid registration data",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    const user = await registerUser(parsed.data);
    return NextResponse.json(
      {
        message: "Registration successful",
        user: { id: user.id, name: user.name, email: user.email },
      },
      { status: 201 },
    );
  } catch (e: any) {
    if (e?.message === "EMAIL_EXISTS")
      return NextResponse.json(
        { message: "Unable to register with these details" },
        { status: 409 },
      );
    console.error(e);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
