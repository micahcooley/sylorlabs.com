import { NextRequest, NextResponse } from 'next/server';
import { getGoogleAuthUrl } from '@/lib/auth';

export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return new NextResponse('Not Found', { status: 404 });
  }

  try {
    console.log('=== Google OAuth Debug Test ===');
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('VERCEL_URL:', process.env.VERCEL_URL);
    console.log('GOOGLE_CLIENT_ID exists:', !!process.env.GOOGLE_CLIENT_ID);
    console.log('GOOGLE_CLIENT_ID length:', process.env.GOOGLE_CLIENT_ID?.length);
    console.log('GOOGLE_CLIENT_SECRET exists:', !!process.env.GOOGLE_CLIENT_SECRET);
    
    // Test the exact function that's failing
    const authUrl = getGoogleAuthUrl();
    
    return NextResponse.json({
      success: true,
      authUrl,
      message: 'Google OAuth is working correctly'
    });
  } catch (error) {
    console.error('Google OAuth test error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      envDebug: {
        NODE_ENV: process.env.NODE_ENV,
        VERCEL_URL: process.env.VERCEL_URL,
        GOOGLE_CLIENT_ID_EXISTS: !!process.env.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_ID_LENGTH: process.env.GOOGLE_CLIENT_ID?.length,
        GOOGLE_CLIENT_SECRET_EXISTS: !!process.env.GOOGLE_CLIENT_SECRET,
      }
    }, { status: 500 });
  }
}
