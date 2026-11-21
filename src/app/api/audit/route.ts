import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, studio_name, action, metadata } = body;

    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';
    const userAgent = request.headers.get('user-agent') || 'Browser Client';

    const logRecord = {
      id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      email: email || 'anonymous',
      studio_name: studio_name || null,
      action: action || 'LOGIN',
      ip_address: ip,
      user_agent: userAgent,
      metadata: metadata || {},
      created_at: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      log: logRecord
    });
  } catch (error: any) {
    console.error('[API /api/audit Error]:', error);
    return NextResponse.json(
      { error: 'Failed to record audit log' },
      { status: 500 }
    );
  }
}
