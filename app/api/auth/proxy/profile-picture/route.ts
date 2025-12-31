import { NextRequest, NextResponse } from 'next/server';
import { isTrustedImageUrl, getBaseUrl } from '@/lib/security';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const pictureUrl = searchParams.get('url');

  if (!pictureUrl) {
    return NextResponse.json(
      { error: 'Picture URL is required' },
      { status: 400 }
    );
  }

  // Validate the URL to prevent SSRF attacks
  if (!isTrustedImageUrl(pictureUrl)) {
    return NextResponse.json(
      { error: 'Invalid image URL' },
      { status: 400 }
    );
  }

  try {
    // Fetch the image from Google
    const response = await fetch(pictureUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch profile picture' },
        { status: response.status }
      );
    }

    // Get the image data
    const imageBuffer = await response.arrayBuffer();
    
    // Get the content type from the original response
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    // Return the image with proper headers
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        'Access-Control-Allow-Origin': getBaseUrl(),
      },
    });
  } catch (error) {
    console.error('Profile picture proxy error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
