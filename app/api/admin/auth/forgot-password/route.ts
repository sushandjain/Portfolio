import { NextRequest, NextResponse } from "next/server";
import { generatePasswordResetToken } from "@/lib/server/auth";
import { checkRateLimit } from "@/lib/server/rateLimit";

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
    
    // Rate limit password reset attempts
    const rateCheck = checkRateLimit(`reset-ip:${ip}`, 3, 15 * 60 * 1000);
    if (!rateCheck.success) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many password reset requests. Please wait ${rateCheck.resetInSeconds} seconds.`,
        },
        { status: 429 }
      );
    }

    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required." }, { status: 400 });
    }

    const result = await generatePasswordResetToken(email);

    return NextResponse.json({
      success: true,
      message: result.message,
      // For developer/local convenience and quick testing:
      resetToken: result.token,
      resetUrl: result.token ? `/admin/reset-password?token=${result.token}` : undefined,
    });
  } catch (error: any) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ success: false, error: "Failed to process reset request." }, { status: 500 });
  }
}
