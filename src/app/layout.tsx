import type { Metadata, Viewport } from 'next';
import './globals.css';

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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-[#FAFAFA] text-[#111827] antialiased selection:bg-[#E11D48] selection:text-white">
        {children}
      </body>
    </html>
  );
}
