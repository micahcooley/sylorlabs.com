import { NextRequest, NextResponse } from 'next/server';
import { createUser, generateToken } from '@/lib/auth';
import { validateEmail, validatePassword, validateUsername } from '@/lib/validation';
import { checkRateLimit, getClientIdentifier } from '@/lib/rateLimit';
import { sendVerificationEmail } from '@/lib/email';
import { validateCsrfToken } from '@/lib/csrf';
import { logSecurityEvent, SecurityEventType } from '@/lib/logger';

export async function POST(request: NextRequest) {
  let email = '';
  
  try {
    const { username, email: userEmail, password, confirmPassword, csrfToken } = await request.json();
    email = userEmail;

    if (!email || !password || !confirmPassword) {
      return NextResponse.json(
        { error: 'Email, password, and confirm password are required' },
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
      logSecurityEvent(SecurityEventType.RATE_LIMIT_EXCEEDED, request, { email });
      return NextResponse.json(
        { 
          error: 'Too many signup attempts. Please try again later.',
          resetTime: rateLimit.resetTime
        },
        { status: 429 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      );
    }

    // Only validate username if provided
    if (username) {
      const usernameValidation = validateUsername(username);
      if (!usernameValidation.valid) {
        return NextResponse.json(
          { error: usernameValidation.message },
          { status: 400 }
        );
      }
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: passwordValidation.message },
        { status: 400 }
      );
    }

    const user = await createUser(username, email, password);
    const token = generateToken(user.id, user.email);

    logSecurityEvent(SecurityEventType.SIGNUP_SUCCESS, request, { userId: user.id, email: user.email });

    sendVerificationEmail(email, username).catch((err: unknown) => {
      console.error('Failed to send verification email:', err);
    });

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
        emailVerified: user.emailVerified,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    logSecurityEvent(SecurityEventType.SIGNUP_FAILED, request, { email });
    
    if (error instanceof Error && (
      error.message === 'Email is already registered' ||
      error.message === 'Username is already taken' ||
      error.message === 'Both email and username are already taken'
    )) {
      return NextResponse.json(
        { error: error.message },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
