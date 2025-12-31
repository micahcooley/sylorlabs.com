import { NextResponse } from 'next/server';
import { getBaseUrl, getGoogleRedirectUri } from '@/lib/security';

export async function GET() {
  const envVars = {
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 'SET' : 'NOT SET',
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? 'SET' : 'NOT SET',
    VERCEL_URL: process.env.VERCEL_URL || 'NOT SET',
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'NOT SET',
    GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI || 'NOT SET',
    computedBaseUrl: getBaseUrl(),
    computedGoogleRedirectUri: getGoogleRedirectUri(),
  };

  return NextResponse.json(envVars);
}
