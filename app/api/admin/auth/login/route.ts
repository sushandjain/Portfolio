import { NextRequest, NextResponse } from "next/server";
import { authenticateAdmin, createSessionToken, setSessionCookie } from "@/lib/server/auth";
import { checkRateLimit } from "@/lib/server/rateLimit";

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
    
    // Check IP rate limit (max 5 failed login attempts in 15 minutes)
    const rateCheck = checkRateLimit(`login-ip:${ip}`, 7, 15 * 60 * 1000);
    if (!rateCheck.success) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many login attempts from this device. Please wait ${rateCheck.resetInSeconds} seconds before trying again.`,
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required." },
        { status: 400 }
      );
    }

    const result = await authenticateAdmin(email, password);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.message || "Invalid credentials.",
          isLocked: result.isLocked,
          lockUntilMinutes: result.lockUntilMinutes,
        },
        { status: result.isLocked ? 423 : 401 }
      );
    }

    // Generate JWT token and set secure HTTP-only cookie
    const token = await createSessionToken(email.toLowerCase().trim());
    await setSessionCookie(token);

    return NextResponse.json({
      success: true,
      message: "Authentication successful.",
      email: email.toLowerCase().trim(),
    });
  } catch (error: any) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected server error occurred during login." },
      { status: 500 }
    );
  }
}
