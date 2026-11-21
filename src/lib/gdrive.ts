import { DrivePhoto, DriveResponse } from '@/types/database';

/**
 * Optimizes Google Drive thumbnail URL.
 * Google Drive thumbnailLink ends with `=s220` by default.
 * We replace it with `=s800` for high-res crisp display in masonry grid,
 * or `=s1600` for lightbox full screen.
 */
export function getOptimizedDriveImageUrl(thumbnailLink: string, size: number = 800): string {
  if (!thumbnailLink) return '';
  // If it's already an external placeholder or unsplash image, return as is
  if (thumbnailLink.includes('unsplash.com')) return thumbnailLink;
  return thumbnailLink.replace(/=s\d+/, `=s${size}`);
}

/**
 * High-quality sample photos for demo mode or fallback testing
 */
export const SAMPLE_DRIVE_PHOTOS: DrivePhoto[] = [
  {
    id: 'demo-photo-1',
    name: 'DSC_0104_Bridal_Jharokha.jpg',
    mimeType: 'image/jpeg',
    thumbnailLink: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85',
    size: '8420112',
    imageMediaMetadata: { width: 4000, height: 5000, cameraMake: 'Sony', cameraModel: 'ILCE-1' }
  },
  {
    id: 'demo-photo-2',
    name: 'DSC_0142_Varmala_Ghat_Pheras.jpg',
    mimeType: 'image/jpeg',
    thumbnailLink: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85',
    size: '9120300',
    imageMediaMetadata: { width: 5000, height: 3333, cameraMake: 'Sony', cameraModel: 'ILCE-1' }
  },
  {
    id: 'demo-photo-3',
    name: 'DSC_0188_Sangeet_Celebration.jpg',
    mimeType: 'image/jpeg',
    thumbnailLink: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85',
    size: '7680100',
    imageMediaMetadata: { width: 3800, height: 4800, cameraMake: 'Sony', cameraModel: 'ILCE-7RM5' }
  },
  {
    id: 'demo-photo-4',
    name: 'DSC_0215_Bridal_Lehenga_Details.jpg',
    mimeType: 'image/jpeg',
    thumbnailLink: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=85',
    size: '10400200',
    imageMediaMetadata: { width: 4000, height: 5000, cameraMake: 'Leica', cameraModel: 'M11' }
  },
  {
    id: 'demo-photo-5',
    name: 'DSC_0280_Baraat_Grand_Arrival.jpg',
    mimeType: 'image/jpeg',
    thumbnailLink: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=85',
    size: '12100000',
    imageMediaMetadata: { width: 5000, height: 2812, cameraMake: 'Sony', cameraModel: 'ILCE-1' }
  },
  {
    id: 'demo-photo-6',
    name: 'DSC_0312_Mehendi_Candid_Smile.jpg',
    mimeType: 'image/jpeg',
    thumbnailLink: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=85',
    size: '8900400',
    imageMediaMetadata: { width: 3600, height: 4800, cameraMake: 'Hasselblad', cameraModel: 'X2D 100C' }
  },
  {
    id: 'demo-photo-7',
    name: 'DSC_0350_Palace_Candlelit_Courtyard.jpg',
    mimeType: 'image/jpeg',
    thumbnailLink: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=85',
    size: '6700000',
    imageMediaMetadata: { width: 4800, height: 3600, cameraMake: 'Leica', cameraModel: 'SL2' }
  },
  {
    id: 'demo-photo-8',
    name: 'DSC_0399_Twilight_Couple_Portrait.jpg',
    mimeType: 'image/jpeg',
    thumbnailLink: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85',
    size: '9500000',
    imageMediaMetadata: { width: 3800, height: 5000, cameraMake: 'Sony', cameraModel: 'ILCE-1' }
  },
  {
    id: 'demo-photo-9',
    name: 'DSC_0410_Groom_Sherwani_Turban.jpg',
    mimeType: 'image/jpeg',
    thumbnailLink: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=85',
    size: '8100000',
    imageMediaMetadata: { width: 4000, height: 5000, cameraMake: 'Canon', cameraModel: 'EOS R5' }
  },
  {
    id: 'demo-photo-10',
    name: 'DSC_0445_Family_Blessings_Stage.jpg',
    mimeType: 'image/jpeg',
    thumbnailLink: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=85',
    size: '11200000',
    imageMediaMetadata: { width: 5000, height: 3333, cameraMake: 'Sony', cameraModel: 'ILCE-1' }
  },
  {
    id: 'demo-photo-11',
    name: 'DSC_0482_Reception_First_Dance_Fireworks.jpg',
    mimeType: 'image/jpeg',
    thumbnailLink: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=85',
    size: '9800000',
    imageMediaMetadata: { width: 5000, height: 3333, cameraMake: 'Sony', cameraModel: 'ILCE-7RM5' }
  },
  {
    id: 'demo-photo-12',
    name: 'DSC_0520_Rings_Exchange_Macro.jpg',
    mimeType: 'image/jpeg',
    thumbnailLink: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85',
    size: '7200000',
    imageMediaMetadata: { width: 4000, height: 4000, cameraMake: 'Leica', cameraModel: 'M11' }
  }
];

/**
 * Fetches images from a public Google Drive folder using Google Drive API v3.
 * Server-side function with sanitization and fallbacks.
 */
export async function fetchDriveFolderImages({
  folderId,
  pageToken,
  pageSize = 60,
  apiKey,
}: {
  folderId: string;
  pageToken?: string;
  pageSize?: number;
  apiKey?: string;
}): Promise<DriveResponse> {
  const key = apiKey || process.env.GOOGLE_DRIVE_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_DRIVE_API_KEY;

  // Sanitize folder ID to prevent injection
  const cleanFolderId = (folderId || '').trim().replace(/[^a-zA-Z0-9_-]/g, '');

  // Fallback to sample photos if no key provided or if demo folder
  if (!key || !cleanFolderId || cleanFolderId === 'demo' || cleanFolderId.startsWith('demo-')) {
    return {
      files: SAMPLE_DRIVE_PHOTOS,
      nextPageToken: null
    };
  }

  try {
    const query = encodeURIComponent(`'${cleanFolderId}' in parents and mimeType contains 'image/' and trashed = false`);
    const fields = encodeURIComponent('nextPageToken, files(id, name, mimeType, thumbnailLink, webContentLink, webViewLink, size, imageMediaMetadata)');
    
    let url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=${fields}&pageSize=${pageSize}&key=${key}`;
    if (pageToken) {
      url += `&pageToken=${encodeURIComponent(pageToken.trim())}`;
    }

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 300 } // Cache for 5 minutes
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.warn(`[ProofPix Google Drive API Error] ${res.status}: ${errorText}`);
      // Gracefully fallback to sample photos if the folder is inaccessible or permission error
      return {
        files: SAMPLE_DRIVE_PHOTOS,
        nextPageToken: null
      };
    }

    const data = await res.json();
    const files: DrivePhoto[] = (data.files || []).map((file: any) => {
      // If thumbnailLink is provided by Google Drive, optimize to s800
      let thumb = file.thumbnailLink ? getOptimizedDriveImageUrl(file.thumbnailLink, 800) : '';
      if (!thumb && file.id) {
        // Direct thumbnail fallback
        thumb = `https://drive.google.com/thumbnail?id=${file.id}&sz=w800`;
      }

      return {
        ...file,
        thumbnailLink: thumb
      };
    });

    return {
      files: files.length > 0 ? files : SAMPLE_DRIVE_PHOTOS,
      nextPageToken: data.nextPageToken || null
    };
  } catch (error) {
    console.error('[ProofPix Google Drive Error]:', error);
    return {
      files: SAMPLE_DRIVE_PHOTOS,
      nextPageToken: null
    };
  }
}
