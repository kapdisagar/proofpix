import { NextRequest, NextResponse } from 'next/server';
import { SAMPLE_DRIVE_PHOTOS } from '@/lib/gdrive';
import { INITIAL_PROJECTS } from '@/lib/mockStore';

// In-memory cache for fetched images to prevent Google Drive API rate-limiting
const imageCache = new Map<string, { buffer: Buffer; contentType: string; timestamp: number }>();
const CACHE_TTL_MS = 1000 * 60 * 60 * 2; // 2 hours

/**
 * Escapes characters for safe inclusion in SVG text.
 */
function escapeSvgText(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Wraps an image in an SVG vector container with an indelible repeating watermark pattern.
 * When served as image/svg+xml, the watermark is part of the image file itself,
 * making DOM/CSS inspection bypass impossible.
 */
function createWatermarkedSvg(
  imageBase64: string,
  contentType: string,
  watermarkText: string,
  width: number = 1200,
  height: number = 800
): string {
  const safeText = escapeSvgText(watermarkText || 'PROOFPIX PREVIEW · PROOF COPY');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${width} ${height}" width="100%" height="100%">
  <defs>
    <!-- Repeating diagonal watermark pattern -->
    <pattern id="wm-pattern" width="400" height="220" patternUnits="userSpaceOnUse" patternTransform="rotate(-28)">
      <!-- Drop shadow text -->
      <text x="22" y="102" fill="rgba(0,0,0,0.55)" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="24" letter-spacing="4" text-anchor="middle">
        ${safeText}
      </text>
      <!-- Crisp foreground text -->
      <text x="20" y="100" fill="rgba(255,255,255,0.85)" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="24" letter-spacing="4" text-anchor="middle">
        ${safeText}
      </text>
    </pattern>
  </defs>

  <!-- Base Photo Layer -->
  <image href="data:${contentType};base64,${imageBase64}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid meet" />

  <!-- Diagonal Repeating Watermark Grid -->
  <rect width="100%" height="100%" fill="url(#wm-pattern)" pointer-events="none" />

  <!-- Center Official Studio Seal -->
  <g transform="translate(${Math.round(width / 2)}, ${Math.round(height / 2)})">
    <rect x="-180" y="-30" width="360" height="60" rx="12" fill="rgba(0,0,0,0.6)" stroke="rgba(255,255,255,0.4)" stroke-width="1.5" />
    <text x="0" y="8" fill="#FFFFFF" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="bold" letter-spacing="3" text-anchor="middle">
      ${safeText}
    </text>
    <text x="0" y="22" fill="rgba(255,255,255,0.7)" font-family="Arial, Helvetica, sans-serif" font-size="9" font-weight="normal" letter-spacing="1.5" text-anchor="middle">
      PROOF COPY · DO NOT REPRODUCE
    </text>
  </g>

  <!-- Bottom ProofPix Verification Footer Banner -->
  <rect x="0" y="${height - 32}" width="100%" height="32" fill="rgba(0,0,0,0.75)" />
  <text x="${Math.round(width / 2)}" y="${height - 12}" fill="rgba(255,255,255,0.8)" font-family="Arial, Helvetica, sans-serif" font-size="11" font-weight="600" letter-spacing="1" text-anchor="middle">
    PROTECTED BY PROOFPIX · FULL RESOLUTION UNLOCKS UPON FINAL STUDIO PAYMENT
  </text>
</svg>`;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const fileId = searchParams.get('fileId');
  const slug = searchParams.get('slug') || '';
  const widthParam = searchParams.get('w');
  const isDownload = searchParams.get('download') === 'true';

  if (!fileId) {
    return NextResponse.json({ error: 'Missing fileId parameter' }, { status: 400 });
  }

  // Find project to check payment lock & watermark text
  const project = INITIAL_PROJECTS.find((p) => p.slug === slug);
  const isPaid = project ? project.is_paid : false;
  const watermarkText = project?.watermark_text || 'The Royal Frames Studio';

  // Server-side Payment Lock Enforcement:
  // If download is requested and project is unpaid, refuse with 403 Forbidden
  if (isDownload && !isPaid) {
    return NextResponse.json(
      {
        error: 'High-resolution download locked.',
        message: 'Studio balance payment is pending. Please complete payment to unlock original downloads.',
      },
      { status: 403 }
    );
  }

  const targetWidth = widthParam ? Math.min(Math.max(parseInt(widthParam, 10) || 800, 100), 2000) : 800;

  try {
    let imageBuffer: Buffer | null = null;
    let contentType = 'image/jpeg';

    // Check memory cache
    const cacheKey = `${fileId}_w${targetWidth}`;
    const cached = imageCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      imageBuffer = cached.buffer;
      contentType = cached.contentType;
    } else {
      // Check if sample demo photo
      const sampleMatch = SAMPLE_DRIVE_PHOTOS.find((p) => p.id === fileId);

      if (sampleMatch && sampleMatch.thumbnailLink) {
        const fetchRes = await fetch(sampleMatch.thumbnailLink, {
          headers: { 'User-Agent': 'ProofPix-Proxy/2.0' },
        });
        if (fetchRes.ok) {
          const arrayBuf = await fetchRes.arrayBuffer();
          imageBuffer = Buffer.from(arrayBuf);
          contentType = fetchRes.headers.get('content-type') || 'image/jpeg';
        }
      } else {
        // Real Google Drive file:
        // Try Google's high-speed public CDN first, then thumbnail endpoint
        const candidateUrls = [
          `https://lh3.googleusercontent.com/d/${fileId}=w${targetWidth}`,
          `https://drive.google.com/thumbnail?id=${fileId}&sz=w${targetWidth}`,
          `https://drive.google.com/uc?export=view&id=${fileId}`,
        ];

        for (const url of candidateUrls) {
          try {
            const driveRes = await fetch(url, {
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
              },
            });
            if (driveRes.ok) {
              const arrayBuf = await driveRes.arrayBuffer();
              if (arrayBuf.byteLength > 1000) {
                imageBuffer = Buffer.from(arrayBuf);
                contentType = driveRes.headers.get('content-type') || 'image/jpeg';
                break;
              }
            }
          } catch {
            // Try next candidate
          }
        }
      }

      // If still not retrieved, fallback to first sample photo
      if (!imageBuffer && SAMPLE_DRIVE_PHOTOS[0]?.thumbnailLink) {
        const fallbackRes = await fetch(SAMPLE_DRIVE_PHOTOS[0].thumbnailLink);
        if (fallbackRes.ok) {
          const arrayBuf = await fallbackRes.arrayBuffer();
          imageBuffer = Buffer.from(arrayBuf);
          contentType = fallbackRes.headers.get('content-type') || 'image/jpeg';
        }
      }

      if (imageBuffer) {
        imageCache.set(cacheKey, {
          buffer: imageBuffer,
          contentType,
          timestamp: Date.now(),
        });
      }
    }

    if (!imageBuffer) {
      return NextResponse.json({ error: 'Failed to fetch image from storage' }, { status: 502 });
    }

    // WATERMARK LOGIC:
    // If unpaid, generate indelible server-side watermarked SVG image
    if (!isPaid) {
      const base64Data = imageBuffer.toString('base64');
      const svg = createWatermarkedSvg(base64Data, contentType, watermarkText, targetWidth, Math.round((targetWidth * 4) / 5));

      return new NextResponse(svg, {
        status: 200,
        headers: {
          'Content-Type': 'image/svg+xml; charset=utf-8',
          'Cache-Control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400',
          'X-ProofPix-Watermarked': 'server-side-indelible',
        },
      });
    }

    // If paid, return the pristine original image binary
    const headers: Record<string, string> = {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400',
      'X-ProofPix-Status': 'clean-unlocked',
    };

    if (isDownload) {
      headers['Content-Disposition'] = `attachment; filename="${fileId}.jpg"`;
    }

    return new NextResponse(new Uint8Array(imageBuffer), {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('[ProofPix Image Proxy Error]:', error);
    return NextResponse.json({ error: 'Internal Image Proxy Error' }, { status: 500 });
  }
}
