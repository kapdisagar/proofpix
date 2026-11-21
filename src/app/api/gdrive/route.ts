import { NextRequest, NextResponse } from 'next/server';
import { fetchDriveFolderImages } from '@/lib/gdrive';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const rawFolderId = searchParams.get('folderId');
  const slug = searchParams.get('slug') || '';
  const pageToken = searchParams.get('pageToken') || undefined;
  const pageSizeParam = searchParams.get('pageSize');
  const pageSize = pageSizeParam ? Math.min(Math.max(parseInt(pageSizeParam, 10) || 50, 10), 100) : 50;

  if (!rawFolderId) {
    return NextResponse.json(
      { error: 'Missing folderId parameter' },
      { status: 400 }
    );
  }

  // Strict sanitization: alphanumeric, dash, underscore only (prevent SSRF/traversal)
  const folderId = rawFolderId.trim().replace(/[^a-zA-Z0-9_-]/g, '');
  if (!folderId || folderId.length < 3 || folderId.length > 70) {
    return NextResponse.json(
      { error: 'Invalid folderId parameter format. Expected 15-65 alphanumeric characters.' },
      { status: 400 }
    );
  }

  try {
    const data = await fetchDriveFolderImages({
      folderId,
      pageToken,
      pageSize,
    });

    // Transform links to route through ProofPix secure server-side image proxy
    const proxiedFiles = (data.files || []).map((file) => ({
      ...file,
      thumbnailLink: `/api/gdrive/image?fileId=${encodeURIComponent(file.id)}&slug=${encodeURIComponent(slug)}&w=800`,
      webContentLink: `/api/gdrive/image?fileId=${encodeURIComponent(file.id)}&slug=${encodeURIComponent(slug)}&w=1600&download=true`,
      fullViewLink: `/api/gdrive/image?fileId=${encodeURIComponent(file.id)}&slug=${encodeURIComponent(slug)}&w=1600`,
    }));

    const response = NextResponse.json({
      files: proxiedFiles,
      nextPageToken: data.nextPageToken || null,
      totalCount: proxiedFiles.length,
    });

    // Cache at edge for 5 minutes
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
