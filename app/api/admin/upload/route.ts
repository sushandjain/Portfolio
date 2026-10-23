import { NextRequest, NextResponse } from "next/server";
import { verifyCurrentSession } from "@/lib/server/auth";
import fs from "fs";
import path from "path";
import sharp from "sharp";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

// Allowed MIME types
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
const ALLOWED_DOCUMENT_TYPES = ["application/pdf"];

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_PDF_SIZE = 12 * 1024 * 1024; // 12 MB

export async function POST(request: NextRequest) {
  try {
    const session = await verifyCurrentSession();
    if (!session.authenticated) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    // Ensure uploads directory exists
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const uploadCategory = (formData.get("category") as string) || "general"; // 'resume' | 'image' | 'certificate'

    if (!file) {
      return NextResponse.json({ success: false, error: "No file was uploaded." }, { status: 400 });
    }

    const mimeType = file.type.toLowerCase();
    const isImage = ALLOWED_IMAGE_TYPES.includes(mimeType);
    const isPdf = ALLOWED_DOCUMENT_TYPES.includes(mimeType);

    if (!isImage && !isPdf) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid file type. Only JPG, PNG, WebP images and PDF documents are permitted.",
        },
        { status: 400 }
      );
    }

    // Check size limit
    if (isImage && file.size > MAX_IMAGE_SIZE) {
      return NextResponse.json(
        { success: false, error: "Image size exceeds maximum limit of 5MB." },
        { status: 400 }
      );
    }
    if (isPdf && file.size > MAX_PDF_SIZE) {
      return NextResponse.json(
        { success: false, error: "PDF size exceeds maximum limit of 12MB." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const timestamp = Date.now();
    const safeBaseName = file.name
      .toLowerCase()
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-z0-9_-]/g, "_")
      .slice(0, 40);

    let finalFileName: string;
    let finalBuffer: Buffer;
    let finalMimeType: string;

    if (isImage) {
      // Compress and convert to high-efficiency WebP using sharp
      finalFileName = `${safeBaseName}_${timestamp}.webp`;
      finalMimeType = "image/webp";

      try {
        const image = sharp(buffer);
        const metadata = await image.metadata();

        let pipeline = image.rotate(); // auto-rotate based on EXIF
        if (metadata.width && metadata.width > 2000) {
          pipeline = pipeline.resize({ width: 2000, withoutEnlargement: true });
        }

        finalBuffer = await pipeline
          .webp({ quality: 82, effort: 4 })
          .toBuffer();
      } catch (sharpError) {
        console.warn("Sharp optimization failed, using original buffer:", sharpError);
        finalBuffer = buffer;
        const ext = path.extname(file.name) || ".jpg";
        finalFileName = `${safeBaseName}_${timestamp}${ext}`;
        finalMimeType = mimeType;
      }
    } else {
      // PDF handling
      finalFileName = `${safeBaseName}_${timestamp}.pdf`;
      finalMimeType = "application/pdf";
      finalBuffer = buffer;
    }

    const destinationPath = path.join(UPLOAD_DIR, finalFileName);
    fs.writeFileSync(destinationPath, finalBuffer);

    const publicUrl = `/uploads/${finalFileName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: finalFileName,
      originalName: file.name,
      size: finalBuffer.length,
      mimeType: finalMimeType,
      category: uploadCategory,
    });
  } catch (error: any) {
    console.error("Upload handler error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to upload and process file." },
      { status: 500 }
    );
  }
}
