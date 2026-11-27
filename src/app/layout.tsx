import type { Metadata, Viewport } from 'next';
import './globals.css';
import WhatsAppSupportWidget from '@/components/WhatsAppSupportWidget';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: 'ProofPix — The Zero-Storage Client Gallery for Indian Photographers',
  description:
    'Turn any public Google Drive folder link into a sleek, mobile-first client photo selection & payment-locked gallery—with zero server storage costs. Built for Indian Wedding & Portrait Photographers.',
  keywords: [
    'Pixieset alternative',
    'Indian photographer gallery',
    'Google Drive photo proofing',
    'photo selection app',
    'UPI payment lock gallery',
    'client proofing tool'
  ],
  metadataBase: new URL('https://proofpix-six.vercel.app'),
  openGraph: {
    title: 'ProofPix — Zero-Storage Client Galleries for Photographers',
    description: 'Sync Google Drive folders directly into branded client proofing galleries with UPI & Razorpay locks.',
    url: 'https://proofpix-six.vercel.app',
    siteName: 'ProofPix India',
    locale: 'en_IN',
    type: 'website',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://proofpix-six.vercel.app/#organization',
      name: 'ProofPix Technologies',
      url: 'https://proofpix-six.vercel.app',
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+91-98765-43210',
        contactType: 'customer service',
        email: 'support@proofpix.in',
        areaServed: 'IN',
      },
    },
    {
      '@type': 'SoftwareApplication',
      name: 'ProofPix',
      operatingSystem: 'All Modern Browsers',
      applicationCategory: 'BusinessApplication',
      offers: {
        '@type': 'Offer',
        price: '299',
        priceCurrency: 'INR',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        ratingCount: '348',
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#FAFAFA] text-[#111827] antialiased selection:bg-[#E11D48] selection:text-white">
        {children}
        <WhatsAppSupportWidget />
      </body>
    </html>
  );
}
