import { NextRequest, NextResponse } from 'next/server';
import { exchangeGoogleCode, findOrCreateGoogleUser, generateToken } from '@/lib/auth';
import { getBaseUrl } from '@/lib/url';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const referer = request.headers.get('referer');

    if (!code) {
      return NextResponse.json(
        { error: 'Authorization code not provided' },
        { status: 400 }
      );
    }

    // Parse combined state format "context:redirectUri"
    let redirectUri = '';
    let stateContext = state || '';
    if (state?.includes(':')) {
      const parts = state.split(':');
      stateContext = parts[0];
      redirectUri = parts.slice(1).join(':');
    }

    const googleProfile = await exchangeGoogleCode(code);
    const user = await findOrCreateGoogleUser(googleProfile);
    const token = generateToken(user.id, user.email);

    // Check if user came from signup page
    const cameFromSignup = referer?.includes('/signup') || stateContext === 'signup';

    console.log('OAuth callback debug:', {
      stateContext,
      redirectUri,
      referer,
      cameFromSignup,
      userEmail: user.email
    });

    // Check if we should redirect directly to the desktop app (legacy support for some flows)
    if (state && !state.includes(':') && state !== 'login' && state !== 'signup' && state.startsWith('http')) {
      const separator = state.includes('?') ? '&' : '?';
      const redirectUrl = `${state}${separator}token=${token}`;
      return NextResponse.redirect(redirectUrl);
    }

    // Default flow: redirect to home page with token for auto-login
    const baseUrl = getBaseUrl();
    let finalRedirectUrl = `${baseUrl}/?token=${token}&success=true`;
    
    // Only add redirect_uri if it's a desktop app flow
    if (redirectUri && redirectUri.startsWith('http')) {
      finalRedirectUrl += `&redirect_uri=${encodeURIComponent(redirectUri)}`;
    }

    return NextResponse.redirect(finalRedirectUrl);
  } catch (error) {
    console.error('Google OAuth error:', error);
    return NextResponse.redirect(
      `${getBaseUrl()}/login?error=oauth_failed`
    );
  }
}
