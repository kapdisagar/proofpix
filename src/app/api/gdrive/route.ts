import { NextRequest, NextResponse } from 'next/server';
import { fetchDriveFolderImages } from '@/lib/gdrive';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const rawFolderId = searchParams.get('folderId');
  const pageToken = searchParams.get('pageToken') || undefined;
  const pageSizeParam = searchParams.get('pageSize');
  const pageSize = pageSizeParam ? Math.min(Math.max(parseInt(pageSizeParam, 10) || 50, 10), 100) : 50;

  if (!rawFolderId) {
    return NextResponse.json(
      { error: 'Missing folderId parameter' },
      { status: 400 }
    );
  }

  // Sanitize folderId to alphanumeric, dash and underscore
  const folderId = rawFolderId.trim().replace(/[^a-zA-Z0-9_-]/g, '');
  if (!folderId) {
    return NextResponse.json(
      { error: 'Invalid folderId parameter format' },
      { status: 400 }
    );
  }

  try {
    const data = await fetchDriveFolderImages({
      folderId,
      pageToken,
      pageSize,
    });

    const response = NextResponse.json(data);
    // Cache at edge for 5 minutes to prevent rate limit exhaustion
    response.headers.set(
      'Cache-Control',
      'public, s-maxage=300, stale-while-revalidate=600'
    );
    return response;
  } catch (error) {
    console.error('[API /api/gdrive Error]:', error);
    return NextResponse.json(
      { error: 'Failed to fetch images from Google Drive' },
      { status: 500 }
    );
  }
}
