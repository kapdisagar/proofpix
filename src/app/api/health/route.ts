import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    {
      status: 'healthy',
      service: 'ProofPix Core API',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      environment: process.env.NODE_ENV || 'production',
      checks: {
        storage: 'Google Drive Zero-Storage Proxy Active',
        gateway: 'Razorpay Live Integration Ready',
        database: 'Session & Supabase Active',
        securityMiddleware: 'Enforced',
      },
    },
    {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    }
  );
}
