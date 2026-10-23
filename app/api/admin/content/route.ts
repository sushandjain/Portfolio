import { NextRequest, NextResponse } from "next/server";
import { getContent, saveContent, StoredContent } from "@/lib/server/db";
import { verifyCurrentSession } from "@/lib/server/auth";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    const session = await verifyCurrentSession();
    if (!session.authenticated) {
      return NextResponse.json({ success: false, error: "Unauthorized access." }, { status: 401 });
    }

    const content = getContent();
    return NextResponse.json({ success: true, content });
  } catch (error: any) {
    console.error("Content GET error:", error);
    return NextResponse.json({ success: false, error: "Failed to load content." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await verifyCurrentSession();
    if (!session.authenticated) {
      return NextResponse.json({ success: false, error: "Unauthorized. Please log in." }, { status: 401 });
    }

    const body = await request.json();
    const { section, data } = body;

    if (!section || !data) {
      return NextResponse.json(
        { success: false, error: "Section and data payload are required." },
        { status: 400 }
      );
    }

    const currentContent = getContent();

    // Verify section name
    const validSections = [
      "profile",
      "projects",
      "experience",
      "education",
      "skills",
      "certificates",
      "achievements",
      "settings",
    ];

    if (!validSections.includes(section)) {
      return NextResponse.json(
        { success: false, error: `Invalid content section: ${section}` },
        { status: 400 }
      );
    }

    // Update section in database
    const updated = saveContent({
      [section]: data,
    });

    // Revalidate public routes for immediate reflection
    try {
      revalidatePath("/");
    } catch {}

    return NextResponse.json({
      success: true,
      message: `${section.charAt(0).toUpperCase() + section.slice(1)} updated successfully.`,
      content: updated,
    });
  } catch (error: any) {
    console.error("Content POST error:", error);
    return NextResponse.json({ success: false, error: "Failed to save content." }, { status: 500 });
  }
}
