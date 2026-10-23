import { NextRequest, NextResponse } from "next/server";
import { saveMessage } from "@/lib/server/db";
import { checkRateLimit } from "@/lib/server/rateLimit";

function sanitize(str: string): string {
  return str.replace(/</g, "&lt;").replace(/>/g, "&gt;").trim();
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
    
    // Rate limit: max 4 messages per 10 minutes per IP
    const rateCheck = checkRateLimit(`contact-ip:${ip}`, 4, 10 * 60 * 1000);
    if (!rateCheck.success) {
      return NextResponse.json(
        {
          success: false,
          error: `You've sent several messages recently. Please wait ${rateCheck.resetInSeconds} seconds before sending another.`,
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Name, email, and message are required fields." },
        { status: 400 }
      );
    }

    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (message.length < 5) {
      return NextResponse.json(
        { success: false, error: "Message is too short (minimum 5 characters)." },
        { status: 400 }
      );
    }

    const saved = saveMessage({
      name: sanitize(name).slice(0, 100),
      email: sanitize(email).slice(0, 150),
      subject: subject ? sanitize(subject).slice(0, 150) : "Portfolio Contact Inquiry",
      message: sanitize(message).slice(0, 5000),
    });

    return NextResponse.json({
      success: true,
      message: "Your message has been received! Sushan will get back to you shortly.",
      id: saved.id,
    });
  } catch (error: any) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to dispatch message. Please try again or reach out via WhatsApp/Email." },
      { status: 500 }
    );
  }
}
