import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser, generateToken } from '@/lib/auth';
import { isValidRedirectUrl } from '@/lib/security';

export async function POST(request: NextRequest) {
  try {
    const { emailOrUsername, password, redirectUri } = await request.json();

    if (!emailOrUsername || !password) {
      return NextResponse.json(
        { error: 'Email/username and password are required' },
        { status: 400 }
      );
    }

    const user = await authenticateUser(emailOrUsername, password);

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = generateToken(user.id, user.email);

    if (redirectUri) {
      // Validate the redirect URI to prevent open redirect attacks
      if (!isValidRedirectUrl(redirectUri)) {
        return NextResponse.json(
          { error: 'Invalid redirect URL' },
          { status: 400 }
        );
      }
      
      const separator = redirectUri.includes('?') ? '&' : '?';
      const redirectUrl = `${redirectUri}${separator}token=${token}`;
      
      return NextResponse.json({
        success: true,
        token,
        redirectUrl,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          profilePicture: user.profilePicture,
          googleId: user.googleId,
          hasGoogleLinked: !!user.googleId,
        },
      });
    }

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        googleId: user.googleId,
        hasGoogleLinked: !!user.googleId,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
