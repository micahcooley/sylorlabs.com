import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail } from '@/lib/auth';
import { createResetToken } from '@/lib/reset-tokens';
import { sendPasswordResetEmail } from '@/lib/email';
import { checkRateLimit, getClientIdentifier } from '@/lib/rateLimit';
import { validateCsrfToken } from '@/lib/csrf';

export async function POST(request: NextRequest) {
  try {
    const { email, csrfToken } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
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
      return NextResponse.json(
        { 
          error: 'Too many password reset attempts. Please try again later.',
          resetTime: rateLimit.resetTime
        },
        { status: 429 }
      );
    }

    const user = await findUserByEmail(email);
    
    if (!user) {
      return NextResponse.json({
        success: true,
        message: 'If an account with this email exists, a reset link has been sent.'
      });
    }

    if (!user.password) {
      return NextResponse.json({
        success: true,
        message: 'If an account with this email exists, a reset link has been sent.'
      });
    }

    const token = createResetToken(email);

    const emailSent = await sendPasswordResetEmail(email, token);

    if (!emailSent) {
      return NextResponse.json(
        { error: 'Failed to send password reset email. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'If an account with this email exists, a reset link has been sent.'
    });

  } catch (error) {
    console.error('Password reset request error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
