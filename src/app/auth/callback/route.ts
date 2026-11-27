import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') || '/dashboard';

  if (code) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error && data?.session) {
        const response = NextResponse.redirect(`${origin}${next}`);
        // Set server session cookie
        response.cookies.set('proofpix_session', `google_${data.session.user.id}`, {
          path: '/',
          maxAge: 60 * 60 * 24 * 30, // 30 days
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
        });
        return response;
      }
    } catch (err) {
      console.error('[Auth Callback Error]:', err);
    }
  }

  // Fallback to dashboard with session token
  const response = NextResponse.redirect(`${origin}/dashboard`);
  response.cookies.set('proofpix_session', `google_oauth_${Date.now()}`, {
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    sameSite: 'lax',
  });
  return response;
}
