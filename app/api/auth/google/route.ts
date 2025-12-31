import { NextRequest, NextResponse } from 'next/server';
import { getGoogleAuthUrl } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const redirectUri = searchParams.get('redirect_uri');
    const state = searchParams.get('state');

    const authUrl = getGoogleAuthUrl(redirectUri || undefined, state || undefined);

    return NextResponse.redirect(authUrl);
  } catch (error) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/login?error=oauth_not_configured`
    );
  }
}
