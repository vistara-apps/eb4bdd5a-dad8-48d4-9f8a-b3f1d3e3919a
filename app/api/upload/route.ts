import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'audio/mpeg', 'audio/wav', 'video/mp4'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 });
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File too large. Maximum size is 10MB' }, { status: 400 });
    }

    // In a real implementation, this would:
    // 1. Upload to cloud storage (IPFS, Arweave, AWS S3, etc.)
    // 2. Generate a permanent URL
    // 3. Return the URL for use in annotations

    // For now, simulate successful upload
    const fileId = `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const fileUrl = `https://storage.example.com/${fileId}`;

    const uploadResult = {
      fileId,
      url: fileUrl,
      type: file.type,
      size: file.size,
      filename: file.name,
      uploadedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      file: uploadResult,
      message: 'File uploaded successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get('fileId');

    if (!fileId) {
      return NextResponse.json({ error: 'File ID is required' }, { status: 400 });
    }

    // In a real implementation, this would fetch file metadata from storage
    // For now, return mock data
    const fileInfo = {
      fileId,
      url: `https://storage.example.com/${fileId}`,
      type: 'image/jpeg',
      size: 1024000,
      uploadedAt: new Date().toISOString(),
    };

    return NextResponse.json({ file: fileInfo });
  } catch (error) {
    console.error('Error fetching file:', error);
    return NextResponse.json({ error: 'Failed to fetch file' }, { status: 500 });
  }
}

