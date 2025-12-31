import { NextRequest, NextResponse } from 'next/server';
import { hashPassword, users, User } from '@/lib/auth';
import { validateResetToken } from '@/lib/reset-tokens';

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token and password are required' },
        { status: 400 }
      );
    }

    // Validate JWT token and get email
    const email = validateResetToken(token);
    
    if (!email) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }

    // Find user and update password
    const user = users.find((u: User) => u.email === email);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Hash new password
    const hashedPassword = await hashPassword(password);
    
    // Update user password
    user.password = hashedPassword;

    console.log(`Password reset successful for user: ${user.email}`);

    return NextResponse.json({
      success: true,
      message: 'Password has been reset successfully'
    });

  } catch (error) {
    console.error('Password reset confirmation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
