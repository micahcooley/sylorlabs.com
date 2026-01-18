import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser, generateToken } from '@/lib/auth';
import { isValidRedirectUrl } from '@/lib/security';
import { checkRateLimit, recordFailedLogin, resetFailedLoginAttempts, getClientIdentifier } from '@/lib/rateLimit';
import { validateCsrfToken } from '@/lib/csrf';
import { logSecurityEvent, SecurityEventType } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const { emailOrUsername, password, redirectUri, csrfToken } = await request.json();

    if (!emailOrUsername || !password) {
      return NextResponse.json(
        { error: 'Email/username and password are required' },
        { status: 400 }
      );
    }

    if (!csrfToken || !validateCsrfToken(csrfToken)) {
      return NextResponse.json(
        { error: 'Invalid CSRF token' },
        { status: 403 }
      );
    }

    const clientIp = getClientIdentifier(request);

    const rateLimit = checkRateLimit(clientIp);
    if (!rateLimit.allowed) {
      logSecurityEvent(SecurityEventType.RATE_LIMIT_EXCEEDED, request, { email: emailOrUsername });
      return NextResponse.json(
        { 
          error: 'Too many login attempts. Please try again later.',
          resetTime: rateLimit.resetTime
        },
        { status: 429 }
      );
    }

    const user = await authenticateUser(emailOrUsername, password);

    if (!user) {
      const failedLogin = recordFailedLogin(emailOrUsername);
      logSecurityEvent(SecurityEventType.LOGIN_FAILED, request, { email: emailOrUsername });
      if (failedLogin.locked) {
        logSecurityEvent(SecurityEventType.ACCOUNT_LOCKED, request, { email: emailOrUsername });
        return NextResponse.json(
          { 
            error: 'Account locked due to too many failed login attempts. Please try again later.',
            lockedUntil: failedLogin.lockedUntil
          },
          { status: 423 }
        );
      }
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    resetFailedLoginAttempts(emailOrUsername);
    logSecurityEvent(SecurityEventType.LOGIN_SUCCESS, request, { userId: user.id, email: user.email });

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
