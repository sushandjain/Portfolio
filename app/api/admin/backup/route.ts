import { NextRequest, NextResponse } from "next/server";
import { getContent, saveContent, StoredContent } from "@/lib/server/db";
import { verifyCurrentSession } from "@/lib/server/auth";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    const session = await verifyCurrentSession();
    if (!session.authenticated) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    const content = getContent();
    const jsonString = JSON.stringify(content, null, 2);

    return new Response(jsonString, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="portfolio_backup_${new Date().toISOString().split("T")[0]}.json"`,
      },
    });
  } catch (error: any) {
    console.error("Backup export error:", error);
    return NextResponse.json({ success: false, error: "Failed to export backup." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await verifyCurrentSession();
    if (!session.authenticated) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    const imported = (await request.json()) as StoredContent;

    // Validate minimum required structure
    if (!imported || !imported.profile || !Array.isArray(imported.projects)) {
      return NextResponse.json(
        { success: false, error: "Invalid backup format. Missing profile or projects data." },
        { status: 400 }
      );
    }

    const updated = saveContent(imported);
    try {
      revalidatePath("/");
    } catch {}

    return NextResponse.json({
      success: true,
      message: "Portfolio data successfully restored from backup!",
      content: updated,
    });
  } catch (error: any) {
    console.error("Backup import error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to import JSON data. Please verify the file structure." },
      { status: 500 }
    );
  }
}
