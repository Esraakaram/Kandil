import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') || formData.get('image') || formData.get('upload');
    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'لم يتم اختيار ملف صالح' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const originalName = file.name || 'image.jpg';
    const ext = path.extname(originalName) || '.jpg';
    const safeBase = path.basename(originalName, ext).replace(/[^a-zA-Z0-9-_]/g, '');
    const fileName = `${Date.now()}-${safeBase || 'img'}${ext}`;

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    let savedToDisk = false;

    // In Vercel serverless functions, files written to disk are ephemeral and not served by Vercel CDN/static routing.
    // Therefore, on Vercel we directly use the optimized Base64 Data URL so it is safely stored in the database.
    const isVercel = !!process.env.VERCEL;

    if (!isVercel) {
      try {
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }
        const filePath = path.join(uploadsDir, fileName);
        await fs.promises.writeFile(filePath, buffer);
        savedToDisk = true;
      } catch (fsErr) {
        console.warn('Filesystem write failed, falling back to data URL:', fsErr.message);
      }
    }

    const fileUrl = savedToDisk
      ? `/uploads/${fileName}`
      : `data:${file.type || 'image/jpeg'};base64,${buffer.toString('base64')}`;

    return NextResponse.json({
      success: true,
      url: fileUrl,
      fileName,
      savedToDisk
    });
  } catch (err) {
    console.error('Upload Error:', err);
    return NextResponse.json({ error: err.message || 'حدث خطأ أثناء رفع الصورة' }, { status: 500 });
  }
}
