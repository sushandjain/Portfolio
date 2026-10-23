import { NextResponse } from "next/server";
import { getContent, getDefaultContent } from "@/lib/server/db";

export const revalidate = 60; // ISR cache for 60 seconds

export async function GET() {
  try {
    const raw = getContent() || getDefaultContent();

    // Filter only published items for public view
    const publicContent = {
      profile: raw.profile,
      projects: (raw.projects || [])
        .filter((p) => p.published !== false)
        .sort((a, b) => a.order - b.order),
      experience: (raw.experience || [])
        .filter((e) => e.published !== false)
        .sort((a, b) => a.order - b.order),
      education: (raw.education || [])
        .filter((e) => e.published !== false)
        .sort((a, b) => a.order - b.order),
      skills: (raw.skills || [])
        .filter((s) => s.published !== false)
        .sort((a, b) => a.order - b.order),
      certificates: (raw.certificates || [])
        .filter((c) => c.published !== false)
        .sort((a, b) => a.order - b.order),
      achievements: (raw.achievements || [])
        .filter((a) => a.published !== false)
        .sort((a, b) => a.order - b.order),
      settings: raw.settings,
      lastUpdatedAt: raw.lastUpdatedAt,
    };

    const response = NextResponse.json({ success: true, content: publicContent });
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=60, stale-while-revalidate=600"
    );
    return response;
  } catch (error: any) {
    console.error("Public content GET error:", error);
    // Absolute fallback: return hardcoded default
    return NextResponse.json({ success: true, content: getDefaultContent() });
  }
}
