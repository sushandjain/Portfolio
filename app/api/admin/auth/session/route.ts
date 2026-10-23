import { NextResponse } from "next/server";
import { verifyCurrentSession } from "@/lib/server/auth";

export async function GET() {
  try {
    const session = await verifyCurrentSession();
    if (!session.authenticated) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
    return NextResponse.json({
      authenticated: true,
      email: session.email,
    });
  } catch (error: any) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
