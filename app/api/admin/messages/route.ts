import { NextRequest, NextResponse } from "next/server";
import { getMessages, updateMessage, deleteMessage } from "@/lib/server/db";
import { verifyCurrentSession } from "@/lib/server/auth";

export async function GET() {
  try {
    const session = await verifyCurrentSession();
    if (!session.authenticated) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    const messages = getMessages();
    return NextResponse.json({ success: true, messages });
  } catch (error: any) {
    console.error("Messages GET error:", error);
    return NextResponse.json({ success: false, error: "Failed to load messages." }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await verifyCurrentSession();
    if (!session.authenticated) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    const { id, read, starred } = await request.json();
    if (!id) {
      return NextResponse.json({ success: false, error: "Message ID is required." }, { status: 400 });
    }

    const updates: Record<string, boolean> = {};
    if (typeof read === "boolean") updates.read = read;
    if (typeof starred === "boolean") updates.starred = starred;

    const updated = updateMessage(id, updates);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Message not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: updated });
  } catch (error: any) {
    console.error("Messages PATCH error:", error);
    return NextResponse.json({ success: false, error: "Failed to update message." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await verifyCurrentSession();
    if (!session.authenticated) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "Message ID is required." }, { status: 400 });
    }

    const deleted = deleteMessage(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: "Message not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Message deleted successfully." });
  } catch (error: any) {
    console.error("Messages DELETE error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete message." }, { status: 500 });
  }
}
