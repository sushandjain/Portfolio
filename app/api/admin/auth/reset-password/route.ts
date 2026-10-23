import { NextRequest, NextResponse } from "next/server";
import { resetPasswordWithToken, updateAdminPassword, verifyCurrentSession } from "@/lib/server/auth";

export async function POST(request: NextRequest) {
  try {
    const { token, newPassword, currentPassword, isDirectChange } = await request.json();

    if (isDirectChange) {
      // Authenticated admin changing password from dashboard settings
      const session = await verifyCurrentSession();
      if (!session.authenticated) {
        return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
      }

      if (!currentPassword || !newPassword) {
        return NextResponse.json(
          { success: false, error: "Current password and new password are required." },
          { status: 400 }
        );
      }

      const result = await updateAdminPassword(currentPassword, newPassword);
      if (!result.success) {
        return NextResponse.json({ success: false, error: result.message }, { status: 400 });
      }
      return NextResponse.json({ success: true, message: result.message });
    }

    // Reset via token from forgot-password flow
    if (!token || !newPassword) {
      return NextResponse.json(
        { success: false, error: "Reset token and new password are required." },
        { status: 400 }
      );
    }

    const result = await resetPasswordWithToken(token, newPassword);
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: result.message });
  } catch (error: any) {
    console.error("Reset password error:", error);
    return NextResponse.json({ success: false, error: "Failed to reset password." }, { status: 500 });
  }
}
