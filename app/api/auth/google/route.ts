import { NextRequest, NextResponse } from 'next/server';
import { getGoogleAuthUrl } from '@/lib/auth';
import { getBaseUrl } from '@/lib/security';


export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const redirectUri = searchParams.get('redirect_uri');
    const state = searchParams.get('state');

    const authUrl = getGoogleAuthUrl(redirectUri || undefined, state || undefined);

    return NextResponse.redirect(authUrl);
  } catch (error) {
    return NextResponse.redirect(
      `${getBaseUrl()}/login?error=oauth_not_configured`
    );
  }
}
