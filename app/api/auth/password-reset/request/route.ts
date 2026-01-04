import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail } from '@/lib/auth';
import { getBaseUrl } from '@/lib/url';
import crypto from 'crypto';

// In-memory store for reset tokens (in production, use a database)
const resetTokens = new Map<string, { email: string; expires: Date }>();

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await findUserByEmail(email);
    
    // Always return success to prevent email enumeration attacks
    if (!user) {
      return NextResponse.json({
        success: true,
        message: 'If an account with this email exists, a reset link has been sent.'
      });
    }

    // Generate reset token
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 3600000); // 1 hour from now
    
    // Store token (in production, store in database)
    resetTokens.set(token, { email, expires });

    // In development, log the reset link
    const resetUrl = `${getBaseUrl()}/login/password-reset/confirm?token=${token}`;
    console.log('Password reset link:', resetUrl);
    console.log('This would be sent to email:', email);

    // TODO: Send actual email using Resend or another email service
    // For now, we'll just log it for development
    
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

// Export the reset tokens store for use in the confirm route
export { resetTokens };
