import { NextResponse } from "next/server";
import { deleteCurrentSession } from "@/lib/session";
export const runtime = "nodejs";
export async function POST() {
  try {
    await deleteCurrentSession();
    return NextResponse.json({ message: "Logout successful" });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: "Logout failed" }, { status: 500 });
  }
}
