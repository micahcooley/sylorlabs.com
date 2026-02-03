import { NextResponse } from 'next/server';
import { getBaseUrl, getGoogleRedirectUri } from '@/lib/security';

export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return new NextResponse('Not Found', { status: 404 });
  }

  const envVars = {
    // Environment variables (show first few chars for safety)
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 
      `${process.env.GOOGLE_CLIENT_ID.substring(0, 8)}...` : 'NOT SET',
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? 
      `${process.env.GOOGLE_CLIENT_SECRET.substring(0, 8)}...` : 'NOT SET',
    VERCEL_URL: process.env.VERCEL_URL || 'NOT SET',
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'NOT SET',
    GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI || 'NOT SET',
    NODE_ENV: process.env.NODE_ENV || 'NOT SET',
    
    // Computed values
    computedBaseUrl: getBaseUrl(),
    computedGoogleRedirectUri: getGoogleRedirectUri(),
    
    // Test Google OAuth function directly
    googleOAuthTest: (() => {
      try {
        const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
        if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID === '') {
          return { error: 'GOOGLE_CLIENT_ID is empty' };
        }
        return { success: 'GOOGLE_CLIENT_ID is available', length: GOOGLE_CLIENT_ID.length };
      } catch (error) {
        return { error: error instanceof Error ? error.message : 'Unknown error' };
      }
    })(),
  };

  return NextResponse.json(envVars);
}
