import type { Metadata } from 'next';
import { INITIAL_PROJECTS } from '@/lib/mockStore';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const slug = params?.slug || '';
  const project = INITIAL_PROJECTS.find((p) => p.slug === slug);

  const eventName = project?.event_name || 'Wedding & Portrait Collection';
  const clientName = project?.client_name || 'Client Gallery';
  const studioName = project?.watermark_text || 'The Royal Frames Studio';

  const title = `${eventName} · Private Client Gallery`;
  const description = `Interactive photo proofing and selection gallery for ${clientName}. Studio: ${studioName}. Powered by ProofPix Zero-Storage Architecture.`;
  const previewImage = `https://proofpix-six.vercel.app/api/gdrive/image?fileId=demo-photo-1&slug=${slug}&w=1200`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      siteName: 'ProofPix',
      url: `https://proofpix-six.vercel.app/gallery/${slug}`,
      type: 'website',
      images: [
        {
          url: previewImage,
          width: 1200,
          height: 800,
          alt: eventName,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [previewImage],
    },
  };
}

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
