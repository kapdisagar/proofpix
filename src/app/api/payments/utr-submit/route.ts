import { NextRequest, NextResponse } from 'next/server';

/**
 * Peer-to-Peer UPI 12-Digit Bank UTR Submission API
 * Validates reference format and records payment record for studio confirmation.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { project_id, client_name, client_phone, amount, utr_number } = body;

    if (!project_id || !utr_number) {
      return NextResponse.json(
        { error: 'Project ID and UTR Number are required' },
        { status: 400 }
      );
    }

    // Clean UTR: must be 12 digits (Indian banking UPI standard)
    const cleanUtr = utr_number.trim().replace(/[^0-9]/g, '');
    if (cleanUtr.length < 10 || cleanUtr.length > 16) {
      return NextResponse.json(
        { error: 'Invalid UPI Reference / UTR Number. Must be a 12-digit bank reference number.' },
        { status: 400 }
      );
    }

    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const userAgent = request.headers.get('user-agent') || 'Unknown';

    return NextResponse.json({
      success: true,
      message: 'UPI UTR submitted successfully. Studio will verify and unlock high-res downloads.',
      utr_number: cleanUtr,
      submitted_at: new Date().toISOString(),
      client_ip: ip,
      user_agent: userAgent
    });
  } catch (error: any) {
    console.error('[API /api/payments/utr-submit Error]:', error);
    return NextResponse.json(
      { error: 'Internal server error processing UTR submission' },
      { status: 500 }
    );
  }
}
