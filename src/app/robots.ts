import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/terms', '/privacy', '/refund-policy', '/contact', '/login'],
        disallow: ['/gallery/', '/dashboard/', '/api/'],
      },
    ],
    sitemap: 'https://proofpix-six.vercel.app/sitemap.xml',
  };
}
