import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail } from '@/lib/auth';
import { checkRateLimit, getClientIdentifier } from '@/lib/rateLimit';
import { sendPasswordResetEmail } from '@/lib/email';
import { randomBytes } from 'crypto';

const resetTokens = new Map<string, { email: string; expiresAt: number }>();

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
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
      return NextResponse.json(
        { message: 'If an account exists with this email, a password reset link has been sent.' },
        { status: 200 }
      );
    }

    if (!user.password) {
      return NextResponse.json(
        { message: 'This account uses Google OAuth. Please sign in with Google.' },
        { status: 400 }
      );
    }

    const resetToken = randomBytes(32).toString('hex');
    const expiresAt = Date.now() + 60 * 60 * 1000; // 1 hour

    resetTokens.set(resetToken, { email, expiresAt });

    const emailSent = await sendPasswordResetEmail(email, resetToken);

    if (!emailSent) {
      return NextResponse.json(
        { error: 'Failed to send password reset email. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'If an account exists with this email, a password reset link has been sent.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Password reset request error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    const resetData = resetTokens.get(token);

    if (!resetData) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 400 }
      );
    }

    if (Date.now() > resetData.expiresAt) {
      resetTokens.delete(token);
      return NextResponse.json(
        { error: 'Token has expired' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { valid: true, email: resetData.email },
      { status: 200 }
    );
  } catch (error) {
    console.error('Password reset validation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
