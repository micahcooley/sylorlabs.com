import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail, verifyToken } from '@/lib/auth';
import { decodeVerificationToken, isTokenExpired } from '@/lib/email';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.redirect(new URL('/login?error=missing_token', request.url));
    }

    const decoded = decodeVerificationToken(token);

    if (!decoded) {
      return NextResponse.redirect(new URL('/login?error=invalid_token', request.url));
    }

    if (isTokenExpired(decoded.timestamp, 24)) {
      return NextResponse.redirect(new URL('/login?error=expired_token', request.url));
    }

    const user = await findUserByEmail(decoded.email);

    if (!user) {
      return NextResponse.redirect(new URL('/login?error=user_not_found', request.url));
    }

    if (user.emailVerified) {
      return NextResponse.redirect(new URL('/login?verified=already', request.url));
    }

    user.emailVerified = true;
    user.emailVerifiedAt = new Date();

    return NextResponse.redirect(new URL('/login?verified=true', request.url));
  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.redirect(new URL('/login?error=verification_failed', request.url));
  }
}
