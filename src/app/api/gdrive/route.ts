import { NextRequest, NextResponse } from 'next/server';
import { fetchDriveFolderImages } from '@/lib/gdrive';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const folderId = searchParams.get('folderId');
  const pageToken = searchParams.get('pageToken') || undefined;
  const pageSizeParam = searchParams.get('pageSize');
  const pageSize = pageSizeParam ? parseInt(pageSizeParam, 10) : 50;

  if (!folderId) {
    return NextResponse.json(
      { error: 'Missing folderId parameter' },
      { status: 400 }
    );
  }

  try {
    const data = await fetchDriveFolderImages({
      folderId,
      pageToken,
      pageSize,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('[API /api/gdrive Error]:', error);
    return NextResponse.json(
      { error: 'Failed to fetch images from Google Drive' },
      { status: 500 }
    );
  }
}
